import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  Image,
  Dimensions, // 👈 Ajouté
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";

// Obtenir la largeur de l’écran
const screenWidth = Dimensions.get("window").width;

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <Animatable.View animation="fadeInDown" style={styles.logoContainer}>
            <Image
              source={require("../assets/vigilance.png")}
              style={styles.logo}
            />
          </Animatable.View>

          <Animatable.Text animation="fadeInDown" style={styles.title}>
            Connexion
          </Animatable.Text>

          <Animatable.View
            animation="fadeInUp"
            delay={200}
            style={styles.inputContainer}
          >
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#ccc"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor="#ccc"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerText}>
                Pas encore de compte ?{" "}
                <Text style={styles.link}>S'inscrire</Text>
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal transparent={true} visible={loading}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Connexion...</Text>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: screenWidth * 0.5,
    height: screenWidth * 0.5 * 0.4,
    resizeMode: "contain",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
  },
  inputContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 20,
  },
  input: {
    height: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: "#fff",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#3b5998",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerText: {
    textAlign: "center",
    color: "#fff",
  },
  link: {
    textDecorationLine: "underline",
    fontWeight: "bold",
    color: "#ffd700",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#fff",
    fontSize: 18,
  },
});
