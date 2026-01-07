import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

const TaskListScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const insets = useSafeAreaInsets();

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/events`);
      const data = await res.json();
      if (data.success && Array.isArray(data.events)) {
        // Sort events by ID (newest first)
        const sortedEvents = data.events.sort((a, b) => b.id - a.id);
        setEvents(sortedEvents);
      } else {
        setEvents([]);
      }
    } catch (e) {
      console.error('Fetch events error:', e);
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  // Refresh events when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchEvents();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const handleEventPress = (event) => {
    navigation.navigate('TaskManagement', {
      eventId: event.id,
      eventTitle: event.title
    });
  };

  const handleEditEvent = (event) => {
    navigation.navigate('CreateEvent', {
      eventId: event.id,
      editMode: true,
      eventData: event
    });
  };

  const handleDeleteEvent = (event) => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${event.title}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/api/events/${event.id}`, {
                method: 'DELETE',
              });
              
              if (response.ok) {
                Alert.alert('Success', 'Event deleted successfully');
                fetchEvents(); // Refresh the list
              } else {
                Alert.alert('Error', 'Failed to delete event');
              }
            } catch (error) {
              console.error('Error deleting event:', error);
              Alert.alert('Error', 'Failed to delete event');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Task Management</Text>
        <Text style={styles.headerSubtitle}>
          {events.length > 0 
            ? `${events.length} event${events.length !== 1 ? 's' : ''} available` 
            : 'Select an event to manage tasks'}
        </Text>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {events.length > 0 ? (
            <View style={styles.eventsList}>
              {events.map((event) => (
                <View key={event.id} style={styles.eventCard}>
                  <TouchableOpacity
                    style={styles.eventCardMain}
                    onPress={() => handleEventPress(event)}
                  >
                    <View style={styles.eventIconContainer}>
                      <Ionicons name="calendar" size={24} color="#007AFF" />
                    </View>
                    <View style={styles.eventContent}>
                      <Text style={styles.eventTitle} numberOfLines={1}>
                        {event.title}
                      </Text>
                      <Text style={styles.eventSubtitle}>
                        Tap to manage event tasks
                      </Text>
                      {event.date && (
                        <View style={styles.locationRow}>
                          <Ionicons name="time-outline" size={12} color="#666" />
                          <Text style={styles.locationText}>{event.date}</Text>
                        </View>
                      )}
                      {event.location && (
                        <View style={styles.locationRow}>
                          <Ionicons name="location-outline" size={12} color="#666" />
                          <Text style={styles.locationText}>{event.location}</Text>
                        </View>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                  </TouchableOpacity>
                  
                  {/* Action Buttons - Only for Event Organizers */}
                  {currentUser && event.created_by === currentUser.id && (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleEditEvent(event)}
                      >
                        <Ionicons name="create-outline" size={18} color="#007AFF" />
                        <Text style={styles.actionButtonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDeleteEvent(event)}
                      >
                        <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                        <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No Events Yet</Text>
              <Text style={styles.emptySubtitle}>
                Create an event to start managing tasks
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('CreateEvent')}
              >
                <Ionicons name="add-circle" size={20} color="#fff" />
                <Text style={styles.createButtonText}>Create Event</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  eventsList: {
    padding: 20,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  eventCardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  eventIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  eventSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 12,
    borderRadius: 6,
    backgroundColor: '#F8F9FA',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FFF5F5',
  },
  deleteButtonText: {
    color: '#FF3B30',
  },
});

export default TaskListScreen;
