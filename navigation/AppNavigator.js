// navigation/AppNavigator.js

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

// Écrans
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import HistoryScreen from "../screens/HistoryScreen";
import TipsScreen from "../screens/TipsScreen";
import AccountScreen from "../screens/AccountScreen"; // ✅ Ajout de l’écran Compte
import NotificationScreen from "../screens/NotificationScreen";

// ...

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Accueil">
        <Stack.Screen name="Accueil" component={HomeScreen} />
        <Stack.Screen name="Carte" component={MapScreen} />
        <Stack.Screen name="Historique" component={HistoryScreen} />
        <Stack.Screen name="Conseils" component={TipsScreen} />
        <Stack.Screen name="Compte" component={AccountScreen} />{" "}
        <Stack.Screen name="Notifications" component={NotificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
