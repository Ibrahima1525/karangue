import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Image, // ✅ Ajout pour le logo
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterScreen({ navigation }) {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [genre, setGenre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!prenom || !nom || !genre || !email || !password || !confirmPassword) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 6 caractères."
      );
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        prenom,
        nom,
        genre,
        email,
        createdAt: new Date(),
      });

      Alert.alert("Succès", "Compte créé avec succès !");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  const genres = ["Homme", "Femme", "Autre"];

  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* ✅ Logo ajouté ici */}
          <Animatable.View animation="fadeInDown" style={styles.logoContainer}>
            <Image
              source={require("../assets/vigilance.png")}
              style={styles.logo}
            />
          </Animatable.View>

          <Animatable.Text animation="fadeInDown" style={styles.title}>
            Créer un compte
          </Animatable.Text>

          <Animatable.View animation="fadeInUp" delay={200} style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              placeholderTextColor="#ccc"
              value={prenom}
              onChangeText={setPrenom}
            />
            <TextInput
              style={styles.input}
              placeholder="Nom"
              placeholderTextColor="#ccc"
              value={nom}
              onChangeText={setNom}
            />
            <View style={styles.genreContainer}>
              {genres.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.genreButton,
                    genre === item && styles.genreButtonSelected,
                  ]}
                  onPress={() => setGenre(item)}
                >
                  <Text
                    style={[
                      styles.genreText,
                      genre === item && styles.genreTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#ccc"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Mot de passe"
                placeholderTextColor="#ccc"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={24}
                  color="#ccc"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirmer le mot de passe"
                placeholderTextColor="#ccc"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={24}
                  color="#ccc"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>
                Déjà un compte ? <Text style={styles.link}>Se connecter</Text>
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </KeyboardAvoidingView>

        <Modal transparent={true} visible={loading}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Création du compte...</Text>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },

  logoContainer: { alignItems: "center", marginBottom: 10 }, // ✅
  logo: { width: 200, height: 80, resizeMode: "contain" }, // ✅

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
  },
  form: {
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
  genreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  genreButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  genreButtonSelected: { backgroundColor: "#fff" },
  genreText: { color: "#ccc" },
  genreTextSelected: { color: "#3b5998", fontWeight: "bold" },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  passwordInput: { flex: 1, height: 50, color: "#fff" },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: "#3b5998", fontWeight: "bold", fontSize: 16 },
  backText: { textAlign: "center", color: "#fff" },
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
  loadingText: { marginTop: 12, color: "#fff", fontSize: 18 },
});
