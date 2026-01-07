import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Platform, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Platform-aware API base URL
const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8000',
  ios: 'http://localhost:8000',
  default: 'http://192.168.0.166:8000',
});

const EventListScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('My Events');
  const currentUserId = 1; // Replace with actual user ID from auth context

  // Event categories
  const categories = [
    { id: 'My Events', name: 'My Events', icon: 'person-outline' },
    { id: 'All', name: 'All', icon: 'apps-outline' },
    { id: 'Music', name: 'Music', icon: 'musical-notes-outline' },
    { id: 'Tech', name: 'Tech', icon: 'laptop-outline' },
    { id: 'Sports', name: 'Sports', icon: 'football-outline' },
    { id: 'Food', name: 'Food', icon: 'restaurant-outline' },
    { id: 'Art', name: 'Art', icon: 'color-palette-outline' },
    { id: 'Business', name: 'Business', icon: 'briefcase-outline' },
  ];

  // Dummy event data as primary data source
  const events = [
    {
      id: 1,
      title: "React Native Workshop",
      date: "2024-07-01",
      time: "10:00",
      location: "Tech Hub Downtown",
      description: "Learn React Native development from scratch. Perfect for beginners who want to build mobile apps.",
      image_url: null,
      local_image: "event-img.jpg",
      category: "Tech",
      created_by: 1 // Current user's event
    },
    {
      id: 2,
      title: "Jazz Night Live",
      date: "2024-07-15",
      time: "19:30",
      location: "Blue Note Jazz Club",
      description: "An evening of smooth jazz featuring local artists. Come enjoy great music and atmosphere.",
      image_url: null,
      local_image: "event-img1.jpg",
      category: "Music",
      created_by: 2
    },
    {
      id: 3,
      title: "Startup Pitch Competition",
      date: "2024-07-20",
      time: "14:00",
      location: "Innovation Center",
      description: "Watch innovative startups pitch their ideas to investors. Network with entrepreneurs and investors.",
      image_url: null,
      local_image: "event-img2.jpg",
      category: "Business",
      created_by: 1 // Current user's event
    },
    {
      id: 4,
      title: "Photography Exhibition",
      date: "2024-07-25",
      time: "11:00",
      location: "City Art Gallery",
      description: "Explore stunning photography from local artists. Free entry with refreshments provided.",
      image_url: null,
      local_image: "event-img3.jpg",
      category: "Art",
      created_by: 2
    },
    {
      id: 5,
      title: "Food Festival 2024",
      date: "2024-08-01",
      time: "12:00",
      location: "Central Park",
      description: "Taste delicious food from around the world. Live cooking demonstrations and music.",
      image_url: null,
      local_image: "event-img4.jpg",
      category: "Food",
      created_by: 1 // Current user's event
    },
    {
      id: 6,
      title: "Tech Conference",
      date: "2024-08-10",
      time: "09:00",
      location: "Convention Center",
      description: "Latest trends in technology and innovation. Keynote speakers and networking opportunities.",
      image_url: null,
      local_image: "event-img5.jpg",
      category: "Tech",
      created_by: 2
    }
  ];

  useEffect(() => {
    // Optional: Try to fetch real events from API and merge with dummy data
    fetchRealEvents();
  }, []);

  const fetchRealEvents = async () => {
    try {
      const res = await fetch(`${BASE_URL}/events/`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // If API returns real events, you could merge them with dummy events here
        console.log('Real events loaded:', data.length);
      }
    } catch (e) {
      console.log('Using dummy events - API not available');
    }
  };

  const handleEventPress = (eventId) => {
    navigation.navigate('EventDetails', { eventId });
  };

  // Filter by category and search
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesCategory;
    if (selectedCategory === 'My Events') {
      matchesCategory = event.created_by === currentUserId;
    } else if (selectedCategory === 'All') {
      matchesCategory = true;
    } else {
      matchesCategory = event.category === selectedCategory;
    }
    
    return matchesSearch && matchesCategory;
  });

  const renderEventCard = ({ item }) => {
    // Format date for display
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    // Use local image if no image_url, otherwise use the uploaded image
    let imageSource;
    if (item.image_url) {
      imageSource = { uri: `${BASE_URL}${item.image_url}` };
    } else if (item.local_image) {
      // Map local image names to require statements
      const localImageMap = {
        'event-img.jpg': require('../assets/event-img.jpg'),
        'event-img1.jpg': require('../assets/event-img1.jpg'),
        'event-img2.jpg': require('../assets/event-img2.jpg'),
        'event-img3.jpg': require('../assets/event-img3.jpg'),
        'event-img4.jpg': require('../assets/event-img4.jpg'),
        'event-img5.jpg': require('../assets/event-img5.jpg'),
        'event-img6.jpg': require('../assets/event-img6.jpg'),
      };
      imageSource = localImageMap[item.local_image] || require('../assets/event-img.jpg');
    } else {
      imageSource = require('../assets/event-img.jpg'); // Default to first local image
    }

    return (
      <TouchableOpacity style={styles.eventCard} onPress={() => handleEventPress(item.id)}>
        <Image source={imageSource} style={styles.eventImage} />
        <View style={styles.eventOverlay}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category}</Text>
          </View>
        </View>
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.eventMeta}>
            <Ionicons name="calendar-outline" size={14} color="#666" />
            <Text style={styles.eventDate}>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.eventMeta}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.eventLocation} numberOfLines={1}>{item.location}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getEventCountByCategory = (categoryId) => {
    if (categoryId === 'My Events') {
      return events.filter(e => e.created_by === currentUserId).length;
    } else if (categoryId === 'All') {
      return events.length;
    } else {
      return events.filter(e => e.category === categoryId).length;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>
              {selectedCategory === 'My Events' ? 'My Events' : 'Explore Events'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {selectedCategory === 'My Events' 
                ? `${filteredEvents.length} event${filteredEvents.length !== 1 ? 's' : ''} created by you` 
                : `Find events that interest you`}
            </Text>
          </View>
          {selectedCategory === 'My Events' && (
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => navigation.navigate('CreateEvent')}
            >
              <Ionicons name="add-circle" size={24} color="#000" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.categorySection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map(category => {
            const count = getEventCountByCategory(category.id);
            const isActive = selectedCategory === category.id;
            
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  isActive && styles.categoryChipActive,
                  category.id === 'My Events' && styles.myEventsChip
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <View style={styles.categoryChipContent}>
                  <Ionicons
                    name={category.icon}
                    size={22}
                    color={isActive ? '#fff' : category.id === 'My Events' ? '#000' : '#666'}
                  />
                  <View style={styles.categoryChipTextContainer}>
                    <Text
                      style={[
                        styles.categoryChipText,
                        isActive && styles.categoryChipTextActive,
                        category.id === 'My Events' && !isActive && styles.myEventsText
                      ]}
                    >
                      {category.name}
                    </Text>
                    {count > 0 && (
                      <View style={[
                        styles.categoryBadge,
                        isActive && styles.categoryBadgeActive
                      ]}>
                        <Text style={[
                          styles.categoryBadgeText,
                          isActive && styles.categoryBadgeTextActive
                        ]}>
                          {count}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Event Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      ) : filteredEvents.length > 0 ? (
        <FlatList
          data={filteredEvents}
          keyExtractor={item => item.id.toString()}
          renderItem={renderEventCard}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons 
            name={selectedCategory === 'My Events' ? "create-outline" : "calendar-outline"} 
            size={64} 
            color="#ccc" 
          />
          <Text style={styles.emptyStateText}>
            {searchQuery 
              ? 'No events found' 
              : selectedCategory === 'My Events' 
                ? "You haven't created any events yet" 
                : `No ${selectedCategory} events`}
          </Text>
          <Text style={styles.emptyStateSubtext}>
            {searchQuery 
              ? 'Try a different search term' 
              : selectedCategory === 'My Events'
                ? 'Tap the + button on Home to create your first event'
                : 'Check back later for more events'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  createButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categorySection: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingVertical: 16,
  },
  categoryContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryChip: {
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    backgroundColor: '#fff',
    marginRight: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  myEventsChip: {
    borderColor: '#000',
    borderWidth: 2,
  },
  categoryChipActive: {
    backgroundColor: '#000',
    borderColor: '#000',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  categoryChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  categoryChipTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  myEventsText: {
    color: '#000',
  },
  categoryBadge: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  categoryBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
  },
  categoryBadgeTextActive: {
    color: '#fff',
  },
  gridContainer: {
    padding: 16,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  eventCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  eventImage: {
    width: '100%',
    height: 140,
  },
  eventOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  eventContent: {
    padding: 12,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    lineHeight: 20,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  eventDate: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  eventLocation: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default EventListScreen;