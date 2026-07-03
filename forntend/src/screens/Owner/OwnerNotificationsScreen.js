import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';

const typeColors = {
  Booking: '#00BCD4',
  Payment: '#FF9800',
  Announcement: '#5B2D8E',
};

export default function OwnerNotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert('Delete Notification', 'Remove this notification?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            const res = await api.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
            Alert.alert('Success', 'Notification deleted successfully');
          } catch (error) {
            console.error('Error deleting notification:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to delete notification');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.typeBadge, { backgroundColor: typeColors[item.type] || '#999' }]}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
        {item.isSystem && (
          <View style={styles.systemBadge}>
            <Text style={styles.systemText}>System</Text>
          </View>
        )}
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <View style={styles.footerRow}>
        <Text style={styles.recipients}>📤 To: {item.recipients || 'All Registered Students'}</Text>
        {!item.isSystem && (
          <TouchableOpacity onPress={() => handleDelete(item._id)}>
            <Text style={styles.deleteText}>🗑️ Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>Notifications</Text>
        <Text style={styles.pageSubtitle}>Manage your sent notifications</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#5B2D8E" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No sent notifications yet.</Text>
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateNotification')}
      >
        <Text style={styles.fabText}>+ New Notification</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3EFFE' },
  headerContainer: { padding: 15 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#5B2D8E' },
  pageSubtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  listContainer: { padding: 15, paddingBottom: 90 },
  card: {
    backgroundColor: '#FFF', borderRadius: 12, padding: 15,
    marginBottom: 15, elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  typeBadge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginRight: 8,
  },
  typeText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  systemBadge: {
    backgroundColor: '#E0E0E0', paddingHorizontal: 6, paddingVertical: 3,
    borderRadius: 6, marginRight: 8,
  },
  systemText: { color: '#666', fontSize: 11 },
  date: { fontSize: 12, color: '#999', marginLeft: 'auto' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  message: { fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 12 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recipients: { fontSize: 12, color: '#666' },
  deleteText: { color: '#FF3B30', fontWeight: 'bold' },
  fab: {
    position: 'absolute', bottom: 20, right: 20, backgroundColor: '#5B2D8E',
    paddingVertical: 14, paddingHorizontal: 20, borderRadius: 30, elevation: 5,
  },
  fabText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40 },
});
