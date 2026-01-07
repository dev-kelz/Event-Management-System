import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator, TextInput, Image, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../config';
import NotificationService from '../services/NotificationService';

// Components
const CategoryCard = ({ title, imageUrl, color, onPress }) => (
  <TouchableOpacity style={[styles.categoryCard, { backgroundColor: color }]} onPress={onPress}>
    <ImageBackground 
      source={{ uri: imageUrl }} 
      style={styles.categoryImage}
      imageStyle={{ borderRadius: 12 }}
    >
      <View style={styles.categoryOverlay}>
        <Text style={styles.categoryTitle}>{title}</Text>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

const UpcomingEventCard = ({ title, imageUrl, onPress }) => (
  <TouchableOpacity style={styles.upcomingCard} onPress={onPress}>
    <ImageBackground 
      source={{ uri: imageUrl || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400' }} 
      style={styles.upcomingImage}
      imageStyle={{ borderRadius: 12 }}
    >
      <View style={styles.upcomingOverlay}>
        <View style={styles.seeDetailsButton}>
          <Text style={styles.seeDetailsText}>See Details</Text>
        </View>
      </View>
    </ImageBackground>
    <View style={styles.upcomingInfo}>
      <Text style={styles.upcomingTitle} numberOfLines={1}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const EventAroundCard = ({ title, location, date, imageUrl, onPress }) => (
  <TouchableOpacity style={styles.eventAroundCard} onPress={onPress}>
    <Image 
      source={{ uri: imageUrl || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200' }} 
      style={styles.eventAroundImage}
    />
    <View style={styles.eventAroundInfo}>
      <Text style={styles.eventAroundTitle} numberOfLines={2}>{title}</Text>
      <View style={styles.eventAroundMeta}>
        <Ionicons name="location-outline" size={12} color="#666" />
        <Text style={styles.eventAroundMetaText}>@ {location}</Text>
      </View>
      <Text style={styles.eventAroundDate}>{date}</Text>
    </View>
  </TouchableOpacity>
);

// Main Component
const HomeScreen = ({ navigation, route }) => {
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Nagpur');
  const [currentUser, setCurrentUser] = useState({ name: ' Guest' });

  const categories = [
    { id: 1, title: 'Turf Ground', color: '#4A90E2', imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300' },
    { id: 2, title: 'Wedding Venues', color: '#E17055', imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300' },
    { id: 3, title: 'Meeting Venues', color: '#00B894', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300' },
    { id: 4, title: 'Party Halls', color: '#6C5CE7', imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300' },
  ];

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/events`);
      const data = await res.json();
      if (data.success && Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        setEvents([]);
      }
    } catch (e) {
      console.error('Fetch events error:', e);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchEvents();
    });
    return unsubscribe;
  }, [navigation, fetchEvents]);

  useEffect(() => {
    const newEvent = route?.params?.newEvent;
    if (newEvent) {
      setEvents(prev => [newEvent, ...prev]);
      try { navigation.setParams({ newEvent: undefined }); } catch {}
    }
  }, [route?.params?.newEvent]);

  // Fetch current user data and initialize notifications
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Try to fetch user data from backend or local storage
        // For now, using user ID 1 as default
        const userId = 1; // Replace with actual user ID from auth
        
        // Initialize push notifications
        await NotificationService.initialize(userId);
        
        // Set up notification listeners
        const notificationListener = NotificationService.addNotificationReceivedListener(
          notification => {
            console.log('Notification received:', notification);
          }
        );

        const responseListener = NotificationService.addNotificationResponseListener(
          response => {
            console.log('Notification tapped:', response);
            // Navigate to event if notification contains event ID
            const eventId = response.notification.request.content.data?.eventId;
            if (eventId) {
              navigation.navigate('EventDetails', { eventId });
            }
          }
        );

        return () => {
          notificationListener.remove();
          responseListener.remove();
        };
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };
    initializeApp();
  }, []);

  const handleEventPress = (eventId) => {
    navigation.navigate('EventDetails', { eventId });
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('Event');
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.userName}>Welcome Destiny</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton} onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications" size={24} color="#333" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150' }} 
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search"
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
          <Ionicons name="search" size={20} color="#666" />
        </View>
      </View>

      {/* Create Event Button */}
      <View style={styles.createEventContainer}>
        <TouchableOpacity 
          style={styles.createEventButton}
          onPress={() => navigation.navigate('CreateEvent')}
        >
          <View style={styles.createEventContent}>
            <View style={styles.createEventIconContainer}>
              <Ionicons name="add-circle" size={28} color="#fff" />
            </View>
            <View style={styles.createEventTextContainer}>
              <Text style={styles.createEventTitle}>Create New Event</Text>
              <Text style={styles.createEventSubtitle}>Start planning your next event</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Event*/}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Event</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Event')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesRow}
          >
            {categories.map(cat => (
              <CategoryCard
                key={cat.id}
                title={cat.title}
                imageUrl={cat.imageUrl}
                color={cat.color}
                onPress={() => handleCategoryPress(cat)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Upcoming Event */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Event</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Event')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color="#007AFF" style={{ marginVertical: 20 }} />
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.upcomingRow}
            >
              {events.slice(0, 5).map((event, index) => {
                const absoluteImageUrl = event?.image_url
                  ? (String(event.image_url).startsWith('http') ? event.image_url : `${API_BASE_URL}${event.image_url}`)
                  : null;
                return (
                  <UpcomingEventCard
                    key={event.id || index}
                    title={event.title}
                    imageUrl={absoluteImageUrl}
                    onPress={() => handleEventPress(event.id)}
                  />
                );
              })}
            </ScrollView>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CreateEvent')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  headerLeft: {
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#999',
    marginLeft: 4,
    marginRight: 2,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    position: 'relative',
    marginRight: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  seeAllText: {
    fontSize: 14,
    color: '#666',
  },
  categoriesRow: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    width: 100,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  categoryOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  upcomingRow: {
    paddingHorizontal: 20,
  },
  upcomingCard: {
    width: 200,
    marginRight: 16,
  },
  upcomingImage: {
    width: 200,
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
  },
  upcomingOverlay: {
    flex: 1,
    padding: 12,
    justifyContent: 'flex-end',
  },
  seeDetailsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
  },
  seeDetailsText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '600',
  },
  upcomingInfo: {
    marginTop: 8,
  },
  upcomingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  eventAroundCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  eventAroundImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  eventAroundInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  eventAroundTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  eventAroundMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  eventAroundMetaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  eventAroundDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
  tasksList: {
    paddingHorizontal: 20,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  taskIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  taskSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  emptyTasks: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
    borderRadius: 12,
  },
  emptyTasksText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  createEventContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  createEventButton: {
    backgroundColor: '#000',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  createEventContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  createEventIconContainer: {
    marginRight: 12,
  },
  createEventTextContainer: {
    flex: 1,
  },
  createEventTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  createEventSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});

export default HomeScreen;
