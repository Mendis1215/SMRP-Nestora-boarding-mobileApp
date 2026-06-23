import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';

const boardingOptions = ['Green View Annex', 'Sunshine Hostel', 'Lake View Room'];
const categories = [
  { id: 'cleanliness', label: 'Cleanliness' },
  { id: 'location', label: 'Location' },
  { id: 'value', label: 'Value for Money' },
  { id: 'management', label: 'Management' },
  { id: 'facilities', label: 'Facilities' },
];

export default function WriteReviewScreen({ navigation, route }) {
  const isEdit = !!route.params?.reviewToEdit;
  const existingReview = route.params?.reviewToEdit;

  const [boardingName, setBoardingName] = useState(boardingOptions[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [text, setText] = useState('');
  const [ratings, setRatings] = useState({
    cleanliness: 0,
    location: 0,
    value: 0,
    management: 0,
    facilities: 0,
  });

  useEffect(() => {
    if (isEdit && existingReview) {
      setBoardingName(existingReview.boardingName);
      setText(existingReview.text);
      if (existingReview.categories) {
        setRatings(existingReview.categories);
      }
    }
  }, [isEdit, existingReview]);

  const handleStarPress = (category, value) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const calculateOverallRating = () => {
    const vals = Object.values(ratings);
    const sum = vals.reduce((a, b) => a + b, 0);
    return sum / vals.length || 0;
  };

  const handleSubmit = () => {
    if (Object.values(ratings).some(val => val === 0)) {
      Alert.alert("Missing Ratings", "Please rate all categories before submitting.");
      return;
    }
    if (text.trim() === '') {
      Alert.alert("Missing Review", "Please write a brief review.");
      return;
    }

    const overallRating = calculateOverallRating();
    const newReview = {
      id: isEdit ? existingReview.id : Date.now().toString(),
      boardingName,
      rating: overallRating,
      categories: ratings,
      text,
      author: 'Me',
      date: isEdit ? 'Just now (Edited)' : 'Just now',
      isMine: true
    };

    // Pass the review back to the list screen
    navigation.navigate('ReviewsList', { newReview, isEdit });
  };

  const renderCategoryRating = (cat) => {
    return (
      <View key={cat.id} style={styles.categoryRow}>
        <Text style={styles.categoryLabel}>{cat.label}</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity key={star} onPress={() => handleStarPress(cat.id, star)}>
              <Text style={[styles.starIcon, ratings[cat.id] >= star ? styles.starSelected : styles.starUnselected]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEdit ? 'Edit Review' : 'Write a Review'}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Boarding Selector */}
          <Text style={styles.sectionLabel}>Select Boarding</Text>
          <TouchableOpacity style={styles.dropdownToggle} onPress={() => setShowDropdown(!showDropdown)}>
            <Text style={styles.dropdownText}>{boardingName}</Text>
            <Text>▼</Text>
          </TouchableOpacity>
          
          {showDropdown && (
            <View style={styles.dropdownMenu}>
              {boardingOptions.map(opt => (
                <TouchableOpacity 
                  key={opt} 
                  style={styles.dropdownItem}
                  onPress={() => {
                    setBoardingName(opt);
                    setShowDropdown(false);
                  }}
                >
                  <Text>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Rating Categories */}
          <Text style={styles.sectionLabel}>Rate Categories</Text>
          <View style={styles.card}>
            {categories.map(renderCategoryRating)}
            <View style={styles.overallRow}>
              <Text style={styles.overallLabel}>Overall Rating:</Text>
              <Text style={styles.overallValue}>{calculateOverallRating().toFixed(1)} / 5.0</Text>
            </View>
          </View>

          {/* Review Text */}
          <Text style={styles.sectionLabel}>Your Review</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Share your experience (cleanliness, owner behavior, noise, etc.)"
            multiline
            numberOfLines={5}
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
          />

          {/* Photos Mock */}
          <Text style={styles.sectionLabel}>Add Photos (Optional)</Text>
          <TouchableOpacity style={styles.photoBtn}>
            <Text style={styles.photoBtnText}>📷 Upload Photos</Text>
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>{isEdit ? 'Update Review' : 'Submit Review'}</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3EFFE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backBtn: {
    marginRight: 15,
  },
  backBtnText: {
    fontSize: 16,
    color: '#5B2D8E',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5B2D8E',
    marginTop: 15,
    marginBottom: 10,
  },
  dropdownToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownMenu: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 5,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#444',
  },
  starsRow: {
    flexDirection: 'row',
  },
  starIcon: {
    fontSize: 24,
    marginHorizontal: 2,
  },
  starSelected: {
    color: '#FF9800',
  },
  starUnselected: {
    color: '#E0E0E0',
  },
  overallRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 10,
  },
  overallLabel: {
    fontWeight: 'bold',
    marginRight: 10,
    color: '#666',
  },
  overallValue: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#5B2D8E',
  },
  textInput: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  photoBtn: {
    backgroundColor: '#E0D4F5',
    borderWidth: 1,
    borderColor: '#5B2D8E',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  photoBtnText: {
    color: '#5B2D8E',
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#5B2D8E',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  submitBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
