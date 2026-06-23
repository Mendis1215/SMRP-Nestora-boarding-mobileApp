import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';

const categories = ['Maintenance', 'Utilities', 'Security', 'Facilities', 'Management', 'Other'];
const priorities = ['Low', 'Medium', 'High'];

export default function WriteComplaintScreen({ navigation, route }) {
  const isEdit = !!route.params?.complaintToEdit;
  const existingComplaint = route.params?.complaintToEdit;

  const [category, setCategory] = useState(categories[0]);
  const [priority, setPriority] = useState(priorities[1]); // Default Medium
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showPriDropdown, setShowPriDropdown] = useState(false);

  useEffect(() => {
    if (isEdit && existingComplaint) {
      setCategory(existingComplaint.category);
      setPriority(existingComplaint.priority);
      setTitle(existingComplaint.title);
      setDescription(existingComplaint.description);
    }
  }, [isEdit, existingComplaint]);

  const handleSubmit = () => {
    if (title.trim() === '') {
      Alert.alert("Missing Title", "Please enter a title for your complaint.");
      return;
    }
    if (description.trim() === '') {
      Alert.alert("Missing Description", "Please describe your issue.");
      return;
    }

    // Auto-generate date and room number
    const today = new Date().toISOString().split('T')[0];
    const userRoomNumber = 'Room 101'; // Mock auto-assigned room number

    const newComplaint = {
      id: isEdit ? existingComplaint.id : Date.now().toString(),
      title,
      description,
      category,
      priority,
      status: isEdit ? existingComplaint.status : 'Pending',
      date: isEdit ? existingComplaint.date : today,
      roomNumber: isEdit ? existingComplaint.roomNumber : userRoomNumber,
    };

    navigation.navigate('ComplaintsList', { newComplaint, isEdit });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEdit ? 'Edit Complaint' : 'File a Complaint'}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <Text style={styles.infoText}>
            Date: {isEdit ? existingComplaint.date : new Date().toISOString().split('T')[0]}  |  Room: Room 101
          </Text>

          {/* Category Selector */}
          <Text style={styles.sectionLabel}>Category</Text>
          <TouchableOpacity style={styles.dropdownToggle} onPress={() => { setShowCatDropdown(!showCatDropdown); setShowPriDropdown(false); }}>
            <Text style={styles.dropdownText}>{category}</Text>
            <Text>▼</Text>
          </TouchableOpacity>
          
          {showCatDropdown && (
            <View style={styles.dropdownMenu}>
              {categories.map(cat => (
                <TouchableOpacity 
                  key={cat} 
                  style={styles.dropdownItem}
                  onPress={() => {
                    setCategory(cat);
                    setShowCatDropdown(false);
                  }}
                >
                  <Text>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Priority Selector */}
          <Text style={styles.sectionLabel}>Priority</Text>
          <TouchableOpacity style={styles.dropdownToggle} onPress={() => { setShowPriDropdown(!showPriDropdown); setShowCatDropdown(false); }}>
            <Text style={styles.dropdownText}>{priority}</Text>
            <Text>▼</Text>
          </TouchableOpacity>
          
          {showPriDropdown && (
            <View style={styles.dropdownMenu}>
              {priorities.map(pri => (
                <TouchableOpacity 
                  key={pri} 
                  style={styles.dropdownItem}
                  onPress={() => {
                    setPriority(pri);
                    setShowPriDropdown(false);
                  }}
                >
                  <Text>{pri}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Title Input */}
          <Text style={styles.sectionLabel}>Complaint Title</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="e.g. Water Leaking in Bathroom"
            value={title}
            onChangeText={setTitle}
          />

          {/* Description Input */}
          <Text style={styles.sectionLabel}>Description</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Provide full details about the issue..."
            multiline
            numberOfLines={5}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />

          {/* Photos/Video Mock */}
          <Text style={styles.sectionLabel}>Add Evidence (Optional)</Text>
          <TouchableOpacity style={styles.photoBtn}>
            <Text style={styles.photoBtnText}>📷 Upload Photo / Video</Text>
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>{isEdit ? 'Update Complaint' : 'Submit Complaint'}</Text>
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
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    backgroundColor: '#E0D4F5',
    padding: 8,
    borderRadius: 8,
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
  titleInput: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
    backgroundColor: '#FF3B30',
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
