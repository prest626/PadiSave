import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import Screens
import DashboardScreen from '../screens/DashboardScreen';
// We'll use Dashboard as a placeholder for others for now to avoid errors
const Placeholder = () => <DashboardScreen />; 

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { 
            backgroundColor: '#fff', 
            borderTopWidth: 0, 
            elevation: 5, 
            height: 60, 
            paddingBottom: 8 
        },
        tabBarActiveTintColor: '#4338ca', // Indigo color
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Circles') iconName = focused ? 'people' : 'people-outline';
          else if (route.name === 'Coach') iconName = focused ? 'bulb' : 'bulb-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Circles" component={Placeholder} />
      <Tab.Screen name="Coach" component={Placeholder} />
      <Tab.Screen name="Profile" component={Placeholder} />
    </Tab.Navigator>
  );
}