import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function OwnerReviewsScreen() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews');
      // Filter for reviews that belong to boardings owned by the current owner
      // Assuming boardingId.ownerId is available. If not, just show all for demo.
      const myReviews = response.data.reviews.filter(
        r => r.boardingId?.ownerId === user?._id || !r.boardingId?.ownerId
      );
      setReviews(myReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = (id) => {
    Alert.alert('Remove Review', 'Are you sure you want to remove this student review?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/reviews/${id}`);
            setReviews(reviews.filter(r => r._id !== id));
          } catch (error) {
            console.error('Error deleting review:', error);
            Alert.alert('Error', 'Failed to delete review');
          }
        },
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
        <Text style={styles.studentName}>👤 {item.studentId?.name || 'Student'}</Text>
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.roomLabel}>{item.boardingId?.name || 'Boarding Room'}</Text>
      <View style={styles.ratingRow}>
        {renderStars(item.rating)}
        <Text style={styles.ratingNumber}>{item.rating.toFixed(1)}</Text>
      </View>
      <Text style={styles.reviewText}>{item.comment}</Text>
      <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item._id)}>
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

      {isLoading ? (
        <ActivityIndicator size="large" color="#5B2D8E" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>No reviews for your rooms yet.</Text>}
        />
      )}
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
