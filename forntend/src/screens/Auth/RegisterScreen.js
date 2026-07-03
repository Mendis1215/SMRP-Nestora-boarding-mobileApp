import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [role, setRole] = useState('Student'); // 'Student' or 'Owner'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Name, email, and password are required');
      return;
    }

    setIsLoading(true);
    const result = await register({
      name,
      email,
      phone,
      password,
      role: role.toLowerCase()
    });
    setIsLoading(false);

    if (!result.success) {
      Alert.alert('Registration Failed', result.message);
    }
    // If successful, AppNavigator automatically switches Tabs
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerArea}>
             <Text style={styles.title}>Create Account</Text>
             <Text style={styles.subtitle}>Join SMRP Nestora today</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>I am a:</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity 
                style={[styles.roleBtn, role === 'Student' && styles.roleBtnActive]}
                onPress={() => setRole('Student')}
              >
                <Text style={[styles.roleText, role === 'Student' && styles.roleTextActive]}>Student / Tenant</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.roleBtn, role === 'Owner' && styles.roleBtnActive]}
                onPress={() => setRole('Owner')}
              >
                <Text style={[styles.roleText, role === 'Owner' && styles.roleTextActive]}>Boarding Owner</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>📱</Text>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Text style={styles.eyeIcon}>👁️</Text>
            </View>

            <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.registerBtnText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5B2D8E',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 10,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  roleBtnActive: {
    backgroundColor: '#5B2D8E',
    borderColor: '#5B2D8E',
  },
  roleText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 12,
  },
  roleTextActive: {
    color: '#FFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
    fontSize: 18,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#333',
  },
  eyeIcon: {
    marginLeft: 10,
    fontSize: 18,
  },
  registerBtn: {
    backgroundColor: '#5B2D8E',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  registerBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: '#5B2D8E',
    fontWeight: 'bold',
  },
});
