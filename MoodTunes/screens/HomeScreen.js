import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

const moods = [
  { name: "Happy", colors: ["#ff9a9e", "#fad0c4"] },
  { name: "Sad", colors: ["#a1c4fd", "#c2e9fb"] },
  { name: "Relaxed", colors: ["#d4fc79", "#96e6a1"] },
  { name: "Energetic", colors: ["#fddb92", "#d1fdff"] },
];

const HomeScreen = ({ navigation }) => {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood.name);
    navigation.navigate("Results", { mood: mood.name });
  };

  return (
    <LinearGradient colors={["#1e3c72", "#fff"]} style={styles.container}>
      <Text style={styles.title}>Select Your Mood</Text>
      <FlatList
        data={moods}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleMoodSelect(item)}>
            <Card style={styles.card}>
              <LinearGradient colors={item.colors} style={styles.cardBackground}>
                <Card.Content>
                  <Text style={styles.moodText}>{item.name}</Text>
                </Card.Content>
              </LinearGradient>
            </Card>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  card: {
    width: 300,
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 4,
  },
  cardBackground: {
    paddingVertical: 20,
    alignItems: "center",
    borderRadius: 15,
  },
  moodText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});

export default HomeScreen;