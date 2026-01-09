import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList, RefreshControl, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <--- Import Storage
import { fetchUserData } from '../services/api';
import { useFocusEffect } from '@react-navigation/native'; // <--- Useful for auto-refreshing when you come back to this tab

const DashboardScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 1. Define the Fetch Logic
  const loadData = async () => {
    try {
      // Get User ID from persistent storage (works even after refresh!)
      const storedUser = await AsyncStorage.getItem('user');
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser.id || parsedUser.userId;
        
        console.log("Dashboard - Fetching for ID:", userId);
        
        const data = await fetchUserData(userId);
        if (data) {
          setUserData(data);
        }
      }
    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 2. Initial Load
  useEffect(() => {
    loadData();
  }, []);

  // 3. Auto-refresh when user taps the "Home" tab again
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // 4. Pull-to-Refresh Logic
  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Fallback UI values
  const displayName = userData?.name || "User";
  const displayScore = userData?.trustScore || 0;
  const displaySaved = userData?.totalSaved || "₦0";
  const activeCircles = userData?.circles || [];

  return (
    <ScrollView 
      style={styles.container} 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {displayName.split(' ')[0]} 👋</Text>
          <Text style={styles.subGreeting}>Let's save for the future.</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
           <View style={styles.profileIcon}>
             <Text style={styles.profileInitial}>{displayName.charAt(0)}</Text>
           </View>
        </TouchableOpacity>
      </View>

      {/* Trust Score Card */}
      <View style={styles.scoreCard}>
        <View>
            <Text style={styles.scoreLabel}>Trust Score</Text>
            <Text style={styles.scoreValue}>{displayScore}</Text>
        </View>
        {/* Simple Visual Gauge Representation */}
        <View style={styles.gaugeContainer}>
            <Ionicons name="shield-checkmark" size={40} color="#fff" />
        </View>
      </View>

      {/* Total Saved */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
            <Ionicons name="wallet-outline" size={24} color="#4f46e5" />
            <Text style={styles.statLabel}>Total Saved</Text>
            <Text style={styles.statValue}>{displaySaved}</Text>
        </View>
        <View style={styles.statBox}>
            <Ionicons name="time-outline" size={24} color="#10B981" />
            <Text style={styles.statLabel}>Next Payout</Text>
            <Text style={styles.statValue}>Nov 24</Text>
        </View>
      </View>

      {/* Active Circles Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Active Circles</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Circles')}>
            <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {activeCircles.length === 0 ? (
        <View style={styles.emptyState}>
            <Text style={styles.emptyText}>You haven't joined any circles yet.</Text>
            <TouchableOpacity style={styles.joinButton} onPress={() => navigation.navigate('Circles')}>
                <Text style={styles.joinButtonText}>Find a Circle</Text>
            </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={activeCircles}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.circleCard}>
              <Text style={styles.circleName}>{item.name}</Text>
              <Text style={styles.circleAmount}>{item.amount}</Text>
              <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '50%' }]} />
              </View>
              <Text style={styles.circleStatus}>{item.nextTurn}</Text>
            </View>
          )}
        />
      )}
      
      {/* Quick Actions */}
      <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Quick Actions</Text>
      <View style={styles.actionGrid}>
        <ActionButton 
          icon="search-outline" 
          label="Join Circle" 
          onPress={() => navigation.navigate('Circles')} 
        />
        {/* NEW BUTTON HERE */}
        <ActionButton 
          icon="add-circle-outline" 
          label="Create Circle" 
          onPress={() => navigation.navigate('CreateCircle')} 
        />
        <ActionButton 
          icon="calculator-outline" 
          label="Calculator" 
          onPress={() => alert('Calculator Coming Soon!')} 
        />
      </View>
      <View style={{ height: 100 }} /> 
    </ScrollView>
  );
};

// Helper Component for Actions
const ActionButton = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
        <View style={styles.iconCircle}>
            <Ionicons name={icon} size={24} color="#4f46e5" />
        </View>
        <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 20 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  subGreeting: { fontSize: 14, color: '#6B7280' },
  profileIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0E7FF', justifyContent: 'center', alignItems: 'center' },
  profileInitial: { color: '#4f46e5', fontWeight: 'bold', fontSize: 18 },
  
  scoreCard: { backgroundColor: '#4f46e5', borderRadius: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, shadowColor: '#4f46e5', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  scoreLabel: { color: '#E0E7FF', fontSize: 14, marginBottom: 5 },
  scoreValue: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  gaugeContainer: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 50 },

  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statBox: { backgroundColor: '#fff', width: '48%', padding: 15, borderRadius: 16, elevation: 2 },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 5 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginTop: 2 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  seeAll: { color: '#4f46e5', fontWeight: '600' },

  emptyState: { backgroundColor: '#fff', padding: 20, borderRadius: 16, alignItems: 'center' },
  emptyText: { color: '#6B7280', marginBottom: 10 },
  joinButton: { backgroundColor: '#EEF2FF', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
  joinButtonText: { color: '#4f46e5', fontWeight: 'bold' },

  circleCard: { backgroundColor: '#fff', padding: 15, borderRadius: 16, marginRight: 15, width: 150, elevation: 2 },
  circleName: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  circleAmount: { color: '#4f46e5', fontWeight: 'bold', marginBottom: 10 },
  progressBar: { height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, marginBottom: 10 },
  progressFill: { height: 100, backgroundColor: '#10B981', borderRadius: 3 },
  circleStatus: { fontSize: 10, color: '#6B7280' },

  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  actionButton: { alignItems: 'center', width: '30%' },
  iconCircle: { backgroundColor: '#fff', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 8, elevation: 2 },
  actionLabel: { fontSize: 12, color: '#374151', fontWeight: '500' }
});

export default DashboardScreen;