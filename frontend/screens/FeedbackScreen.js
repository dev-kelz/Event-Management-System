import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8000',
  ios: 'http://localhost:8000',
});

const FeedbackScreen = ({ route }) => {
  const { eventId } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch(`${BASE_URL}/feedback/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setFeedbackList(data);
      } else {
        Alert.alert('Error', 'Failed to fetch feedback.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching feedback.');
    }
  };

  const submitFeedback = async () => {
    try {
      const response = await fetch(`${BASE_URL}/feedback/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event_id: eventId, rating, comment }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Feedback submitted successfully.');
        setRating(0);
        setComment('');
        fetchFeedback();
      } else {
        Alert.alert('Error', 'Failed to submit feedback.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while submitting feedback.');
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity key={star} onPress={() => setRating(star)}>
        <Ionicons
          name={star <= rating ? 'star' : 'star-outline'}
          size={32}
          color="#FFD700"
        />
      </TouchableOpacity>
    ));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Event Feedback</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Your Rating</Text>
        <View style={styles.starContainer}>{renderStars()}</View>

        <Text style={styles.label}>Your Comment</Text>
        <TextInput
          style={styles.input}
          placeholder="Tell us what you think"
          value={comment}
          onChangeText={setComment}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={submitFeedback}>
          <Text style={styles.buttonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.feedbackTitle}>What others are saying</Text>
      <FlatList
        data={feedbackList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.feedbackItem}>
            <Text style={styles.feedbackUser}>{item.user.username}</Text>
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= item.rating ? 'star' : 'star-outline'}
                  size={16}
                  color="#FFD700"
                />
              ))}
            </View>
            <Text style={styles.feedbackComment}>{item.comment}</Text>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  feedbackItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  feedbackUser: {
    fontWeight: 'bold',
  },
  feedbackComment: {
    marginTop: 5,
  },
});

export default FeedbackScreen;
