import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('Piyush Mankar');
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const insets = useSafeAreaInsets();

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        const fullName = `${parsedData.firstName || ''} ${parsedData.lastName || ''}`.trim();
        if (fullName) {
          setUserName(fullName);
        }
        setUserProfile({
          firstName: parsedData.firstName || '',
          lastName: parsedData.lastName || '',
          email: parsedData.email || ''
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['@user', '@token']);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150' }}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>

        {/* Profile Information */}
        <View style={styles.profileInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>FIRST NAME</Text>
            <Text style={styles.infoValue}>{userProfile.firstName || 'Destiny'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>LAST NAME</Text>
            <Text style={styles.infoValue}>{userProfile.lastName || 'Kalachi'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>EMAIL</Text>
            <Text style={styles.infoValue}>{userProfile.email || 'Not set'}</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#000',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 50,
    alignItems: 'center',
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E8E8E8',
  },
  profileInfo: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginBottom: 40,
  },
  infoItem: {
    marginBottom: 30,
    alignItems: 'center',
    width: '100%',
  },
  infoLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
    letterSpacing: 1,
    fontWeight: '400',
  },
  infoValue: {
    fontSize: 20,
    color: '#000',
    fontWeight: '400',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '500',
  },
});

export default ProfileScreen;
