import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';

const dummyAllReviews = [
  { id: '1', boardingName: 'Green View Annex', rating: 4.5, text: 'Great place to stay! Clean rooms and friendly owners.', author: 'Nipun Perera', date: '2 weeks ago', isMine: false },
  { id: '2', boardingName: 'Sunshine Hostel', rating: 3.0, text: 'Okay stay, but Wi-Fi drops frequently. Location is good though.', author: 'Kasun Silva', date: '1 month ago', isMine: false },
];

const dummyMyReviews = [
  { 
    id: '101', 
    boardingName: 'Lake View Room', 
    rating: 5.0, 
    categories: { cleanliness: 5, location: 5, value: 5, management: 5, facilities: 5 },
    text: 'Absolutely loved staying here. The owner is super helpful and facilities are top-notch.', 
    author: 'Me', 
    date: '3 days ago', 
    isMine: true 
  }
];

export default function ReviewsScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('All');
  const [myReviews, setMyReviews] = useState(dummyMyReviews);
  const [allReviews, setAllReviews] = useState([...dummyAllReviews, ...dummyMyReviews]);

  // Handle new or updated reviews returning from WriteReviewScreen
  useEffect(() => {
    if (route.params?.newReview) {
      const newRev = route.params.newReview;
      
      if (route.params.isEdit) {
        // Update existing review
        const updatedMyReviews = myReviews.map(r => r.id === newRev.id ? newRev : r);
        setMyReviews(updatedMyReviews);
        setAllReviews([...dummyAllReviews, ...updatedMyReviews]);
      } else {
        // Add new review
        setMyReviews([newRev, ...myReviews]);
        setAllReviews([newRev, ...allReviews]);
      }
      
      // Clear params to avoid re-adding
      navigation.setParams({ newReview: null, isEdit: null });
      setActiveTab('My'); // Switch to "My Reviews" tab to show the new review
    }
  }, [route.params?.newReview]);

  const handleDelete = (id) => {
    Alert.alert("Delete Review", "Are you sure you want to delete this review?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: () => {
          const updatedMy = myReviews.filter(r => r.id !== id);
          setMyReviews(updatedMy);
          setAllReviews([...dummyAllReviews, ...updatedMy]);
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

  const renderReviewCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.boardingName}>{item.boardingName}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <View style={styles.ratingRow}>
        {renderStars(item.rating)}
        <Text style={styles.ratingNumber}>{item.rating.toFixed(1)}</Text>
      </View>
      <Text style={styles.reviewText}>{item.text}</Text>
      <View style={styles.authorRow}>
        <Text style={styles.authorIcon}>👤</Text>
        <Text style={styles.authorName}>{item.author}</Text>
      </View>

      {/* Action buttons for My Reviews */}
      {item.isMine && activeTab === 'My' && (
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.editBtn}
            onPress={() => navigation.navigate('WriteReview', { reviewToEdit: item })}
          >
            <Text style={styles.editBtnText}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteBtn}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.deleteBtnText}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

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
      <FlatList
        data={activeTab === 'All' ? allReviews : myReviews}
        keyExtractor={(item) => item.id}
        renderItem={renderReviewCard}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No reviews found.</Text>
          </View>
        }
      />

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
