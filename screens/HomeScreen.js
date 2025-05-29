import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase"; // <-- db importé ici
import { collection, addDoc } from "firebase/firestore"; // <-- firestore

const incidentTypes = [
  { label: "Harcèlement", value: "harcelement", color: "#FF9F43", icon: "🗣️" },
  { label: "Vol", value: "vol", color: "#FF6B6B", icon: "🖐️" },
  { label: "Agression", value: "agression", color: "#1DD1A1", icon: "👊" },
  { label: "Vandalisme", value: "vandalisme", color: "#A29BFE", icon: "🧴" },
  { label: "Accident", value: "accident", color: "#ff7675", icon: "🚗" },
  { label: "Incendie", value: "incendie", color: "#d63031", icon: "🔥" },
  { label: "Inondation", value: "inondation", color: "#74b9ff", icon: "🌊" },
  {
    label: "Électrocution",
    value: "electrocution",
    color: "#ffeaa7",
    icon: "⚡",
  },
  { label: "Autre", value: "autre", color: "#8395A7", icon: "❓" },
];

const services = [
  { label: "Police", value: "police", color: "#0984e3", icon: "👮‍♂️" },
  { label: "Gendarmerie", value: "gendarmerie", color: "#6c5ce7", icon: "🚓" },
  { label: "Pompiers", value: "pompiers", color: "#d63031", icon: "🚒" },
  { label: "Sécurité privée", value: "securite", color: "#00b894", icon: "🛡️" },
  { label: "Autre", value: "autre", color: "#b2bec3", icon: "❔" },
];

const HomeScreen = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState("vol");
  const [selectedService, setSelectedService] = useState("police");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === "dark");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={async () => {
            try {
              await signOut(auth);
              Alert.alert("Déconnecté", "Vous avez été déconnecté.");
              navigation.replace("Login");
            } catch (error) {
              Alert.alert("Erreur", "Impossible de se déconnecter.");
              console.log(error);
            }
          }}
          style={{ marginRight: 15 }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Déco</Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "#0984e3",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erreur", "Permission de localisation refusée");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const pickImage = async () => {
    Alert.alert(
      "Ajouter une photo",
      "Choisissez une option",
      [
        {
          text: "Caméra",
          onPress: async () => {
            const { status } =
              await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
              Alert.alert(
                "Permission refusée",
                "La caméra n'est pas accessible."
              );
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              quality: 0.5,
            });
            if (!result.canceled) {
              setImage(result.assets[0].uri);
            }
          },
        },
        {
          text: "Galerie",
          onPress: async () => {
            const { status } =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
              Alert.alert(
                "Permission refusée",
                "La galerie n'est pas accessible."
              );
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              quality: 0.5,
            });
            if (!result.canceled) {
              setImage(result.assets[0].uri);
            }
          },
        },
        {
          text: "Annuler",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Erreur", "Veuillez entrer une description.");
      return;
    }

    const newReport = {
      id: Date.now().toString(),
      type: selectedType,
      service: selectedService,
      description,
      image,
      location,
      date: new Date().toLocaleString(),
    };

    try {
      // 1. Stockage local
      const existing = await AsyncStorage.getItem("reports");
      const reports = existing ? JSON.parse(existing) : [];
      reports.unshift(newReport);
      await AsyncStorage.setItem("reports", JSON.stringify(reports));

      // 2. 🔥 Stockage Firestore
      await addDoc(collection(db, "incidents"), newReport);

      Alert.alert("Signalement envoyé", "Merci pour votre contribution.");

      // Reset
      setSelectedType("vol");
      setSelectedService("police");
      setDescription("");
      setImage(null);
    } catch (e) {
      Alert.alert("Erreur", "Impossible d'enregistrer le signalement.");
      console.log(e);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
      extraScrollHeight={20}
      enableOnAndroid={true}
    >
      <Text style={styles.title}>📍 Nouveau Signalement</Text>

      {location && (
        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation
        >
          <Marker coordinate={location} />
        </MapView>
      )}

      <View style={styles.typeContainer}>
        {incidentTypes.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.typeButton,
              {
                backgroundColor:
                  selectedType === item.value ? item.color : "#f0f0f0",
              },
            ]}
            onPress={() => setSelectedType(item.value)}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.typeText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Service concerné :</Text>
      <View style={styles.serviceContainer}>
        {services.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.serviceButton,
              {
                backgroundColor:
                  selectedService === item.value ? item.color : "#f0f0f0",
              },
            ]}
            onPress={() => setSelectedService(item.value)}
          >
            <Text
              style={[
                styles.serviceText,
                {
                  color: selectedService === item.value ? "#fff" : "#333",
                },
              ]}
            >
              {item.icon} {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Décrivez l’incident..."
        multiline
        value={description}
        onChangeText={setDescription}
      />

      {image ? (
        <View style={{ marginBottom: 15 }}>
          <Image source={{ uri: image }} style={styles.imagePreview} />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity onPress={pickImage}>
              <Text style={[styles.photoText, { color: "#0984e3" }]}>
                📸 Remplacer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setImage(null)}>
              <Text style={[styles.photoText, { color: "#d63031" }]}>
                🗑️ Supprimer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <Text style={styles.photoText}>📸 Ajouter une photo</Text>
        </TouchableOpacity>
      )}

      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>ENVOYER</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={async () => {
          try {
            await signOut(auth);
            Alert.alert("Déconnecté", "Vous avez été déconnecté.");
            navigation.replace("Login");
          } catch (error) {
            Alert.alert("Erreur", "Impossible de se déconnecter.");
            console.log(error);
          }
        }}
        style={{
          marginTop: 15,
          alignSelf: "center",
          paddingVertical: 10,
          paddingHorizontal: 20,
          backgroundColor: "#d63031",
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Se déconnecter
        </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};

const createStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#1e272e" : "#f2f4f7",
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 15,
      color: isDark ? "#ffffff" : "#2c3e50",
      textAlign: "center",
    },
    map: {
      width: "100%",
      height: 180,
      borderRadius: 16,
      overflow: "hidden",
      marginBottom: 20,
    },
    typeContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    typeButton: {
      width: "26%",
      aspectRatio: 1,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f0f0f0",
      marginBottom: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    icon: {
      fontSize: 24,
    },
    typeText: {
      fontSize: 15,
      fontWeight: "600",
      textAlign: "center",
      color: "#2d3436",
    },
    label: {
      marginBottom: 10,
      fontWeight: "bold",
      color: "#2d3436",
      fontSize: 14,
    },
    serviceContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 20,
    },
    serviceButton: {
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 20,
      marginRight: 8,
      marginBottom: 10,
      backgroundColor: "#f0f0f0",
    },
    serviceText: {
      fontSize: 15,
      fontWeight: "600",
    },
    input: {
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 12,
      height: 100,
      textAlignVertical: "top",
      marginBottom: 15,
      fontSize: 14,
      borderColor: "#ccc",
      borderWidth: 1,
    },
    photoButton: {
      alignSelf: "center",
      marginBottom: 15,
    },
    photoText: {
      fontSize: 16,
      color: "#0984e3",
      fontWeight: "500",
    },
    imagePreview: {
      width: "100%",
      height: 160,
      borderRadius: 10,
      marginBottom: 15,
    },
    submitButton: {
      backgroundColor: "#0984e3",
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 3,
      marginTop: 10,
    },
    submitText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
  });

export default HomeScreen;
