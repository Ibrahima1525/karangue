import React from "react";
import { Button, StyleSheet } from "react-native";

const CustomButton = ({ title, onPress }) => (
  <Button title={title} onPress={onPress} color="#0066cc" />
);

export default CustomButton;
