import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView,
  Modal, ScrollView, Alert,
} from 'react-native';

const statusOptions = ['Viewed', 'Respond', 'In Progress', 'Resolved', 'Maintenance'];

const statusColors = {
  Pending: '#FF9800',
  Viewed: '#2196F3',
  Respond: '#9C27B0',
  'In Progress': '#00BCD4',
  Resolved: '#4CAF50',
  Maintenance: '#F44336',
};

const dummyComplaints = [
  {
    id: '1',
    student: 'Nipun Perera',
    room: 'Room 101',
    title: 'Water Tap Leaking',
    description: 'The bathroom tap has been leaking since yesterday causing water wastage.',
    category: 'Maintenance',
    priority: 'Medium',
    date: '2025-06-20',
    status: 'Pending',
  },
  {
    id: '2',
    student: 'Kasun Silva',
    room: 'Room 102',
    title: 'Wi-Fi Not Working',
    description: 'Cannot connect to Wi-Fi. Restarted router but still not working.',
    category: 'Utilities',
    priority: 'High',
    date: '2025-06-18',
    status: 'In Progress',
  },
  {
    id: '3',
    student: 'Amali Jayasuriya',
    room: 'Room 103',
    title: 'Broken Window Lock',
    description: 'The lock on the room window is broken and cannot be secured properly.',
    category: 'Security',
    priority: 'High',
    date: '2025-06-15',
    status: 'Resolved',
  },
];

const priorityIcon = { High: '🔴', Medium: '🟡', Low: '🟢' };

export default function OwnerComplaintsScreen() {
  const [complaints, setComplaints] = useState(dummyComplaints);
  const [selected, setSelected] = useState(null);

  const updateStatus = (id, newStatus) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: newStatus } : c));
    setSelected(prev => prev ? { ...prev, status: newStatus } : prev);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelected(item)}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] || '#999' }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>👤 {item.student}</Text>
        <Text style={styles.metaText}>🚪 {item.room}</Text>
        <Text style={styles.metaText}>📅 {item.date}</Text>
      </View>
      <View style={styles.tagRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.priorityText}>{priorityIcon[item.priority]} {item.priority}</Text>
      </View>
      <Text style={styles.tapHint}>Tap to view & respond →</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>Student Complaints</Text>
        <Text style={styles.pageSubtitle}>Manage complaints from your tenants</Text>
      </View>

      <FlatList
        data={complaints}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No complaints from your tenants.</Text>}
      />

      {/* Complaint Detail Modal */}
      <Modal visible={!!selected} animationType="slide" onRequestClose={() => setSelected(null)}>
        {selected && (
          <SafeAreaView style={styles.modal}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelected(null)}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Complaint Detail</Text>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={[styles.statusBadgeLg, { backgroundColor: statusColors[selected.status] || '#999' }]}>
                <Text style={styles.statusTextLg}>{selected.status}</Text>
              </View>

              <Text style={styles.detailLabel}>Complaint</Text>
              <Text style={styles.detailValue}>{selected.title}</Text>

              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailValue}>{selected.description}</Text>

              <View style={styles.detailRow}>
                <View style={styles.detailHalf}>
                  <Text style={styles.detailLabel}>Student</Text>
                  <Text style={styles.detailValue}>{selected.student}</Text>
                </View>
                <View style={styles.detailHalf}>
                  <Text style={styles.detailLabel}>Room</Text>
                  <Text style={styles.detailValue}>{selected.room}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailHalf}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>{selected.category}</Text>
                </View>
                <View style={styles.detailHalf}>
                  <Text style={styles.detailLabel}>Priority</Text>
                  <Text style={styles.detailValue}>{priorityIcon[selected.priority]} {selected.priority}</Text>
                </View>
              </View>

              <Text style={styles.detailLabel}>Submitted</Text>
              <Text style={styles.detailValue}>{selected.date}</Text>

              <Text style={styles.sectionTitle}>Update Status</Text>
              <Text style={styles.sectionHint}>Select an action to update the student's complaint status:</Text>

              <View style={styles.statusButtons}>
                {statusOptions.map(s => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.statusActionBtn,
                      { borderColor: statusColors[s] },
                      selected.status === s && { backgroundColor: statusColors[s] },
                    ]}
                    onPress={() => updateStatus(selected.id, s)}
                  >
                    <Text style={[
                      styles.statusActionText,
                      { color: selected.status === s ? '#FFF' : statusColors[s] },
                    ]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3EFFE' },
  headerContainer: { padding: 15 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#5B2D8E' },
  pageSubtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  listContainer: { padding: 15, paddingBottom: 30 },
  card: {
    backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 15,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardTitle: { fontWeight: 'bold', fontSize: 16, color: '#333', flex: 1, marginRight: 10 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  metaText: { fontSize: 12, color: '#666' },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  categoryBadge: { backgroundColor: '#E0D4F5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginRight: 10 },
  categoryText: { color: '#5B2D8E', fontSize: 12, fontWeight: 'bold' },
  priorityText: { fontSize: 12, color: '#444' },
  tapHint: { fontSize: 12, color: '#5B2D8E', fontStyle: 'italic' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40 },

  // Modal
  modal: { flex: 1, backgroundColor: '#F3EFFE' },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', padding: 15,
    backgroundColor: '#FFF', elevation: 3,
  },
  backText: { color: '#5B2D8E', fontWeight: 'bold', fontSize: 16, marginRight: 15 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  modalContent: { padding: 20, paddingBottom: 40 },
  statusBadgeLg: {
    alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 10, marginBottom: 20,
  },
  statusTextLg: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  detailLabel: { fontSize: 12, color: '#999', marginTop: 14, marginBottom: 4 },
  detailValue: { fontSize: 15, color: '#333', fontWeight: '500' },
  detailRow: { flexDirection: 'row', gap: 12 },
  detailHalf: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#5B2D8E', marginTop: 25, marginBottom: 6 },
  sectionHint: { fontSize: 13, color: '#666', marginBottom: 14 },
  statusButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statusActionBtn: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    borderWidth: 2,
  },
  statusActionText: { fontWeight: 'bold', fontSize: 14 },
});
