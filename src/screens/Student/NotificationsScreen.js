import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView } from 'react-native';

const initialNotifications = [
  {
    id: '1',
    title: 'Booking Confirmed',
    detail: 'Your booking at Green View Annex has been confirmed. The owner is expecting you on the move-in date.',
    date: '2m ago',
    type: 'booking',
    read: false,
  },
  {
    id: '2',
    title: 'Payment Successful',
    detail: 'Your payment of Rs. 15,000 was successful. You can download the receipt from the bookings page.',
    date: '1h ago',
    type: 'payment',
    read: true,
  },
  {
    id: '3',
    title: 'New Announcement',
    detail: 'Water supply will be interrupted on 25 May from 9am to 5pm due to municipal maintenance.',
    date: '3h ago',
    type: 'announcement',
    read: false,
  },
  {
    id: '4',
    title: 'Complaint Update',
    detail: 'Your complaint #CMP123 regarding the water leakage has been resolved.',
    date: '1d ago',
    type: 'complaint',
    read: true,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const getIcon = (type) => {
    switch (type) {
      case 'booking': return '✅';
      case 'payment': return '💳';
      case 'announcement': return '📢';
      case 'complaint': return '🛠️';
      default: return '🔔';
    }
  };

  const handlePressNotification = (notification) => {
    // Mark as read
    const updatedNotifications = notifications.map(n =>
      n.id === notification.id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    setSelectedNotification({ ...notification, read: true });
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setNotifications(notifications.filter(n => n.id !== id));
            if (selectedNotification && selectedNotification.id === id) {
              setSelectedNotification(null);
            }
          }
        }
      ]
    );
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
          <Text style={styles.detailDate}>{selectedNotification.date}</Text>
          <View style={styles.divider} />
          <Text style={styles.detailText}>{selectedNotification.detail}</Text>
          
          <TouchableOpacity 
            style={styles.deleteBtn}
            onPress={() => handleDelete(selectedNotification.id)}
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
      
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications right now!</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
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
                    {item.detail}
                  </Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
                {!item.read && <View style={styles.unreadDot} />}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.deleteIconBtn} 
                onPress={() => handleDelete(item.id)}
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
