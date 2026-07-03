import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use your computer's local IP address so Android emulator/physical devices can connect
// Make sure your backend is running on port 5000
const API_URL = 'http://192.168.8.124:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token to every request automatically
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token from AsyncStorage', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
