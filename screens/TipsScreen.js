import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";

const tips = [
  {
    title: "Restez vigilant",
    description:
      "Soyez toujours attentif à votre environnement, surtout dans les zones peu fréquentées ou mal éclairées.",
    image: require("../assets/vigilance.png"),
  },
  {
    title: "Gardez vos objets en sécurité",
    description:
      "Ne laissez pas vos effets personnels sans surveillance et évitez d’exhiber des objets de valeur.",
    image: require("../assets/vigilance.png"),
  },
  {
    title: "Contactez les autorités",
    description:
      "En cas de danger, contactez rapidement la police ou les services d’urgence en composant le 17 ou le 112.",
    image: require("../assets/vigilance.png"),
  },
  {
    title: "Partagez votre position",
    description:
      "Utilisez le partage de position avec des proches si vous vous sentez en insécurité.",
    image: require("../assets/vigilance.png"),
  },
  {
    title: "Ayez une lampe",
    description:
      "Gardez une lampe de poche ou une application de lumière à portée de main si vous devez marcher dans l’obscurité.",
    image: require("../assets/vigilance.png"),
  },
];

const TipsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Conseils de Sécurité</Text>
      {tips.map((tip, index) => (
        <View key={index} style={styles.card}>
          <Image source={tip.image} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{tip.title}</Text>
            <Text style={styles.description}>{tip.description}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#2d3436",
    alignSelf: "center",
  },
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    color: "#636e72",
    fontSize: 14,
  },
});

export default TipsScreen;
