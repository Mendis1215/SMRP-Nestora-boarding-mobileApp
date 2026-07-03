import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

export default function OwnerDashboardScreen({ navigation }) {
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name || 'Boarding Owner'}!</Text>
        <Text style={styles.subtitle}>Manage your properties and tenants.</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.placeholderText}>Owner Dashboard Content</Text>
        <Text style={styles.subPlaceholderText}>
          (Module 3: Manage Announcements, Complaints, and Reviews here)
        </Text>
        
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3EFFE',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5B2D8E',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subPlaceholderText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  logoutBtn: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  logoutText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
