import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ActivityIndicator } from "react-native";
import axios from "axios";
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// About Screen Component
function AboutScreen() {
  return (
    <View style={styles.aboutContainer}>
      <Text style={styles.aboutTitle}>About Plant Detector</Text>
      <Text style={styles.aboutText}>
        Plant Detector is an app that helps you identify plants and diagnose potential diseases or health issues. 
        For inquiries, contact us at: contact@plantdetector.com
      </Text>
    </View>
  );
}

function PlantDetectorApp({ navigation }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need permission to access your gallery to select a plant photo."
        );
      }
    };
    requestPermission();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image: ", error);
      Alert.alert("Error", "Something went wrong while picking the image.");
    }
  };

  const analyzeImage = async (uri) => {
    setLoading(true);
    setDiagnosis(null);

    const formData = new FormData();
    formData.append('image', {
      uri,
      name: 'plant.jpg',
      type: 'image/jpg',
    });

    try {
      const response = await axios.post(
        'https://api.plant.id/v2/identify',
        formData,
        {
          headers: {
            'Api-Key': '---',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const plant = response.data.suggestions[0];
      if (plant) {
        setDiagnosis(
          `This plant is a ${plant.plant_name}. ${plant.disease || 'It seems healthy.'}`
        );
      } else {
        setDiagnosis("No plant detected. Try a clearer photo.");
      }
    } catch (error) {
      console.error("Error during plant disease analysis:", error);
      setDiagnosis("Error analyzing the plant. Please try again.");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Plant Detector</Text>
      </View>
      {image && (
        <Image
          source={{ uri: image }}
          style={styles.image}
        />
      )}
      <TouchableOpacity
        onPress={pickImage}
        style={styles.uploadButton}
      >
        <Ionicons name="camera" size={24} color="white" />
        <Text style={styles.uploadText}>Upload a Plant Photo</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#2e7d32" style={styles.loadingIndicator} />}
      {diagnosis && (
        <Text style={styles.diagnosisText}>{diagnosis}</Text>
      )}
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={({ navigation, route }) => ({
          headerRight: () => {
            if (route.name === 'About') {
              return null;
            }
            return (
              <TouchableOpacity 
                onPress={() => navigation.navigate('About')} 
                style={styles.aboutButton}
              >
                <Ionicons name="information-circle" size={30} color="#fff" />
              </TouchableOpacity>
            );
          },
          headerStyle: { backgroundColor: '#2e7d32' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        })}
      >
        <Stack.Screen name="Home" component={PlantDetectorApp} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center", // Centered title
    width: "100%",
    padding: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2e7d32", // Green title
  },
  aboutButton: {
    position: 'absolute',
    right: 10,
    borderRadius: 25,
    padding: 10, // Adjusted padding for better look
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 15,
    marginBottom: 30,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
    elevation: 5,
  },
  uploadText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  diagnosisText: {
    marginTop: 30,
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    fontWeight: "600",
  },
  aboutContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32", // Green title
    marginBottom: 20,
  },
  aboutText: {
    fontSize: 18,
    textAlign: "center",
    color: "#333",
    marginBottom: 15,
  },
});
