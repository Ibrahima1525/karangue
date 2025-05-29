import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from "react-native-maps";
import { useColorScheme } from "react-native";

const HistoriqueScreen = () => {
  const [reports, setReports] = useState([]);
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === "dark");

  useEffect(() => {
    const fetchReports = async () => {
      const data = await AsyncStorage.getItem("reports");
      if (data) setReports(JSON.parse(data));
    };
    fetchReports();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>
        {item.date} • {formatLabel(item.type)} ➜ {formatLabel(item.service)}
      </Text>

      {item.location && (
        <MapView
          style={styles.map}
          region={{
            latitude: item.location.latitude,
            longitude: item.location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Marker coordinate={item.location} />
        </MapView>
      )}

      <Text style={styles.description}>{item.description}</Text>

      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}
    </View>
  );

  const formatLabel = (value) => {
    const found = [...incidentTypes, ...services].find(
      (item) => item.value === value
    );
    return found ? `${found.icon} ${found.label}` : value;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>🗂️ Historique des signalements</Text>
      {reports.length === 0 ? (
        <Text style={styles.noData}>Aucun signalement enregistré.</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const incidentTypes = [
  { label: "Harcèlement", value: "harcelement", icon: "🗣️" },
  { label: "Vol", value: "vol", icon: "🖐️" },
  { label: "Agression", value: "agression", icon: "👊" },
  { label: "Vandalisme", value: "vandalisme", icon: "🧴" },
  { label: "Accident", value: "accident", icon: "🚗" },
  { label: "Incendie", value: "incendie", icon: "🔥" },
  { label: "Inondation", value: "inondation", icon: "🌊" },
  { label: "Électrocution", value: "electrocution", icon: "⚡" },
  { label: "Autre", value: "autre", icon: "❓" },
];

const services = [
  { label: "Police", value: "police", icon: "👮‍♂️" },
  { label: "Gendarmerie", value: "gendarmerie", icon: "🚓" },
  { label: "Pompiers", value: "pompiers", icon: "🚒" },
  { label: "Sécurité privée", value: "securite", icon: "🛡️" },
  { label: "Autre", value: "autre", icon: "❔" },
];

const createStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#1e272e" : "#f2f4f7",
      padding: 16,
    },
    pageTitle: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 20,
      textAlign: "center",
      color: isDark ? "#fff" : "#2c3e50",
    },
    noData: {
      textAlign: "center",
      fontSize: 16,
      color: "#888",
      marginTop: 50,
    },
    card: {
      backgroundColor: "#fff",
      padding: 15,
      borderRadius: 12,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: 15,
      fontWeight: "600",
      marginBottom: 10,
      color: "#2c3e50",
    },
    map: {
      height: 150,
      borderRadius: 10,
      marginBottom: 10,
    },
    description: {
      fontSize: 14,
      color: "#333",
      marginBottom: 10,
    },
    image: {
      width: "100%",
      height: 160,
      borderRadius: 10,
      marginBottom: 10,
    },
  });

export default HistoriqueScreen;
