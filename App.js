import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, View, Text } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "./firebase";

// Écrans
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import HistoryScreen from "./screens/HistoryScreen";
import TipsScreen from "./screens/TipsScreen";
import AccountScreen from "./screens/AccountScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import NotificationScreen from "./screens/NotificationScreen";

// Navigations
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

const HomeStackScreen = ({ unreadCount, navigation }) => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{
        headerStyle: { backgroundColor: "#0e5fcf" },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
        headerTitle: () => (
          <Image
            source={require("./assets/vigilance.png")}
            style={{ width: 200, height: 80, resizeMode: "contain" }}
          />
        ),
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Compte")}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="person-circle-outline" size={28} color="#fff" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}
            style={{ marginRight: 20 }}
          >
            <View>
              <Ionicons name="notifications-outline" size={26} color="#fff" />
              {unreadCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    right: -4,
                    top: -4,
                    backgroundColor: "red",
                    borderRadius: 8,
                    width: 16,
                    height: 16,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 10 }}>
                    {unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ),
      }}
    />
  </HomeStack.Navigator>
);

const MainTabs = ({ navigation }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const q = query(
          collection(db, "notifications"),
          where("idUtilisateur", "==", currentUser.uid),
          where("lu", "==", false)
        );

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          setUnreadCount(snapshot.size);
        });

        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        let iconName;
        if (route.name === "Carte") iconName = "map";
        else if (route.name === "Historique") iconName = "time";
        else if (route.name === "Conseils") iconName = "information-circle";

        return {
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
      <Tab.Screen
        name="Accueil"
        children={() => (
          <HomeStackScreen unreadCount={unreadCount} navigation={navigation} />
        )}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen name="Carte" component={MapScreen} />
      <Tab.Screen name="Historique" component={HistoryScreen} />
      <Tab.Screen name="Conseils" component={TipsScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="Compte"
              component={AccountScreen}
              options={{
                headerShown: true,
                title: "Mon Compte",
                headerStyle: { backgroundColor: "#0e5fcf" },
                headerTintColor: "#fff",
              }}
            />
            <Stack.Screen
              name="Notifications"
              component={NotificationScreen}
              options={{
                headerShown: true,
                title: "Mes notifications",
                headerStyle: { backgroundColor: "#0e5fcf" },
                headerTintColor: "#fff",
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
