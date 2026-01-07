import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.userId = null;
  }
  // Request permission for notifications
  async requestPermission() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive updates.'
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Get push notification token (for sending to backend)
  async registerForPushNotifications() {
    try {
      if (!await this.requestPermission()) {
        return null;
      }

      // Get the token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // Update with your Expo project ID
      });
      
      console.log('Push Token:', token.data);
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  // Send local notification (doesn't require backend)
  async sendLocalNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          data: data,
          sound: true,
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }

  // Schedule a notification for later
  async scheduleNotification(title, body, triggerDate, data = {}) {
    try {
      const trigger = {
        date: triggerDate,
      };

      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          data: data,
          sound: true,
        },
        trigger: trigger,
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  // Cancel all scheduled notifications
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }

  // Add notification received listener
  addNotificationReceivedListener(callback) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  // Add notification response listener (when user taps notification)
  addNotificationResponseListener(callback) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Initialize and register push token with backend
  async initialize(userId) {
    try {
      this.userId = userId;
      const token = await this.registerForPushNotifications();
      
      if (token && userId) {
        await this.registerTokenWithBackend(token, userId);
      }
      
      return token;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return null;
    }
  }

  // Register token with backend
  async registerTokenWithBackend(token, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/push-tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          token: token,
          device_type: Platform.OS
        })
      });

      const data = await response.json();
      console.log('Token registered with backend:', data);
      return data.success;
    } catch (error) {
      console.error('Error registering token with backend:', error);
      return false;
    }
  }

  // Fetch notifications from backend
  async fetchNotifications(userId, unreadOnly = false) {
    try {
      const url = `${API_BASE_URL}/api/notifications/${userId}${unreadOnly ? '?unread_only=true' : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        return data.notifications;
      }
      return [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/${userId}/read-all`, {
        method: 'PUT'
      });
      
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error marking all as read:', error);
      return false;
    }
  }

  // Schedule event reminders
  async scheduleEventReminder(event, reminderType, userId) {
    try {
      const eventDate = new Date(event.date);
      let remindAt;
      let title;
      let body;

      switch (reminderType) {
        case '1_day_before':
          remindAt = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000);
          title = `Tomorrow: ${event.title}`;
          body = `Your event "${event.title}" is tomorrow at ${event.time || 'TBD'}`;
          break;
        case '1_hour_before':
          remindAt = new Date(eventDate.getTime() - 60 * 60 * 1000);
          title = `Starting Soon: ${event.title}`;
          body = `Your event "${event.title}" starts in 1 hour`;
          break;
        case '30_min_before':
          remindAt = new Date(eventDate.getTime() - 30 * 60 * 1000);
          title = `Starting Soon: ${event.title}`;
          body = `Your event "${event.title}" starts in 30 minutes`;
          break;
        default:
          return false;
      }

      // Schedule local notification
      await this.scheduleNotification(title, body, remindAt, {
        eventId: event.id,
        type: 'event_reminder'
      });

      // Register reminder with backend
      await fetch(`${API_BASE_URL}/api/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: event.id,
          user_id: userId,
          remind_at: remindAt.toISOString(),
          reminder_type: reminderType
        })
      });

      return true;
    } catch (error) {
      console.error('Error scheduling event reminder:', error);
      return false;
    }
  }

  // Send event update notification
  async sendEventUpdateNotification(event, updateMessage) {
    try {
      await this.sendLocalNotification(
        `Event Update: ${event.title}`,
        updateMessage,
        { eventId: event.id, type: 'event_update' }
      );
    } catch (error) {
      console.error('Error sending event update:', error);
    }
  }

  // Get badge count (unread notifications)
  async getBadgeCount() {
    try {
      const badgeCount = await Notifications.getBadgeCountAsync();
      return badgeCount;
    } catch (error) {
      console.error('Error getting badge count:', error);
      return 0;
    }
  }

  // Set badge count
  async setBadgeCount(count) {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  }
}

export default new NotificationService();
