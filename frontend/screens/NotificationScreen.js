import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import NotificationService from '../services/NotificationService';

const NotificationScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'
  const [loading, setLoading] = useState(true);
  const userId = 1; // Replace with actual user ID from auth

  // Fetch notifications from backend
  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const unreadOnly = filter === 'unread';
      const notifs = await NotificationService.fetchNotifications(userId, unreadOnly);
      setNotifications(notifs);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to sample data
      setSampleNotifications();
    } finally {
      setLoading(false);
    }
  };

  const setSampleNotifications = () => {
    setNotifications([
      {
        id: 1,
        type: 'event_reminder',
        title: 'Event Reminder',
        message: 'Your event "Tech Conference 2025" starts in 1 hour',
        timestamp: new Date(Date.now() - 3600000),
        read: false,
        icon: 'calendar',
        iconBg: '#000',
        iconColor: '#fff',
      },
      {
        id: 2,
        type: 'registration_confirmed',
        title: 'Registration Confirmed',
        message: 'Your booking for "Music Festival" has been confirmed',
        timestamp: new Date(Date.now() - 7200000),
        read: false,
        icon: 'checkmark-circle',
        iconBg: '#34C759',
        iconColor: '#fff',
      },
      {
        id: 3,
        type: 'event_update',
        title: 'Event Update',
        message: 'The venue for "Business Summit" has been changed',
        timestamp: new Date(Date.now() - 86400000),
        read: true,
        icon: 'information-circle',
        iconBg: '#007AFF',
        iconColor: '#fff',
      },
      {
        id: 4,
        type: 'task_assigned',
        title: 'Task Assigned',
        message: 'You have been assigned a new task for "Wedding Planning"',
        timestamp: new Date(Date.now() - 172800000),
        read: true,
        icon: 'clipboard',
        iconBg: '#FF9500',
        iconColor: '#fff',
      },
    ]);
  };

  // Format timestamp
  const formatTimestamp = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    await NotificationService.markAsRead(id);
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, is_read: true, read: true } : notif
      )
    );
  };

  // Mark all as read
  const markAllAsRead = async () => {
    await NotificationService.markAllAsRead(userId);
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, is_read: true, read: true }))
    );
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read && !n.is_read).length;

  // Group notifications by date
  const groupedNotifications = () => {
    const groups = {
      today: [],
      yesterday: [],
      earlier: []
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    notifications.forEach(notif => {
      const notifDate = new Date(notif.timestamp || notif.sent_at);
      const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());

      if (notifDay.getTime() === today.getTime()) {
        groups.today.push(notif);
      } else if (notifDay.getTime() === yesterday.getTime()) {
        groups.yesterday.push(notif);
      } else {
        groups.earlier.push(notif);
      }
    });

    return groups;
  };

  const grouped = groupedNotifications();

  const renderNotification = (notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationCard,
        (!notification.read && !notification.is_read) && styles.notificationUnread,
      ]}
      onPress={() => markAsRead(notification.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: notification.iconBg }]}>
        <Ionicons name={notification.icon} size={22} color={notification.iconColor} />
      </View>
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle} numberOfLines={1}>
            {notification.title}
          </Text>
          {(!notification.read && !notification.is_read) && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={styles.notificationTime}>
          {formatTimestamp(notification.timestamp || notification.sent_at)}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={(e) => {
          e.stopPropagation();
          deleteNotification(notification.id);
        }}
      >
        <Ionicons name="close" size={18} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <View style={styles.headerRight}>
            {notifications.length > 0 && unreadCount > 0 && (
              <TouchableOpacity
                style={styles.markAllButton}
                onPress={markAllAsRead}
              >
                <Ionicons name="checkmark-done" size={22} color="#000" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Tabs */}
        {notifications.length > 0 && (
          <View style={styles.filterTabs}>
            <TouchableOpacity
              style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, filter === 'unread' && styles.filterTabActive]}
              onPress={() => setFilter('unread')}
            >
              <Text style={[styles.filterTabText, filter === 'unread' && styles.filterTabTextActive]}>
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length > 0 ? (
          <View>
            {/* Today */}
            {grouped.today.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Today</Text>
                <View style={styles.sectionContent}>
                  {grouped.today.map(renderNotification)}
                </View>
              </View>
            )}

            {/* Yesterday */}
            {grouped.yesterday.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Yesterday</Text>
                <View style={styles.sectionContent}>
                  {grouped.yesterday.map(renderNotification)}
                </View>
              </View>
            )}

            {/* Earlier */}
            {grouped.earlier.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Earlier</Text>
                <View style={styles.sectionContent}>
                  {grouped.earlier.map(renderNotification)}
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="notifications-off-outline" size={64} color="#999" />
            </View>
            <Text style={styles.emptyTitle}>
              {filter === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
            </Text>
            <Text style={styles.emptyMessage}>
              {filter === 'unread' 
                ? "You're all caught up! Check the 'All' tab to see previous notifications." 
                : "You're all caught up! We'll notify you when there's something new."}
            </Text>
          </View>
        )}
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
    backgroundColor: '#fff',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  headerRight: {
    width: 32,
    alignItems: 'flex-end',
  },
  markAllButton: {
    padding: 4,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 8,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  filterTabActive: {
    backgroundColor: '#000',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  notificationUnread: {
    backgroundColor: '#F8F9FF',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    marginLeft: 6,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 120,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NotificationScreen;
