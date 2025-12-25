import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native'; // Import Platform to fix layout on iPhone vs Android

// 1. IMPORT YOUR NEW SCREENS HERE
import CirclesScreen from '../screens/CirclesScreen';
import CoachScreen from '../screens/CoachScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // We hide the default top bar because we made our own custom headers
        tabBarStyle: { 
            backgroundColor: '#fff', 
            borderTopWidth: 0, 
            elevation: 10, // Shadow for Android
            height: Platform.OS === 'ios' ? 85 : 60, // Taller on iPhone to avoid the home bar
            paddingBottom: Platform.OS === 'ios' ? 30 : 10,
            paddingTop: 10
        },
        tabBarActiveTintColor: '#4f46e5', // Indigo color when selected
        tabBarInactiveTintColor: '#9CA3AF', // Gray color when not selected
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
        
        // This function decides which icon to show
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Circles') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Coach') {
            iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* 2. LINK THE BUTTONS TO THE SCREENS HERE */}
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Circles" component={CirclesScreen} />
      <Tab.Screen name="Coach" component={CoachScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}