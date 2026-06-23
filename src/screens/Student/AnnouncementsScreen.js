import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView } from 'react-native';

const initialAnnouncements = [
  {
    id: '1',
    title: 'Water Supply Interruption',
    detail: 'The municipal council has announced a water cut in the Malabe area on 25 May from 9:00 AM to 5:00 PM. Please store sufficient water.',
    date: '2 hours ago',
    publisher: 'System Admin',
    category: 'Utility',
    read: false,
  },
  {
    id: '2',
    title: 'Monthly Rent Reminder',
    detail: 'Friendly reminder that your rent for the month of June is due on or before the 5th. Please ensure timely payment to avoid late fees.',
    date: '1 day ago',
    publisher: 'Green View Annex',
    category: 'Payment',
    read: true,
  },
  {
    id: '3',
    title: 'Building Maintenance',
    detail: 'Routine building maintenance will be carried out this weekend. The main gate will be closed for painting on Saturday morning.',
    date: '3 days ago',
    publisher: 'Sunshine Hostel',
    category: 'Maintenance',
    read: true,
  },
];

export default function AnnouncementsScreen() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Utility': return '#00BCD4'; // Cyan
      case 'Payment': return '#4CAF50'; // Green
      case 'Maintenance': return '#FF9800'; // Orange
      default: return '#5B2D8E'; // Purple
    }
  };

  const handlePressAnnouncement = (announcement) => {
    // Mark as read
    const updatedAnnouncements = announcements.map(a =>
      a.id === announcement.id ? { ...a, read: true } : a
    );
    setAnnouncements(updatedAnnouncements);
    setSelectedAnnouncement({ ...announcement, read: true });
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Announcement",
      "Are you sure you want to remove this announcement from your view?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setAnnouncements(announcements.filter(a => a.id !== id));
            if (selectedAnnouncement && selectedAnnouncement.id === id) {
              setSelectedAnnouncement(null);
            }
          }
        }
      ]
    );
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
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(selectedAnnouncement.category) }]}>
              <Text style={styles.categoryText}>{selectedAnnouncement.category}</Text>
            </View>
            <Text style={styles.detailDate}>{selectedAnnouncement.date}</Text>
          </View>
          
          <Text style={styles.publisherText}>Posted by: {selectedAnnouncement.publisher}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.detailText}>{selectedAnnouncement.detail}</Text>
          
          <TouchableOpacity 
            style={styles.deleteBtn}
            onPress={() => handleDelete(selectedAnnouncement.id)}
          >
            <Text style={styles.deleteBtnText}>Delete Announcement</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>Announcements</Text>
      
      {announcements.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No announcements right now!</Text>
        </View>
      ) : (
        <FlatList
          data={announcements}
          keyExtractor={(item) => item.id}
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
                  <Text style={[styles.title, !item.read && styles.unreadTitle]}>
                    {item.title}
                  </Text>
                  <View style={styles.badgeRow}>
                    <View style={[styles.smallBadge, { backgroundColor: getCategoryColor(item.category) }]}>
                      <Text style={styles.smallBadgeText}>{item.category}</Text>
                    </View>
                    <Text style={styles.publisherSmall}>By {item.publisher}</Text>
                  </View>
                  <Text style={styles.preview} numberOfLines={2}>
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
