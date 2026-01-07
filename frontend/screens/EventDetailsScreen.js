import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
  Dimensions,
  Platform,
  StatusBar,
  ImageBackground
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationService from '../services/NotificationService';

const EventDetailsScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchEventDetails();
    loadCurrentUser();
  }, [eventId]);

  const loadCurrentUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        // Check if user is already registered for this event
        await checkRegistrationStatus(user.id);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const checkRegistrationStatus = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrations/user/${userId}/event/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setIsRegistered(data.is_registered || false);
      }
    } catch (error) {
      console.error('Error checking registration status:', error);
    }
  };

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        // Backend returns {success: true, event: {...}}
        if (data.success && data.event) {
          setEvent(data.event);
        } else {
          // Use dummy data as fallback if API doesn't have the event
          const dummyEvents = [
            {
              id: 1,
              title: "React Native Workshop",
              date: "2024-07-01",
              time: "10:00",
              location: "Tech Hub Downtown",
              description: "Learn React Native development from scratch. Perfect for beginners who want to build mobile apps.",
              image_url: null,
              local_image: "event-img.jpg"
            },
            {
              id: 2,
              title: "Jazz Night Live",
              date: "2024-07-15",
              time: "19:30",
              location: "Blue Note Jazz Club",
              description: "An evening of smooth jazz featuring local artists. Come enjoy great music and atmosphere.",
              image_url: null,
              local_image: "event-img1.jpg"
            },
            {
              id: 3,
              title: "Startup Pitch Competition",
              date: "2024-07-20",
              time: "14:00",
              location: "Innovation Center",
              description: "Watch innovative startups pitch their ideas to investors. Network with entrepreneurs and investors.",
              image_url: null,
              local_image: "event-img2.jpg"
            },
            {
              id: 4,
              title: "Photography Exhibition",
              date: "2024-07-25",
              time: "11:00",
              location: "City Art Gallery",
              description: "Explore stunning photography from local artists. Free entry with refreshments provided.",
              image_url: null,
              local_image: "event-img3.jpg"
            },
            {
              id: 5,
              title: "Food Festival 2024",
              date: "2024-08-01",
              time: "12:00",
              location: "Central Park",
              description: "Taste delicious food from around the world. Live cooking demonstrations and music.",
              image_url: null,
              local_image: "event-img4.jpg"
            },
            {
              id: 6,
              title: "Tech Conference",
              date: "2024-08-10",
              time: "09:00",
              location: "Convention Center",
              description: "Latest trends in technology and innovation. Keynote speakers and networking opportunities.",
              image_url: null,
              local_image: "event-img5.jpg"
            }
          ];

          const dummyEvent = dummyEvents.find(e => e.id === eventId);
          if (dummyEvent) {
            setEvent(dummyEvent);
          } else {
            Alert.alert('Error', 'Event not found');
            navigation.goBack();
          }
        }
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      // Use dummy data as fallback when API fails
      const dummyEvents = [
        {
          id: 1,
          title: "React Native Workshop",
          date: "2024-07-01",
          time: "10:00",
          location: "Tech Hub Downtown",
          description: "Learn React Native development from scratch. Perfect for beginners who want to build mobile apps.",
          image_url: null,
          local_image: "event-img.jpg"
        },
        {
          id: 2,
          title: "Jazz Night Live",
          date: "2024-07-15",
          time: "19:30",
          location: "Blue Note Jazz Club",
          description: "An evening of smooth jazz featuring local artists. Come enjoy great music and atmosphere.",
          image_url: null,
          local_image: "event-img1.jpg"
        },
        {
          id: 3,
          title: "Startup Pitch Competition",
          date: "2024-07-20",
          time: "14:00",
          location: "Innovation Center",
          description: "Watch innovative startups pitch their ideas to investors. Network with entrepreneurs and investors.",
          image_url: null,
          local_image: "event-img2.jpg"
        },
        {
          id: 4,
          title: "Photography Exhibition",
          date: "2024-07-25",
          time: "11:00",
          location: "City Art Gallery",
          description: "Explore stunning photography from local artists. Free entry with refreshments provided.",
          image_url: null,
          local_image: "event-img3.jpg"
        },
        {
          id: 5,
          title: "Food Festival 2024",
          date: "2024-08-01",
          time: "12:00",
          location: "Central Park",
          description: "Taste delicious food from around the world. Live cooking demonstrations and music.",
          image_url: null,
          local_image: "event-img4.jpg"
        },
        {
          id: 6,
          title: "Tech Conference",
          date: "2024-08-10",
          time: "09:00",
          location: "Convention Center",
          description: "Latest trends in technology and innovation. Keynote speakers and networking opportunities.",
          image_url: null,
          local_image: "event-img5.jpg"
        }
      ];

      const dummyEvent = dummyEvents.find(e => e.id === eventId);
      if (dummyEvent) {
        setEvent(dummyEvent);
      } else {
        Alert.alert('Error', 'Event not found');
        navigation.goBack();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTicket = () => {
    Alert.alert(
      'Select Ticket',
      'Ticket booking functionality coming soon!',
      [{ text: 'OK' }]
    );
  };

  const handleRegisterForEvent = async (eventId) => {
    try {
      const userId = currentUser?.id || 1; // Use current user ID
      
      // Call backend API to register
      const response = await fetch(`${API_BASE_URL}/api/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: eventId,
          user_id: userId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          Alert.alert('Not Allowed', 'You cannot register for your own event as the organizer.');
        } else if (response.status === 400) {
          Alert.alert('Already Registered', 'You are already registered for this event.');
        } else {
          Alert.alert('Error', data.detail || 'Unable to register for event. Please try again.');
        }
        return;
      }
      
      setIsRegistered(true);
      
      // Schedule reminders for this event
      await NotificationService.scheduleEventReminder(event, '1_day_before', userId);
      await NotificationService.scheduleEventReminder(event, '1_hour_before', userId);
      
      // Send immediate confirmation notification
      await NotificationService.sendLocalNotification(
        'Registration Confirmed! 🎉',
        `You're all set for ${event.title}. We'll remind you before the event.`,
        { eventId: event.id, type: 'registration_confirmed' }
      );
      
      Alert.alert(
        'Registration Successful! 🎉',
        `You have successfully registered for ${event.title}!\n\nYou'll receive reminders:\n• 1 day before\n• 1 hour before the event`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error registering for event:', error);
      Alert.alert('Error', 'Unable to register for event. Please try again.');
    }
  };

  const handleDirections = () => {
    const query = encodeURIComponent(event.location);
    const url = Platform.select({
      ios: `maps://app?q=${query}`,
      android: `geo:0,0?q=${query}`,
    });
    
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Maps application is not available');
      }
    });
  };

  const handleEditEvent = () => {
    navigation.navigate('CreateEvent', { 
      eventId: event.id,
      editMode: true,
      eventData: event
    });
  };

  const handleDeleteEvent = () => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event? This action cannot be undone.',
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
                Alert.alert(
                  'Success',
                  'Event deleted successfully',
                  [
                    {
                      text: 'OK',
                      onPress: () => navigation.navigate('Home')
                    }
                  ]
                );
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    
    const getOrdinal = (n) => {
      const s = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    
    return `${getOrdinal(day)} ${month}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={50} color="#FF6B6B" />
        <Text style={styles.errorText}>Event not found</Text>
        <TouchableOpacity style={styles.errorButton} onPress={() => navigation.goBack()}>
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get image source
  const getImageSource = () => {
    if (event.image_url) {
      const absoluteUrl = String(event.image_url).startsWith('http') 
        ? event.image_url 
        : `${API_BASE_URL}${event.image_url}`;
      return { uri: absoluteUrl };
    } else if (event.local_image) {
      const localImageMap = {
        'event-img.jpg': require('../assets/event-img.jpg'),
        'event-img1.jpg': require('../assets/event-img1.jpg'),
        'event-img2.jpg': require('../assets/event-img2.jpg'),
        'event-img3.jpg': require('../assets/event-img3.jpg'),
        'event-img4.jpg': require('../assets/event-img4.jpg'),
        'event-img5.jpg': require('../assets/event-img5.jpg'),
        'event-img6.jpg': require('../assets/event-img6.jpg'),
      };
      return localImageMap[event.local_image] || require('../assets/event-img.jpg');
    }
    return { uri: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600' };
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Hero Image Section */}
      <ImageBackground
        source={getImageSource()}
        style={styles.heroImage}
        resizeMode="cover"
      >
        <View style={styles.heroOverlay}>
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Event Title Overlay */}
          <View style={styles.heroTitleContainer}>
            <Text style={styles.heroTitle}>{event.title}</Text>
          </View>
        </View>
      </ImageBackground>

      {/* Content Section */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          {currentUser && event.created_by === currentUser.id && (
            <View style={styles.actionIcons}>
              <TouchableOpacity onPress={handleEditEvent} style={styles.iconButton}>
                <Ionicons name="create-outline" size={22} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteEvent} style={styles.iconButton}>
                <Ionicons name="trash-outline" size={22} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Location with Directions */}
        <TouchableOpacity style={styles.locationRow} onPress={handleDirections}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.directionsText}>Directions</Text>
        </TouchableOpacity>

        {/* Event Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{formatDate(event.date)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{event.location}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>{event.time || '6:30 pm'} onwards..</Text>
          </View>
        </View>

        {/* Task Management Button */}
        <TouchableOpacity 
          style={styles.taskManagementButton}
          onPress={() => navigation.navigate('TaskManagement', { 
            eventId: event.id, 
            eventTitle: event.title 
          })}
        >
          <View style={styles.taskButtonContent}>
            <Ionicons name="list-outline" size={24} color="#007AFF" />
            <View style={styles.taskButtonText}>
              <Text style={styles.taskButtonTitle}>Manage Event Tasks</Text>
              <Text style={styles.taskButtonSubtitle}>Track progress through event stages</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButtonContainer}>
        {currentUser && event.created_by === currentUser.id ? (
          <View style={styles.organizerInfoContainer}>
            <Ionicons name="information-circle" size={20} color="#666" />
            <Text style={styles.organizerInfoText}>
              You are the organizer of this event
            </Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.selectTicketButton, isRegistered && styles.registeredButton]}
            onPress={() => !isRegistered && handleRegisterForEvent(event.id)}
            disabled={isRegistered}
          >
            <Text style={styles.selectTicketText}>
              {isRegistered ? 'Registered' : 'Register for event'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  heroImage: {
    width: width,
    height: height * 0.3,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitleContainer: {
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    marginRight: 12,
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  directionsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    textDecorationLine: 'underline',
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    width: 80,
  },
  detailValue: {
    fontSize: 15,
    color: '#666',
    flex: 1,
  },
  taskManagementButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 100,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  taskButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskButtonText: {
    flex: 1,
    marginLeft: 12,
  },
  taskButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  taskButtonSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  selectTicketButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  registeredButton: {
    backgroundColor: '#4CAF50',
  },
  selectTicketText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  organizerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    gap: 8,
  },
  organizerInfoText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
});

export default EventDetailsScreen;
