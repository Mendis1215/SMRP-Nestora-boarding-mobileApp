import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,
  SafeAreaView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';

const notifyTypes = ['Booking', 'Payment', 'Announcement', 'Maintenance', 'General'];
const recipientOptions = ['All Registered Students', 'Only My Booked Students', 'Specific Student'];

export default function CreateNotificationScreen({ navigation }) {
  const [notifyType, setNotifyType] = useState(notifyTypes[0]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [recipients, setRecipients] = useState(recipientOptions[0]);
  const [showRecipientsDropdown, setShowRecipientsDropdown] = useState(false);
  const [specificStudent, setSpecificStudent] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  // Extra announcement fields (required only when type is Announcement)
  const [annPriority, setAnnPriority] = useState('Normal');
  const [annContent, setAnnContent] = useState('');

  const isAnnouncement = notifyType === 'Announcement';

  const handleSend = () => {
    if (!title.trim()) { Alert.alert('Missing Title', 'Please enter a title.'); return; }
    if (!message.trim()) { Alert.alert('Missing Message', 'Please enter a message.'); return; }
    if (recipients === 'Specific Student' && !specificStudent.trim()) {
      Alert.alert('Missing Recipient', 'Please enter the student name/ID.'); return;
    }
    if (isAnnouncement && !annContent.trim()) {
      Alert.alert('Announcement Details Required', 'You must fill in the Announcement Content before sending an announcement type notification.');
      return;
    }

    const newNotification = {
      id: Date.now().toString(),
      type: notifyType,
      title,
      message,
      recipients: recipients === 'Specific Student' ? specificStudent : recipients,
      date: new Date().toISOString().split('T')[0],
      isSystem: false,
    };

    Alert.alert('Success', 'Notification sent!', [
      { text: 'OK', onPress: () => navigation.navigate('OwnerNotifList', { newNotification }) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Notification</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Notification Type */}
          <Text style={styles.label}>Notification Type</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => { setShowTypeDropdown(!showTypeDropdown); setShowRecipientsDropdown(false); }}>
            <Text style={styles.dropdownText}>{notifyType}</Text>
            <Text>▼</Text>
          </TouchableOpacity>
          {showTypeDropdown && (
            <View style={styles.dropdownMenu}>
              {notifyTypes.map(t => (
                <TouchableOpacity key={t} style={styles.dropdownItem} onPress={() => { setNotifyType(t); setShowTypeDropdown(false); }}>
                  <Text>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Announcement Fields (only shown when type = Announcement) */}
          {isAnnouncement && (
            <View style={styles.announcementBox}>
              <Text style={styles.announcementBadge}>📢 Announcement Details Required</Text>
              <Text style={styles.label}>Priority</Text>
              {['Low', 'Normal', 'High', 'Urgent'].map(p => (
                <TouchableOpacity key={p} style={[styles.priorityBtn, annPriority === p && styles.priorityBtnActive]} onPress={() => setAnnPriority(p)}>
                  <Text style={[styles.priorityText, annPriority === p && styles.priorityTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
              <Text style={styles.label}>Announcement Content</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Write detailed announcement content..."
                multiline
                numberOfLines={4}
                value={annContent}
                onChangeText={setAnnContent}
                textAlignVertical="top"
              />
            </View>
          )}

          {/* Recipients */}
          <Text style={styles.label}>Recipients</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => { setShowRecipientsDropdown(!showRecipientsDropdown); setShowTypeDropdown(false); }}>
            <Text style={styles.dropdownText}>{recipients}</Text>
            <Text>▼</Text>
          </TouchableOpacity>
          {showRecipientsDropdown && (
            <View style={styles.dropdownMenu}>
              {recipientOptions.map(r => (
                <TouchableOpacity key={r} style={styles.dropdownItem} onPress={() => { setRecipients(r); setShowRecipientsDropdown(false); }}>
                  <Text>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {recipients === 'Specific Student' && (
            <TextInput
              style={[styles.singleInput, { marginTop: 8 }]}
              placeholder="Enter student name or ID..."
              value={specificStudent}
              onChangeText={setSpecificStudent}
            />
          )}

          {/* Title */}
          <Text style={styles.label}>Title</Text>
          <TextInput style={styles.singleInput} placeholder="Notification title..." value={title} onChangeText={setTitle} />

          {/* Message */}
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Write your message here..."
            multiline
            numberOfLines={5}
            value={message}
            onChangeText={setMessage}
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Text style={styles.sendBtnText}>📤 Send Notification</Text>
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
  label: { fontSize: 15, fontWeight: 'bold', color: '#5B2D8E', marginTop: 15, marginBottom: 8 },
  dropdown: {
    flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFF',
    padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0',
  },
  dropdownText: { fontSize: 15, color: '#333' },
  dropdownMenu: {
    backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1,
    borderColor: '#E0E0E0', marginTop: 5, overflow: 'hidden',
  },
  dropdownItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  singleInput: {
    backgroundColor: '#FFF', borderRadius: 8, padding: 14,
    fontSize: 15, borderWidth: 1, borderColor: '#E0E0E0',
  },
  textInput: {
    backgroundColor: '#FFF', borderRadius: 8, padding: 14, fontSize: 15,
    minHeight: 120, borderWidth: 1, borderColor: '#E0E0E0',
  },
  announcementBox: {
    backgroundColor: '#FFF3E0', borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: '#FF9800', marginTop: 10,
  },
  announcementBadge: { color: '#E65100', fontWeight: 'bold', marginBottom: 10 },
  priorityBtn: {
    padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ccc',
    marginBottom: 8, alignItems: 'center',
  },
  priorityBtnActive: { backgroundColor: '#5B2D8E', borderColor: '#5B2D8E' },
  priorityText: { color: '#333' },
  priorityTextActive: { color: '#FFF', fontWeight: 'bold' },
  sendBtn: {
    backgroundColor: '#5B2D8E', borderRadius: 8, padding: 15,
    alignItems: 'center', marginTop: 30,
  },
  sendBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
