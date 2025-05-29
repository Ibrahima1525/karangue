import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MapScreen = () => {
  const [reports, setReports] = useState([]);
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const getLocationAndReports = async () => {
      // Permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission de localisation refusée.");
        return;
      }

      // Position utilisateur
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      // Chargement des signalements
      const data = await AsyncStorage.getItem("reports");
      const parsed = data ? JSON.parse(data) : [];
      setReports(parsed);
    };

    getLocationAndReports();
  }, []);

  if (!region) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text>Chargement de la carte...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} showsUserLocation>
        {userLocation && (
          <Marker
            coordinate={userLocation}
            pinColor="blue"
            title="Vous êtes ici"
          />
        )}

        {reports.map(
          (report) =>
            report.location && (
              <Marker
                key={report.id}
                coordinate={report.location}
                pinColor={getColorByType(report.type)}
              >
                <Callout tooltip>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>
                      {formatType(report.type)}
                    </Text>
                    <Text style={styles.calloutDesc}>{report.description}</Text>
                    <Text style={styles.calloutDate}>{report.date}</Text>
                  </View>
                </Callout>
              </Marker>
            )
        )}
      </MapView>
    </View>
  );
};

const getColorByType = (type) => {
  switch (type) {
    case "vol":
      return "#e74c3c";
    case "harcelement":
      return "#f39c12";
    case "agression":
      return "#2ecc71";
    case "vandalisme":
      return "#8e44ad";
    default:
      return "#7f8c8d";
  }
};

const formatType = (type) => {
  const types = {
    vol: "Vol",
    harcelement: "Harcèlement",
    agression: "Agression",
    vandalisme: "Vandalisme",
  };
  return types[type] || "Autre";
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  callout: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    width: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  calloutDesc: {
    fontSize: 14,
    marginTop: 4,
    color: "#666",
  },
  calloutDate: {
    fontSize: 12,
    marginTop: 6,
    color: "#aaa",
    textAlign: "right",
  },
});

export default MapScreen;
