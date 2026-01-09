import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignUpScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CirclesScreen from '../screens/CirclesScreen';
import CoachScreen from '../screens/CoachScreen';
import CreateCircleScreen from '../screens/CreateCircleScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 1. We accept { route } here so we can grab the user data passed from Login
function MainTabNavigator({ route }) {
  
  // Get the user params (or empty object if undefined) to pass to tabs
  const { user } = route.params || {};

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { 
            backgroundColor: '#fff', 
            borderTopWidth: 0, 
            elevation: 10, 
            height: Platform.OS === 'ios' ? 85 : 60,
            paddingBottom: Platform.OS === 'ios' ? 30 : 10,
            paddingTop: 10
        },
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Circles') iconName = focused ? 'people' : 'people-outline';
          else if (route.name === 'Coach') iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* We pass initialParams so these screens know who the user is */}
      <Tab.Screen name="Home" component={DashboardScreen} initialParams={{ user }} />
      <Tab.Screen name="Circles" component={CirclesScreen} initialParams={{ user }} />
      <Tab.Screen name="Coach" component={CoachScreen} initialParams={{ user }} />
      <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{ user }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="CreateCircle" component={CreateCircleScreen} />
    </Stack.Navigator>
  );
}