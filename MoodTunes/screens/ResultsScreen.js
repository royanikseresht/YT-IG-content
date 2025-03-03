import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import YoutubePlayer from "react-native-youtube-iframe";
import axios from "axios";

const YOUTUBE_API_KEY = "";

const ResultsScreen = ({ route }) => {
  const { mood } = route.params;
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: "snippet",
            q: `${mood} music`,
            key: YOUTUBE_API_KEY,
            type: "video",
            maxResults: 10,
          },
        }
      );
      setSongs(response.data.items);
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#1e3c72", "#fff"]} style={styles.container}>
      <Text style={styles.title}>Songs for {mood} Mood</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id.videoId}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {
              setPlayingVideoId(item.id.videoId);
              setIsPlaying(true);
            }}>
              <Card style={styles.card}>
                <LinearGradient colors={["#fddb92", "#d1fdff"]} style={styles.cardBackground}>
                  <Card.Content>
                    <Text style={styles.songTitle}>{item.snippet.title}</Text>
                    <Text style={styles.artistName}>{item.snippet.channelTitle}</Text>
                  </Card.Content>
                </LinearGradient>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
      {playingVideoId && (
        <View style={styles.playerContainer}>
          <YoutubePlayer
            height={250}
            width={"100%"}
            play={isPlaying}
            videoId={playingVideoId}
            onChangeState={(state) => {
              if (state === "ended") {
                setPlayingVideoId(null);
                setIsPlaying(false);
              }
            }}
          />
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
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
  songTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  artistName: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  playerContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
});

export default ResultsScreen;
