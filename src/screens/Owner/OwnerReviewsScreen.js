import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';

// Mock: Only reviews for THIS owner's rooms
const myRoomReviews = [
  {
    id: '1',
    student: 'Nipun Perera',
    room: 'Room 101 – Green View Annex',
    rating: 4.5,
    text: 'Very clean and comfortable. The owner is friendly and responsive.',
    date: '2025-06-19',
  },
  {
    id: '2',
    student: 'Kasun Silva',
    room: 'Room 102 – Green View Annex',
    rating: 3.0,
    text: 'Average experience. Wi-Fi could be better.',
    date: '2025-06-15',
  },
  {
    id: '3',
    student: 'Amali Jayasuriya',
    room: 'Room 103 – Green View Annex',
    rating: 5.0,
    text: 'Absolutely loved it! Would highly recommend to all SLIIT students.',
    date: '2025-06-10',
  },
];

export default function OwnerReviewsScreen() {
  const [reviews, setReviews] = useState(myRoomReviews);

  const handleRemove = (id) => {
    Alert.alert('Remove Review', 'Are you sure you want to remove this student review?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: () => setReviews(reviews.filter(r => r.id !== id)),
      },
    ]);
  };

  const renderStars = (rating) => {
    let stars = '';
    for (let i = 1; i <= 5; i++) stars += i <= Math.round(rating) ? '★' : '☆';
    return <Text style={styles.stars}>{stars}</Text>;
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.studentName}>👤 {item.student}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <Text style={styles.roomLabel}>{item.room}</Text>
      <View style={styles.ratingRow}>
        {renderStars(item.rating)}
        <Text style={styles.ratingNumber}>{item.rating.toFixed(1)}</Text>
      </View>
      <Text style={styles.reviewText}>{item.text}</Text>
      <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item.id)}>
        <Text style={styles.removeBtnText}>🗑️ Remove Review</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>My Rooms – Reviews</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{reviews.length}</Text>
            <Text style={styles.statLabel}>Total Reviews</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{avgRating} ⭐</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No reviews for your rooms yet.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3EFFE' },
  headerContainer: { padding: 15 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#5B2D8E', marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1, backgroundColor: '#5B2D8E', borderRadius: 12,
    padding: 14, alignItems: 'center',
  },
  statValue: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  statLabel: { color: '#D1C4E9', fontSize: 12, marginTop: 4 },
  listContainer: { padding: 15, paddingBottom: 30 },
  card: {
    backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 15,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  studentName: { fontWeight: 'bold', color: '#333' },
  date: { fontSize: 12, color: '#999' },
  roomLabel: { fontSize: 12, color: '#5B2D8E', fontWeight: '500', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  stars: { color: '#FF9800', fontSize: 18, marginRight: 6 },
  ratingNumber: { fontWeight: 'bold', color: '#666' },
  reviewText: { fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 12 },
  removeBtn: { alignSelf: 'flex-end' },
  removeBtnText: { color: '#FF3B30', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40 },
});
