import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase";
import { signOut, updateProfile } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AccountScreen = () => {
  const user = auth.currentUser;
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === "dark");

  const [newName, setNewName] = useState(user?.displayName || "");
  const [signalements, setSignalements] = useState([]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Déconnecté", "Vous avez été déconnecté.");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de se déconnecter.");
      console.log(error);
    }
  };

  const handleNameUpdate = async () => {
    try {
      await updateProfile(user, { displayName: newName });
      Alert.alert("Nom mis à jour !");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour le nom.");
      console.log(error);
    }
  };

  const fetchSignalements = async () => {
    try {
      const q = query(
        collection(db, "signalements"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSignalements(items);
    } catch (error) {
      console.log("Erreur chargement signalements :", error);
    }
  };

  useEffect(() => {
    fetchSignalements();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Mon Compte",
      headerStyle: { backgroundColor: "#0984e3" },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "bold" },
    });
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons
        name="person-circle-outline"
        size={100}
        color="#0984e3"
        style={{ marginBottom: 20 }}
      />

      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={newName}
        onChangeText={setNewName}
        placeholderTextColor="#ccc"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleNameUpdate}>
        <Text style={styles.saveText}>Mettre à jour le nom</Text>
      </TouchableOpacity>

      <Text style={styles.emailText}>{user?.email}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Mes signalements</Text>
      <FlatList
        data={signalements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reportItem}>
            <Text style={styles.reportText}>
              {item.type} - {item.date || "Sans date"}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucun signalement.</Text>
        }
        style={{ width: "100%", marginTop: 10 }}
      />
    </View>
  );
};

const createStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: isDark ? "#1e272e" : "#f2f4f7",
      padding: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
      width: "100%",
      color: "#000",
      backgroundColor: "#fff",
    },
    saveButton: {
      backgroundColor: "#0984e3",
      padding: 10,
      borderRadius: 10,
      marginBottom: 20,
    },
    saveText: {
      color: "#fff",
      fontWeight: "bold",
      textAlign: "center",
    },
    emailText: {
      fontSize: 16,
      color: isDark ? "#ccc" : "#636e72",
      marginBottom: 20,
    },
    logoutButton: {
      backgroundColor: "#d63031",
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 10,
      marginBottom: 20,
    },
    logoutText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 10,
      marginBottom: 5,
      color: isDark ? "#fff" : "#2d3436",
      alignSelf: "flex-start",
    },
    reportItem: {
      backgroundColor: "#fff",
      padding: 10,
      borderRadius: 10,
      marginVertical: 5,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2,
    },
    reportText: {
      fontSize: 14,
      color: "#2d3436",
    },
    emptyText: {
      color: "#999",
      marginTop: 10,
      fontStyle: "italic",
    },
  });

export default AccountScreen;
