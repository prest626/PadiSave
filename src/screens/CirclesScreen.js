import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Useful for refreshing when switching tabs
import { fetchUserData } from '../services/api';

const CirclesScreen = ({ navigation }) => {
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCircles = async () => {
    setLoading(true);
    try {
      // Reusing your existing function since it returns { circles: [...] }
      const data = await fetchUserData(); 
      if (data && data.circles) {
        setCircles(data.circles);
      }
    } catch (error) {
      console.error("Failed to fetch circles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Automatically load data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCircles();
    }, [])
  );

  const renderCircleItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      // Optional: Navigate to a details page if clicked
      // onPress={() => navigation.navigate('CircleDetails', { circleId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.circleName}>{item.name}</Text>
        <Text style={styles.statusTag}>Active</Text>
      </View>
      
      <View style={styles.divider} />

      <View style={styles.cardBody}>
        <View style={styles.statRow}>
          <Text style={styles.label}>Frequency:</Text>
          <Text style={styles.value}>{item.frequency || 'Weekly'}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.label}>Join Code:</Text>
          <Text style={styles.code}>{item.circleCode || 'N/A'}</Text>
        </View>
        <View style={styles.statRow}>
           {/* Using Math.floor if you need to chop off decimals for money display */}
          <Text style={styles.label}>Contribution:</Text>
          <Text style={styles.value}>${Math.floor(item.amount || 0)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>My Circles</Text>

      {loading && circles.length === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={circles}
          keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
          renderItem={renderCircleItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadCircles} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>You haven't joined any circles yet.</Text>
              <TouchableOpacity style={styles.createButton}>
                <Text style={styles.createButtonText}>Create a Circle</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40, // Space for status bar
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  circleName: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusTag: {
    backgroundColor: '#e6f4ea',
    color: '#1e8e3e',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  cardBody: {
    marginTop: 4,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: '#666',
    fontSize: 14,
  },
  value: {
    fontWeight: '500',
    fontSize: 14,
  },
  code: {
    fontWeight: 'bold',
    color: '#007AFF', // Blue for the code to make it pop
    letterSpacing: 1,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CirclesScreen;