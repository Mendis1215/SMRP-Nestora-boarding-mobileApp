import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,
  SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';

const priorities = ['Low', 'Normal', 'High', 'Urgent'];
const currentOwner = 'Mr. Sunil Perera';

export default function CreateAnnouncementScreen({ navigation, route }) {
  const isEdit = !!route.params?.announcementToEdit;
  const existing = route.params?.announcementToEdit;

  const [priority, setPriority] = useState('Normal');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (isEdit && existing) {
      setPriority(existing.priority);
      setTitle(existing.title);
      setContent(existing.content);
    }
  }, []);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both Title and Content.');
      return;
    }

    const newAnnouncement = {
      id: isEdit ? existing.id : Date.now().toString(),
      title,
      content,
      priority,
      author: currentOwner,
      date: isEdit ? existing.date : new Date().toISOString().split('T')[0],
      isMine: true,
    };

    navigation.navigate('OwnerAnnounceList', { newAnnouncement, isEdit });
  };

  const priorityColors = { Low: '#4CAF50', Normal: '#2196F3', High: '#FF9800', Urgent: '#F44336' };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEdit ? 'Edit Announcement' : 'New Announcement'}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.autoInfo}>
            <Text style={styles.autoInfoText}>👤 Author: {currentOwner}  |  📅 {new Date().toISOString().split('T')[0]}</Text>
          </View>

          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityRow}>
            {priorities.map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.priorityBtn, priority === p && { backgroundColor: priorityColors[p] }]}
                onPress={() => setPriority(p)}
              >
                <Text style={[styles.priorityBtnText, priority === p && { color: '#FFF' }]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.singleInput}
            placeholder="Announcement title..."
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Content</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Write the full announcement content..."
            multiline
            numberOfLines={6}
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>{isEdit ? '✅ Update Announcement' : '📢 Post Announcement'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3EFFE' },
  header: {
    flexDirection: 'row', alignItems: 'center', padding: 15,
    backgroundColor: '#FFF', elevation: 3,
  },
  backText: { color: '#5B2D8E', fontWeight: 'bold', fontSize: 16, marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  scrollContent: { padding: 15, paddingBottom: 40 },
  autoInfo: {
    backgroundColor: '#E0D4F5', borderRadius: 8, padding: 12, marginBottom: 10,
  },
  autoInfoText: { color: '#5B2D8E', fontSize: 13 },
  label: { fontSize: 15, fontWeight: 'bold', color: '#5B2D8E', marginTop: 15, marginBottom: 8 },
  priorityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  priorityBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: '#ccc',
  },
  priorityBtnText: { color: '#444', fontWeight: '500' },
  singleInput: {
    backgroundColor: '#FFF', borderRadius: 8, padding: 14,
    fontSize: 15, borderWidth: 1, borderColor: '#E0E0E0',
  },
  textInput: {
    backgroundColor: '#FFF', borderRadius: 8, padding: 14, fontSize: 15,
    minHeight: 140, borderWidth: 1, borderColor: '#E0E0E0',
  },
  submitBtn: {
    backgroundColor: '#5B2D8E', borderRadius: 8, padding: 15,
    alignItems: 'center', marginTop: 30,
  },
  submitBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
