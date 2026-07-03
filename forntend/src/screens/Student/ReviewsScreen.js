import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function ReviewsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('All');
  const [allReviews, setAllReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews');
      setAllReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReviews();
    }, [])
  );

  const myReviews = allReviews.filter(r => r.studentId?._id === user?._id);

  const handleDelete = (id) => {
    Alert.alert("Delete Review", "Are you sure you want to delete this review?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          try {
            await api.delete(`/reviews/${id}`);
            setAllReviews(allReviews.filter(r => r._id !== id));
          } catch (error) {
            console.error('Error deleting review:', error);
          }
        }
      }
    ]);
  };

  const renderStars = (rating) => {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += i <= Math.round(rating) ? '★' : '☆';
    }
    return <Text style={styles.stars}>{stars}</Text>;
  };

  const renderReviewCard = ({ item }) => {
    const isMine = item.studentId?._id === user?._id;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.boardingName}>{item.boardingId?.name || 'Boarding'}</Text>
          <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
        <View style={styles.ratingRow}>
          {renderStars(item.rating)}
          <Text style={styles.ratingNumber}>{item.rating.toFixed(1)}</Text>
        </View>
        <Text style={styles.reviewText}>{item.comment}</Text>
        <View style={styles.authorRow}>
          <Text style={styles.authorIcon}>👤</Text>
          <Text style={styles.authorName}>{item.studentId?.name || 'Student'}</Text>
        </View>

        {/* Action buttons for My Reviews */}
        {isMine && activeTab === 'My' && (
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.editBtn}
              onPress={() => navigation.navigate('WriteReview', { reviewToEdit: item })}
            >
              <Text style={styles.editBtnText}>✏️ Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteBtn}
              onPress={() => handleDelete(item._id)}
            >
              <Text style={styles.deleteBtnText}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>Boarding Reviews</Text>
      </View>

      {/* Segmented Control */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'All' && styles.activeTab]}
          onPress={() => setActiveTab('All')}
        >
          <Text style={[styles.tabText, activeTab === 'All' && styles.activeTabText]}>All Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'My' && styles.activeTab]}
          onPress={() => setActiveTab('My')}
        >
          <Text style={[styles.tabText, activeTab === 'My' && styles.activeTabText]}>My Reviews</Text>
        </TouchableOpacity>
      </View>

      {/* Review List */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#5B2D8E" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={activeTab === 'All' ? allReviews : myReviews}
          keyExtractor={(item) => item._id}
          renderItem={renderReviewCard}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No reviews found.</Text>
            </View>
          }
        />
      )}

      {/* Write Review FAB Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('WriteReview')}
      >
        <Text style={styles.fabText}>+ Write Review</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3EFFE',
  },
  headerContainer: {
    padding: 15,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5B2D8E',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    backgroundColor: '#E0D4F5',
    borderRadius: 8,
    padding: 4,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#5B2D8E',
  },
  tabText: {
    fontWeight: 'bold',
    color: '#5B2D8E',
  },
  activeTabText: {
    color: '#FFF',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80, // Space for FAB
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  boardingName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stars: {
    color: '#FF9800',
    fontSize: 18,
    marginRight: 5,
  },
  ratingNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  reviewText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 15,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  authorName: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
  },
  editBtn: {
    marginRight: 15,
    padding: 5,
  },
  editBtnText: {
    color: '#00BCD4',
    fontWeight: 'bold',
  },
  deleteBtn: {
    padding: 5,
  },
  deleteBtnText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#5B2D8E',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  }
});
