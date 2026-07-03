import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

export default function NotificationsScreen() {
  const { user } = useContext(AuthContext);
  const hiddenStorageKey = `hiddenNotifications_${user?._id || 'guest'}`;
  const readStorageKey = `readNotifications_${user?._id || 'guest'}`;

  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      const hiddenIdsRaw = await AsyncStorage.getItem(hiddenStorageKey);
      const hiddenIds = hiddenIdsRaw ? JSON.parse(hiddenIdsRaw) : [];
      
      const readIdsRaw = await AsyncStorage.getItem(readStorageKey);
      const readIds = readIdsRaw ? JSON.parse(readIdsRaw) : [];

      const processed = response.data.notifications
        .filter(n => !hiddenIds.includes(n._id))
        .map(n => {
          if (n.recipients === 'All Registered Students' && readIds.includes(n._id)) {
            return { ...n, read: true };
          }
          return n;
        });

      setNotifications(processed);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'booking': return '✅';
      case 'payment': return '💳';
      case 'announcement': return '📢';
      case 'complaint': return '🛠️';
      default: return '🔔';
    }
  };

  const handlePressNotification = async (notification) => {
    setSelectedNotification(notification);
    
    if (!notification.read) {
      try {
        if (notification.recipients === 'All Registered Students') {
          const readIdsRaw = await AsyncStorage.getItem(readStorageKey);
          const readIds = readIdsRaw ? JSON.parse(readIdsRaw) : [];
          if (!readIds.includes(notification._id)) {
            readIds.push(notification._id);
            await AsyncStorage.setItem(readStorageKey, JSON.stringify(readIds));
          }
        } else {
          await api.patch(`/notifications/${notification._id}/read`);
        }

        setNotifications(prev => prev.map(n =>
          n._id === notification._id ? { ...n, read: true } : n
        ));
        setSelectedNotification({ ...notification, read: true });
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  const executeDelete = async (notification) => {
    try {
      if (notification.recipients === 'All Registered Students') {
        const hiddenIdsRaw = await AsyncStorage.getItem(hiddenStorageKey);
        const hiddenIds = hiddenIdsRaw ? JSON.parse(hiddenIdsRaw) : [];
        if (!hiddenIds.includes(notification._id)) {
          hiddenIds.push(notification._id);
          await AsyncStorage.setItem(hiddenStorageKey, JSON.stringify(hiddenIds));
        }
      } else {
        await api.delete(`/notifications/${notification._id}`);
      }

      setNotifications(prev => prev.filter(n => n._id !== notification._id));
      if (selectedNotification && selectedNotification._id === notification._id) {
        setSelectedNotification(null);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleDelete = (notification) => {
    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to delete this notification?")) {
        executeDelete(notification);
      }
    } else {
      Alert.alert(
        "Delete Notification",
        "Are you sure you want to delete this notification?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Delete", 
            style: "destructive",
            onPress: () => executeDelete(notification)
          }
        ]
      );
    }
  };

  if (selectedNotification) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => setSelectedNotification(null)}>
            <Text style={styles.backBtn}>← Back to Notifications</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.detailCard}>
          <View style={styles.detailTitleRow}>
            <Text style={styles.detailIcon}>{getIcon(selectedNotification.type)}</Text>
            <Text style={styles.detailTitle}>{selectedNotification.title}</Text>
          </View>
          <Text style={styles.detailDate}>{new Date(selectedNotification.createdAt).toLocaleDateString()}</Text>
          <View style={styles.divider} />
          <Text style={styles.detailText}>{selectedNotification.message || selectedNotification.detail}</Text>
          
          <TouchableOpacity 
            style={styles.deleteBtn}
            onPress={() => handleDelete(selectedNotification)}
          >
            <Text style={styles.deleteBtnText}>Delete Notification</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>Notifications & Activity</Text>
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#5B2D8E" style={{ marginTop: 50 }} />
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications right now!</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.notificationCard}>
              <TouchableOpacity 
                style={styles.cardContent} 
                onPress={() => handlePressNotification(item)}
              >
                <Text style={styles.icon}>{getIcon(item.type)}</Text>
                <View style={styles.textContainer}>
                  <Text style={[styles.title, !item.read && styles.unreadTitle]}>
                    {item.title}
                  </Text>
                  <Text style={styles.preview} numberOfLines={1}>
                    {item.message || item.detail}
                  </Text>
                  <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
                {!item.read && <View style={styles.unreadDot} />}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.deleteIconBtn} 
                onPress={() => handleDelete(item)}
              >
                <Text style={styles.deleteIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3EFFE',
    padding: 15,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5B2D8E',
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 5,
  },
  notificationCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#333',
  },
  unreadTitle: {
    fontWeight: 'bold',
    color: '#5B2D8E',
  },
  preview: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00BCD4',
    marginLeft: 10,
  },
  deleteIconBtn: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  
  // Detail View Styles
  detailHeader: {
    padding: 15,
    paddingBottom: 5,
  },
  backBtn: {
    fontSize: 16,
    color: '#5B2D8E',
    fontWeight: 'bold',
  },
  detailCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  detailTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  detailDate: {
    fontSize: 14,
    color: '#999',
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 30,
  },
  deleteBtn: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#FF3B30',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
