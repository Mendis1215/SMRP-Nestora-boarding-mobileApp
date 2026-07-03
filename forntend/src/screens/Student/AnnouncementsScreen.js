import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function AnnouncementsScreen() {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/announcements');
      
      // Load hidden IDs
      const hiddenIdsRaw = await AsyncStorage.getItem('hiddenAnnouncements');
      const hiddenIds = hiddenIdsRaw ? JSON.parse(hiddenIdsRaw) : [];

      // Filter out hidden ones
      const visible = response.data.announcements.filter(a => !hiddenIds.includes(a._id));
      setAnnouncements(visible);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Utility': return '#00BCD4'; // Cyan
      case 'Payment': return '#4CAF50'; // Green
      case 'Maintenance': return '#FF9800'; // Orange
      default: return '#5B2D8E'; // Purple
    }
  };

  const handlePressAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
  };

  const executeHide = async (id) => {
    try {
      const hiddenIdsRaw = await AsyncStorage.getItem('hiddenAnnouncements');
      const hiddenIds = hiddenIdsRaw ? JSON.parse(hiddenIdsRaw) : [];
      if (!hiddenIds.includes(id)) {
        hiddenIds.push(id);
        await AsyncStorage.setItem('hiddenAnnouncements', JSON.stringify(hiddenIds));
      }

      setAnnouncements(prev => prev.filter(a => a._id !== id));
      if (selectedAnnouncement && selectedAnnouncement._id === id) {
        setSelectedAnnouncement(null);
      }
    } catch (err) {
      console.error('Error hiding announcement:', err);
      if (Platform.OS !== 'web') Alert.alert('Error', 'Could not hide announcement');
    }
  };

  const handleDelete = (id) => {
    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to remove this announcement from your view?")) {
        executeHide(id);
      }
    } else {
      Alert.alert(
        "Hide Announcement",
        "Are you sure you want to remove this announcement from your view?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Hide", 
            style: "destructive",
            onPress: () => executeHide(id)
          }
        ]
      );
    }
  };

  const executeClearAll = async () => {
    try {
      const hiddenIdsRaw = await AsyncStorage.getItem('hiddenAnnouncements');
      const hiddenIds = hiddenIdsRaw ? JSON.parse(hiddenIdsRaw) : [];
      
      const currentIds = announcements.map(a => a._id);
      const newHiddenIds = Array.from(new Set([...hiddenIds, ...currentIds]));
      
      await AsyncStorage.setItem('hiddenAnnouncements', JSON.stringify(newHiddenIds));
      setAnnouncements([]);
    } catch (err) {
      console.error('Error hiding all announcements:', err);
      if (Platform.OS !== 'web') Alert.alert('Error', 'Could not clear announcements');
    }
  };

  const handleClearAll = () => {
    if (announcements.length === 0) return;
    
    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to hide all current announcements?")) {
        executeClearAll();
      }
    } else {
      Alert.alert(
        "Hide All Announcements",
        "Are you sure you want to hide all current announcements?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Hide All", 
            style: "destructive",
            onPress: () => executeClearAll()
          }
        ]
      );
    }
  };

  if (selectedAnnouncement) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => setSelectedAnnouncement(null)}>
            <Text style={styles.backBtn}>← Back to Announcements</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.detailCard}>
          <View style={styles.detailTitleRow}>
            <Text style={styles.detailIcon}>📢</Text>
            <Text style={styles.detailTitle}>{selectedAnnouncement.title}</Text>
          </View>
          
          <View style={styles.metaRow}>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(selectedAnnouncement.priority) }]}>
              <Text style={styles.categoryText}>{selectedAnnouncement.priority || 'Normal'}</Text>
            </View>
            <Text style={styles.detailDate}>{new Date(selectedAnnouncement.createdAt).toLocaleDateString()}</Text>
          </View>
          
          <Text style={styles.publisherText}>Posted by: {selectedAnnouncement.authorId?.name || 'Owner'}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.detailText}>{selectedAnnouncement.content}</Text>
          
          <TouchableOpacity 
            style={styles.deleteBtn}
            onPress={() => handleDelete(selectedAnnouncement._id)}
          >
            <Text style={styles.deleteBtnText}>Hide Announcement</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.pageTitle}>Announcements</Text>
        {announcements.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearAllBtn}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#5B2D8E" style={{ marginTop: 50 }} />
      ) : announcements.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No announcements right now!</Text>
        </View>
      ) : (
        <FlatList
          data={announcements}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <TouchableOpacity 
                style={styles.cardContent} 
                onPress={() => handlePressAnnouncement(item)}
              >
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>📢</Text>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>
                    {item.title}
                  </Text>
                  <View style={styles.badgeRow}>
                    <View style={[styles.smallBadge, { backgroundColor: getCategoryColor(item.priority) }]}>
                      <Text style={styles.smallBadgeText}>{item.priority || 'Normal'}</Text>
                    </View>
                    <Text style={styles.publisherSmall}>By {item.authorId?.name || 'Owner'}</Text>
                  </View>
                  <Text style={styles.preview} numberOfLines={2}>
                    {item.content}
                  </Text>
                  <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.deleteIconBtn} 
                onPress={() => handleDelete(item._id)}
              >
                <Text style={styles.deleteIcon}>👁️‍🗨️</Text>
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
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 5,
  },
  clearAllBtn: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  clearAllText: {
    color: '#FF3B30',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardWrapper: {
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
  },
  iconContainer: {
    marginRight: 15,
    marginTop: 2,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: 'bold',
    color: '#5B2D8E',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  smallBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  smallBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  publisherSmall: {
    fontSize: 12,
    color: '#666',
  },
  preview: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00BCD4',
    marginLeft: 10,
    alignSelf: 'center',
  },
  deleteIconBtn: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#F0F0F0',
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
    marginBottom: 15,
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailDate: {
    fontSize: 14,
    color: '#999',
  },
  publisherText: {
    fontSize: 14,
    color: '#5B2D8E',
    fontWeight: '600',
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
