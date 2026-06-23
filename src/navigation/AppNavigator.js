import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

// Auth Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';

// Student Screens
import StudentDashboardScreen from '../screens/Student/StudentDashboardScreen';
import NotificationsScreen from '../screens/Student/NotificationsScreen';
import AnnouncementsScreen from '../screens/Student/AnnouncementsScreen';
import ReviewsScreen from '../screens/Student/ReviewsScreen';
import WriteReviewScreen from '../screens/Student/WriteReviewScreen';
import ComplaintsScreen from '../screens/Student/ComplaintsScreen';
import WriteComplaintScreen from '../screens/Student/WriteComplaintScreen';

// Owner Screens
import OwnerDashboardScreen from '../screens/Owner/OwnerDashboardScreen';
import OwnerNotificationsScreen from '../screens/Owner/OwnerNotificationsScreen';
import CreateNotificationScreen from '../screens/Owner/CreateNotificationScreen';
import OwnerAnnouncementsScreen from '../screens/Owner/OwnerAnnouncementsScreen';
import CreateAnnouncementScreen from '../screens/Owner/CreateAnnouncementScreen';
import OwnerReviewsScreen from '../screens/Owner/OwnerReviewsScreen';
import OwnerComplaintsScreen from '../screens/Owner/OwnerComplaintsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Placeholder for unbuilt pages
function PlaceholderScreen({ route }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>{route.name} Page</Text>
      <Text style={{ color: 'gray', marginTop: 10 }}>Coming Soon...</Text>
    </View>
  );
}

// ─── STUDENT STACKS ────────────────────────────────────────────────────────

function ReviewsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReviewsList" component={ReviewsScreen} />
      <Stack.Screen name="WriteReview" component={WriteReviewScreen} />
    </Stack.Navigator>
  );
}

function ComplaintsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ComplaintsList" component={ComplaintsScreen} />
      <Stack.Screen name="WriteComplaint" component={WriteComplaintScreen} />
    </Stack.Navigator>
  );
}

// ─── OWNER STACKS ──────────────────────────────────────────────────────────

function OwnerNotificationsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OwnerNotifList" component={OwnerNotificationsScreen} />
      <Stack.Screen name="CreateNotification" component={CreateNotificationScreen} />
    </Stack.Navigator>
  );
}

function OwnerAnnouncementsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OwnerAnnounceList" component={OwnerAnnouncementsScreen} />
      <Stack.Screen name="CreateAnnouncement" component={CreateAnnouncementScreen} />
    </Stack.Navigator>
  );
}

// ─── STUDENT TABS & DRAWER ─────────────────────────────────────────────────

function StudentTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#5B2D8E',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={StudentDashboardScreen}
        options={{ tabBarLabel: 'Home', tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text> }}
      />
      <Tab.Screen
        name="SearchTab"
        component={PlaceholderScreen}
        options={{ tabBarLabel: 'Search', tabBarIcon: () => <Text style={{ fontSize: 20 }}>🔍</Text> }}
      />
      <Tab.Screen
        name="BookingsTab"
        component={PlaceholderScreen}
        options={{ tabBarLabel: 'Bookings', tabBarIcon: () => <Text style={{ fontSize: 20 }}>📅</Text> }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={PlaceholderScreen}
        options={{ tabBarLabel: 'Profile', tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text> }}
      />
    </Tab.Navigator>
  );
}

function StudentDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}>
      <View>
        <View style={{ padding: 20, backgroundColor: '#5B2D8E', marginBottom: 10 }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Hello, Student!</Text>
          <Text style={{ color: '#D1C4E9', fontSize: 14 }}>student@nestora.com</Text>
        </View>
        <DrawerItemList {...props} />
      </View>
      <TouchableOpacity
        style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}
        onPress={() => props.navigation.replace('Auth')}
      >
        <Text style={{ color: '#FF3B30', fontSize: 16, fontWeight: 'bold' }}>🚪 Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

function StudentDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <StudentDrawerContent {...props} />}
      screenOptions={{
        headerTintColor: '#5B2D8E',
        drawerActiveTintColor: '#5B2D8E',
        drawerLabelStyle: { fontSize: 16 },
      }}
    >
      <Drawer.Screen name="Dashboard" component={StudentTabs} options={{ drawerIcon: () => <Text>🏠</Text> }} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} options={{ drawerIcon: () => <Text>🔔</Text> }} />
      <Drawer.Screen name="Announcements" component={AnnouncementsScreen} options={{ drawerIcon: () => <Text>📢</Text> }} />
      <Drawer.Screen name="Reviews" component={ReviewsStack} options={{ drawerIcon: () => <Text>⭐</Text> }} />
      <Drawer.Screen name="Complaints" component={ComplaintsStack} options={{ drawerIcon: () => <Text>🛠️</Text> }} />
      <Drawer.Screen name="Profile" component={PlaceholderScreen} options={{ drawerIcon: () => <Text>👤</Text> }} />
    </Drawer.Navigator>
  );
}

// ─── OWNER TABS & DRAWER ───────────────────────────────────────────────────

function OwnerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#5B2D8E',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={OwnerDashboardScreen}
        options={{ tabBarLabel: 'Home', tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text> }}
      />
      <Tab.Screen
        name="My Boardings"
        component={PlaceholderScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏢</Text> }}
      />
      <Tab.Screen
        name="Requests"
        component={PlaceholderScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>📝</Text> }}
      />
      <Tab.Screen
        name="Profile"
        component={PlaceholderScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text> }}
      />
    </Tab.Navigator>
  );
}

function OwnerDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}>
      <View>
        <View style={{ padding: 20, backgroundColor: '#2E7D32', marginBottom: 10 }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Hello, Owner!</Text>
          <Text style={{ color: '#C8E6C9', fontSize: 14 }}>owner@nestora.com</Text>
        </View>
        <DrawerItemList {...props} />
      </View>
      <TouchableOpacity
        style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}
        onPress={() => props.navigation.replace('Auth')}
      >
        <Text style={{ color: '#FF3B30', fontSize: 16, fontWeight: 'bold' }}>🚪 Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

function OwnerDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <OwnerDrawerContent {...props} />}
      screenOptions={{
        headerTintColor: '#2E7D32',
        drawerActiveTintColor: '#2E7D32',
        drawerLabelStyle: { fontSize: 16 },
      }}
    >
      <Drawer.Screen name="OwnerDashboard" component={OwnerTabs} options={{ title: 'Dashboard', drawerIcon: () => <Text>🏠</Text> }} />
      <Drawer.Screen name="OwnerNotifications" component={OwnerNotificationsStack} options={{ title: 'Notifications', drawerIcon: () => <Text>🔔</Text> }} />
      <Drawer.Screen name="OwnerAnnouncements" component={OwnerAnnouncementsStack} options={{ title: 'Announcements', drawerIcon: () => <Text>📢</Text> }} />
      <Drawer.Screen name="OwnerReviews" component={OwnerReviewsScreen} options={{ title: 'Reviews', drawerIcon: () => <Text>⭐</Text> }} />
      <Drawer.Screen name="OwnerComplaints" component={OwnerComplaintsScreen} options={{ title: 'Complaints', drawerIcon: () => <Text>🛠️</Text> }} />
      <Drawer.Screen name="OwnerProfile" component={PlaceholderScreen} options={{ title: 'Profile', drawerIcon: () => <Text>👤</Text> }} />
    </Drawer.Navigator>
  );
}

// ─── ROOT NAVIGATOR ────────────────────────────────────────────────────────

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="StudentTabs" component={StudentDrawer} />
        <Stack.Screen name="OwnerTabs" component={OwnerDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
