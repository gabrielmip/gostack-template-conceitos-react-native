import React, { useState, useEffect, addons } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";

import api from './services/api';


export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories')
      .then(({data}) => setRepositories(data))
      .catch((error) => {
        console.error(error);
        Alert.alert('Something went wrong while getting the posts. Try again in a moment.');
      });
  }, []);

  async function handleLikeRepository(requestedId) {
    console.log(requestedId);
    let updatedRepository;
    try {
      updatedRepository = await api.post(`repositories/${requestedId}/like`)
        .then(({data}) => data);
    } catch (error) {
      Alert.alert("Something went wrong while liking this post.");
    }

    setRepositories(repositories.map((repository) => (repository.id == requestedId)
      ? updatedRepository
      : repository));
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.repositoryContainer}
          data={repositories}
          keyExtractor={({id}) => id}
          renderItem={({item: {title, likes, techs, id}}) => (
            <View>
              <Text style={styles.repository}>
                {title}
              </Text>

              {Array.isArray(techs)
                ? <View style={styles.techsContainer}>
                    {techs.map((techName) => (
                      <Text key={techName} style={styles.tech}>{techName}</Text>
                    ))}
                  </View>
                : null}

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${id}`}>
                    {likes} curtida{(likes > 1) ? 's' : ''}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(id)}
                testID={`like-button-${id}`}>
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>

            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
