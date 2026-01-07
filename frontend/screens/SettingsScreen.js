import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import authService from '../services/authService';

const SettingsScreen = ({ navigation }) => {
  const accountSection = [
    {
      id: 1,
      title: 'Manage Profile',
      subtitle: 'Update your personal information',
      icon: 'person-outline',
      iconBg: '#E8F4FD',
      iconColor: '#007AFF',
      onPress: () => navigation.navigate('Profile'),
    },
  
    {
      id: 2,
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      icon: 'notifications-outline',
      iconBg: '#F0E6FF',
      iconColor: '#AF52DE',
      onPress: () => navigation.navigate('Notifications'),
    },
  ];

  const generalSection = [
   
    {
      id: 3,
      title: 'Change Password',
      subtitle: 'Update your password',
      icon: 'lock-closed-outline',
      iconBg: '#FFE6E6',
      iconColor: '#FF3B30',
      onPress: () => console.log('Change Password pressed'),
    },
  ];

  const supportSection = [
    {
      id: 4,
      title: 'Terms & Conditions',
      subtitle: 'Read our terms and policies',
      icon: 'document-text-outline',
      iconBg: '#E8F4FD',
      iconColor: '#5AC8FA',
      onPress: () => console.log('Terms & Conditions pressed'),
    },
    {
      id: 5,
      title: 'Support',
      subtitle: 'Get help and support',
      icon: 'help-circle-outline',
      iconBg: '#FFF4E6',
      iconColor: '#FFCC00',
      onPress: () => console.log('Support pressed'),
    },
  ];

  const renderMenuItem = (item, isLast = false) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, isLast && styles.menuItemLast]}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
          <Ionicons name={item.icon} size={22} color={item.iconColor} />
        </View>
        <View style={styles.menuItemTextContainer}>
          <Text style={styles.menuItemText}>{item.title}</Text>
          {item.subtitle && <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
    </TouchableOpacity>
  );

  const renderSection = (title, items) => (
    <View style={styles.section} key={title}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContainer}>
        {items.map((item, index) => renderMenuItem(item, index === items.length - 1))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <Text style={styles.navTitle}>Settings</Text>
        <Text style={styles.navSubtitle}>Manage your account and preferences</Text>
      </View>

      {/* Menu Sections */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderSection('Account', accountSection)}
        {renderSection('General', generalSection)}
        {renderSection('Support', supportSection)}
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => {
            Alert.alert(
              'Logout',
              'Are you sure you want to logout?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Logout',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      // Logout from backend
                      await authService.logout();
                      // Navigate to Login screen and reset navigation stack
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                      });
                    } catch (error) {
                      console.error('Logout error:', error);
                      Alert.alert('Error', 'Failed to logout. Please try again.');
                    }
                  },
                },
              ],
              { cancelable: true }
            );
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  navbar: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  navTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  navSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginHorizontal: 24,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
    backgroundColor: '#fff',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuItemTextContainer: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '600',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#FF3B30',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#C7C7CC',
  },
});

export default SettingsScreen;
