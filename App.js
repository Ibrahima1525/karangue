import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Screens
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import HistoryScreen from "./screens/HistoryScreen";
import TipsScreen from "./screens/TipsScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => {
      let iconName;

      if (route.name === "Accueil") iconName = "home";
      else if (route.name === "Carte") iconName = "map";
      else if (route.name === "Historique") iconName = "time";
      else if (route.name === "Conseils") iconName = "information-circle";
      else iconName = "ellipse";

      return {
        headerShown: true,
        headerStyle: {
          backgroundColor: "#0e5fcf",
        },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
        headerTitle: () => (
          <Image
            source={require("./assets/vigilance.png")}
            style={{ width: 200, height: 80, resizeMode: "contain" }}
          />
        ),
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={iconName} size={size} color={color} />
        ),
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0.5,
          borderTopColor: "#ccc",
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        tabBarActiveTintColor: "#0066cc",
        tabBarInactiveTintColor: "#999",
      };
    }}
  >
    <Tab.Screen name="Accueil" component={HomeScreen} />
    <Tab.Screen name="Carte" component={MapScreen} />
    <Tab.Screen
      name="Historique"
      component={HistoryScreen}
      options={{
        headerTitle: () => (
          <Image
            source={require("./assets/logo-karangue.png")}
            style={{ width: 120, height: 40, resizeMode: "contain" }}
          />
        ),
      }}
    />
    <Tab.Screen name="Conseils" component={TipsScreen} />
  </Tab.Navigator>
);

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {user ? (
        <MainTabs />
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "fade_from_bottom",
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
