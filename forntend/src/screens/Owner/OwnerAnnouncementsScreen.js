import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const priorityColors = {
  Low: '#4CAF50',
  Normal: '#2196F3',
  High: '#FF9800',
  Urgent: '#F44336',
};

export default function OwnerAnnouncementsScreen({ navigation }) {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/announcements');
      setAnnouncements(response.data.announcements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAnnouncements();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert('Delete Announcement', 'Remove this announcement?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/announcements/${id}`);
            setAnnouncements(announcements.filter(a => a._id !== id));
          } catch (error) {
            console.error('Error deleting announcement:', error);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const isMine = item.authorId?._id === user?._id;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.priorityBadge, { backgroundColor: priorityColors[item.priority] || '#999' }]}>
            <Text style={styles.priorityText}>{item.priority || 'Normal'}</Text>
          </View>
          {isMine && <View style={styles.myBadge}><Text style={styles.myBadgeText}>Mine</Text></View>}
          <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content}>{item.content}</Text>
        <View style={styles.footer}>
          <Text style={styles.author}>👤 {item.authorId?.name || 'Owner'}</Text>
          <View style={styles.actions}>
            {isMine && (
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => navigation.navigate('CreateAnnouncement', { announcementToEdit: item })}
              >
                <Text style={styles.editText}>✏️ Edit</Text>
              </TouchableOpacity>
            )}
            {isMine && (
              <TouchableOpacity onPress={() => handleDelete(item._id)}>
                <Text style={styles.deleteText}>🗑️</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>Announcements</Text>
        <Text style={styles.pageSubtitle}>All announcements from all owners</Text>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#5B2D8E" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={announcements}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>No announcements yet.</Text>}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateAnnouncement')}
      >
        <Text style={styles.fabText}>+ New Announcement</Text>
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
    backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 15,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginRight: 8 },
  priorityText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  myBadge: { backgroundColor: '#E0D4F5', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, marginRight: 8 },
  myBadgeText: { color: '#5B2D8E', fontSize: 11, fontWeight: 'bold' },
  date: { fontSize: 12, color: '#999', marginLeft: 'auto' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  content: { fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  author: { fontSize: 12, color: '#666' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  editBtn: { marginRight: 10 },
  editText: { color: '#00BCD4', fontWeight: 'bold' },
  deleteText: { color: '#FF3B30', fontSize: 18 },
  fab: {
    position: 'absolute', bottom: 20, right: 20, backgroundColor: '#5B2D8E',
    paddingVertical: 14, paddingHorizontal: 20, borderRadius: 30, elevation: 5,
  },
  fabText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40 },
});
