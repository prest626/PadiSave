import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <--- Import this
import { fetchUserData } from '../services/api';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Load User from Storage (Works even on Refresh!)
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const userId = parsedUser.id || parsedUser.userId;
          
          console.log("Profile - Loading ID from Storage:", userId);

          // Fetch fresh data from API
          const apiData = await fetchUserData(userId);
          if (apiData) {
            setUserData(apiData);
          }
        }
      } catch (e) {
        console.error("Failed to load user", e);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleLogout = async () => {
    const doLogout = async () => {
      await AsyncStorage.clear(); // <--- Wipe memory on logout
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Log out?")) doLogout();
    } else {
      Alert.alert("Log Out", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: 'destructive', onPress: doLogout }
      ]);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  // Fallback values
  const displayName = userData?.name || "User";
  const displayEmail = userData?.email || "user@example.com";
  const displayScore = userData?.trustScore || 0;
  const displayInitial = displayName.charAt(0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{displayInitial}</Text>
        </View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{displayEmail}</Text>
        <View style={styles.badge}>
            <Text style={styles.badgeText}>Trust Score: {displayScore}</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <MenuItem icon="person-outline" title="Edit Profile" />
        <MenuItem icon="card-outline" title="Payment Methods" />
        <MenuItem icon="notifications-outline" title="Notifications" />
        <MenuItem icon="shield-checkmark-outline" title="Privacy & Security" />
        <MenuItem icon="help-circle-outline" title="Help & Support" />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      
      <Text style={styles.version}>Version 1.0.0 (MVP)</Text>
    </ScrollView>
  );
};

// Helper Component
const MenuItem = ({ icon, title }) => (
  <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Coming Soon")}>
    <View style={styles.menuRow}>
      <Ionicons name={icon} size={24} color="#374151" />
      <Text style={styles.menuText}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    backgroundColor: '#fff', alignItems: 'center', paddingVertical: 40,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 5, marginBottom: 20
  },
  avatarContainer: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#4f46e5',
    justifyContent: 'center', alignItems: 'center', marginBottom: 15
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
  email: { fontSize: 14, color: '#6B7280', marginBottom: 10 },
  badge: { backgroundColor: '#E0E7FF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#4f46e5', fontWeight: 'bold', fontSize: 12 },
  menu: { backgroundColor: '#fff', paddingHorizontal: 20, marginBottom: 20 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderColor: '#F3F4F6', alignItems: 'center' },
  menuRow: { flexDirection: 'row', alignItems: 'center' },
  menuText: { fontSize: 16, marginLeft: 15, color: '#374151' },
  logoutButton: { marginHorizontal: 20, backgroundColor: '#FEF2F2', padding: 15, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#DC2626', fontWeight: 'bold', fontSize: 16 },
  version: { textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginTop: 20, marginBottom: 40 }
});

export default ProfileScreen;