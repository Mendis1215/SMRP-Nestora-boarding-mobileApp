import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function ComplaintsScreen({ navigation }) {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchComplaints = async () => {
    try {
      // Trying student-specific endpoint if it exists, otherwise fallback to all and filter
      const response = await api.get('/complaints');
      const allComplaints = response.data.complaints || [];
      const myComplaints = allComplaints.filter(c => c.studentId?._id === user?._id || c.studentId === user?._id);
      setComplaints(myComplaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchComplaints();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert("Withdraw Complaint", "Are you sure you want to withdraw this complaint?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Withdraw", 
        style: "destructive", 
        onPress: async () => {
          try {
            await api.delete(`/complaints/${id}`);
            setComplaints(complaints.filter(c => c._id !== id));
          } catch (error) {
            console.error('Error deleting complaint:', error);
            Alert.alert('Error', 'Failed to withdraw complaint');
          }
        }
      }
    ]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#FF9800';
      case 'Under Review': return '#00BCD4';
      case 'Resolved': return '#4CAF50';
      default: return '#999';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High': return '🔴';
      case 'Medium': return '🟡';
      case 'Low': return '🟢';
      default: return '⚪';
    }
  };

  const renderComplaintCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>📅 {new Date(item.createdAt).toLocaleDateString()}</Text>
        <Text style={styles.metaText}>🏠 {item.boardingId?.name || 'Boarding'}</Text>
      </View>

      <View style={styles.tagRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category || 'General'}</Text>
        </View>
        <Text style={styles.priorityText}>{getPriorityIcon(item.priority)} {item.priority || 'Medium'} Priority</Text>
      </View>

      <Text style={styles.descriptionText}>{item.description}</Text>

      <View style={styles.actionRow}>
        {item.status === 'Pending' && (
          <TouchableOpacity 
            style={styles.editBtn}
            onPress={() => navigation.navigate('WriteComplaint', { complaintToEdit: item })}
          >
            <Text style={styles.editBtnText}>✏️ Edit</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.deleteBtn}
          onPress={() => handleDelete(item._id)}
        >
          <Text style={styles.deleteBtnText}>🗑️ Withdraw</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>My Complaints</Text>
        <Text style={styles.pageSubtitle}>Report and track your issues</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#5B2D8E" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item._id}
          renderItem={renderComplaintCard}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>You haven't submitted any complaints.</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('WriteComplaint')}
      >
        <Text style={styles.fabText}>+ File Complaint</Text>
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
  pageSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80,
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
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginRight: 15,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: '#E0D4F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  categoryText: {
    color: '#5B2D8E',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priorityText: {
    fontSize: 12,
    color: '#444',
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 15,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
