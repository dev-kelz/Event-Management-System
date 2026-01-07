import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ScrollView, TouchableOpacity, Platform, Image, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

const CreateEventScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { editMode = false, eventData, eventId } = route?.params || {};
  
  const [title, setTitle] = useState(editMode && eventData ? eventData.title : '');
  const [date, setDate] = useState(editMode && eventData ? eventData.date : '');
  const [location, setLocation] = useState(editMode && eventData ? eventData.location || '' : '');
  const [description, setDescription] = useState(editMode && eventData ? eventData.description || '' : '');
  const [time, setTime] = useState(editMode && eventData ? eventData.time || '' : ''); // HH:MM
  const [category, setCategory] = useState('Tech');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null); // { uri, width, height } | null
  const [currentUser, setCurrentUser] = useState(null);

  const categories = ['Music', 'Tech', 'Sports', 'Food', 'Art', 'Business'];

  useEffect(() => {
    // Get current user from storage
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('@user');
        if (userData) {
          setCurrentUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  const handlePickImage = async () => {
    try {
      // Request permission
      const { status: perm } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (perm !== 'granted') {
        Alert.alert('Permission required', 'We need access to your photos to add an image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const asset = result.assets?.[0];
        if (asset?.uri) {
          setImage({ uri: asset.uri, width: asset.width, height: asset.height });
        }
      }
    } catch (e) {
      Alert.alert('Error', 'Could not open image picker.');
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Please enter an event name.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      Alert.alert('Validation', 'Please enter date as YYYY-MM-DD.');
      return;
    }
    if (!/^\d{2}:\d{2}$/.test(time)) {
      Alert.alert('Validation', 'Please enter time as HH:MM (24h).');
      return;
    }
    
    if (!editMode && (!currentUser || !currentUser.id)) {
      Alert.alert('Error', 'Please login to create events.');
      return;
    }
    
    setLoading(true);
    try {
      const url = editMode 
        ? `${API_BASE_URL}/api/events/${eventId}`
        : `${API_BASE_URL}/api/events`;
      
      // Backend expects JSON with these fields
      const payload = {
        title: title,
        description: description || null,
        date: date, // YYYY-MM-DD format
        time: time || null, // HH:MM format
        location: location || null,
      };

      if (!editMode && currentUser?.id) {
        payload.created_by = currentUser.id;
      }

      const response = await fetch(url, {
        method: editMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        const result = await response.json();
        Alert.alert('Success', editMode ? 'Event updated successfully!' : 'Event created!');
        
        if (editMode) {
          navigation.navigate('EventDetails', { eventId: eventId });
        } else {
          navigation.navigate('MainTabs', {
            screen: 'Home',
            params: { newEvent: result.event, refresh: true },
          });
        }
      } else {
        let detail = editMode ? 'Could not update event.' : 'Could not create event.';
        try {
          const data = await response.json();
          detail = data?.detail || JSON.stringify(data);
        } catch {}
        Alert.alert('Error', detail);
      }
    } catch (error) {
      console.error('Create/Update event error:', error);
      Alert.alert('Error', error?.message || 'Server not reachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* Event Name */}
        <View style={styles.section}>
          <Text style={styles.label}>Event Title *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="Enter event name"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Category *</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  category === cat && styles.categoryChipActive
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    category === cat && styles.categoryChipTextActive
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Date + Time Row */}
        <View style={styles.rowContainer}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Date *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
                value={date}
                onChangeText={setDate}
                style={styles.input}
              />
            </View>
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Time *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="time-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="HH:MM"
                placeholderTextColor="#999"
                value={time}
                onChangeText={setTime}
                style={styles.input}
              />
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.label}>Location</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="Enter event location"
              placeholderTextColor="#999"
              value={location}
              onChangeText={setLocation}
              style={styles.input}
            />
          </View>
        </View>

        {/* Event Image */}
        <View style={styles.section}>
          <Text style={styles.label}>Event Image</Text>
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image.uri }} style={styles.imagePreview} resizeMode="cover" />
              <View style={styles.imageOverlay}>
                <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
                  <Ionicons name="camera" size={20} color="#fff" />
                  <Text style={styles.imageButtonText}>Change</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.imageButton, styles.removeButton]} onPress={() => setImage(null)}>
                  <Ionicons name="trash" size={20} color="#fff" />
                  <Text style={styles.imageButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
              <Ionicons name="cloud-upload-outline" size={32} color="#999" />
              <Text style={styles.uploadButtonText}>Upload Event Image</Text>
              <Text style={styles.uploadButtonSubtext}>Tap to choose from gallery</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <TextInput
              placeholder="Tell people about your event..."
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Create/Update Button */}
        <TouchableOpacity
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.createButtonText}>
              {editMode ? 'Updating...' : 'Creating...'}
            </Text>
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={22} color="#fff" />
              <Text style={styles.createButtonText}>
                {editMode ? 'Update Event' : 'Create Event'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.helperText}>* Required fields</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  headerRight: {
    width: 32,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    padding: 0,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  halfWidth: {
    flex: 1,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#fff',
  },
  categoryChipActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  textAreaContainer: {
    height: 120,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E5E5E5',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  uploadButtonSubtext: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  imagePreviewContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  removeButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  helperText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 13,
    marginTop: 16,
  },
});
 
export default CreateEventScreen;