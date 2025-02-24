import React, { useState, useRef, useEffect } from 'react';
import { Alert, Button, StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // You can replace this with a more custom picker
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Home Screen Component
function HomeScreen() {
  const [breadType, setBreadType] = useState('white');
  const [toastVisible, setToastVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isToasting, setIsToasting] = useState(false);

  const toastProgress = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);

  const breadTimes = {
    white: 5,
    wholeWheat: 6,
    sourdough: 7,
    rye: 8,
    baguette: 9,
    multigrain: 7,
    glutenFree: 6,
    brioche: 8,
    ciabatta: 7,
    pumpernickel: 8
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimeLeft(null);
    setToastVisible(false);
    setIsToasting(false);
    toastProgress.setValue(0);
  };

  const handleBreadChange = (newBread) => {
    setBreadType(newBread);
    resetTimer(); // Reset the timer when a new bread type is selected
  };

  const startToasting = () => {
    resetTimer(); // Ensure no previous timer is running
    setToastVisible(true);
    setIsToasting(true);  // Mark toasting as in progress

    const timer = breadTimes[breadType];
    setTimeLeft(timer);

    Animated.timing(toastProgress, {
      toValue: 1,
      duration: timer * 1000,
      useNativeDriver: false,
    }).start();

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTimeLeft = prev - 1;
        if (newTimeLeft <= 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setToastVisible(false);
          setIsToasting(false);  // Mark toasting as completed
          Alert.alert('Done!', 'Your toast is ready!');
          return 0;
        }
        return newTimeLeft;
      });
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose Your Bread Type:</Text>
      <Picker selectedValue={breadType} style={styles.picker} onValueChange={handleBreadChange}>
        {Object.keys(breadTimes).map((key) => (
          <Picker.Item key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={key} />
        ))}
      </Picker>

      {/* Conditionally render the Start Toasting button */}
      {!isToasting && (
        <Button title="Start Toasting!" onPress={startToasting} color="#f79c42" />
      )}

      {toastVisible && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>Toasting {breadType}...</Text>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: toastProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      )}

      {toastVisible && <Text style={styles.timerText}>Time left: {timeLeft}s</Text>}
    </View>
  );
}

// About Screen Component
function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.aboutTitle}>About This App</Text>
      <Text style={styles.aboutText}>
        The Burned Toast App helps you toast different types of bread with a timer and progress bar. 
        It offers various bread options and toasts them to perfection!
      </Text>
    </View>
  );
}

// Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={({ navigation, route }) => ({
          headerRight: () => {
            // Check if we're on the About screen, and hide the About button accordingly
            if (route.name === 'About') {
              return null;  // Hide the button on the About screen
            }
            return (
              <TouchableOpacity style={styles.aboutButton} onPress={() => navigation.navigate('About')}>
                <Text style={styles.aboutButtonText}>About</Text>
              </TouchableOpacity>
            );
          },
          headerStyle: { backgroundColor: '#f79c42' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        })}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16, justifyContent: 'center', alignItems: 'center' },
  picker: { height: 230, width: '80%', alignSelf: 'center', marginBottom: 100, borderColor: '#f79c42', borderWidth: 2, borderRadius: 10 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#f39c12' },
  toastContainer: { alignItems: 'center', width: '80%' },
  toastText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  progressBar: { height: 10, backgroundColor: '#f79c42', borderRadius: 5, width: '100%' },
  timerText: { fontSize: 20, fontWeight: 'bold', marginTop: 20, textAlign: 'center', color: '#f39c12' },
  aboutTitle: { fontSize: 22, fontWeight: "bold", color: "black" },
  aboutText: { fontSize: 16, textAlign: 'center', margin: 20, color: "#333" },
  aboutButton: { marginRight: 15, padding: 8 },
  aboutButtonText: { fontSize: 16, color: "#fff", fontWeight: 'bold' },
});
