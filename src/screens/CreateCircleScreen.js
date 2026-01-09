import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
// We will create this API function in the next step
import { createCircle } from '../services/api'; 

const CreateCircleScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('Monthly'); // Default
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name || !amount) {
      Alert.alert("Missing Info", "Please enter a circle name and amount.");
      return;
    }

    setLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const user = JSON.parse(storedUser);
      const userId = user.id || user.userId;

      const result = await createCircle(userId, name, Math.floor(amount), frequency);

      if (result.success) {
        // 1. SHOW THE CODE!
        Alert.alert(
          "Circle Created! 🎉",
          `Your Join Code is:\n\n${result.circle.joinCode}\n\nShare this with friends so they can join!`,
          [
            { 
              text: "OK", 
              onPress: () => navigation.navigate('Main', { screen: 'Home' }) 
            }
          ]
        );
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        <Text style={styles.title}>Create a Circle 🚀</Text>
        <Text style={styles.subtitle}>Start a saving group and invite your friends.</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Circle Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Europe Trip Fund"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Contribution Amount (₦)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 50000"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Frequency</Text>
          <View style={styles.frequencyContainer}>
            {['Weekly', 'Monthly'].map((freq) => (
              <TouchableOpacity 
                key={freq} 
                style={[styles.freqButton, frequency === freq && styles.freqActive]}
                onPress={() => setFrequency(freq)}
              >
                <Text style={[styles.freqText, frequency === freq && styles.freqTextActive]}>{freq}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.infoBox}>
             <Ionicons name="information-circle-outline" size={20} color="#4f46e5" />
             <Text style={styles.infoText}>
               You will be the Admin of this circle. You can invite members after creating it.
             </Text>
          </View>

          <TouchableOpacity style={styles.createButton} onPress={handleCreate} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Circle</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F3F4F6', padding: 20 },
  backButton: { marginTop: 30, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 30 },
  form: { backgroundColor: '#fff', padding: 20, borderRadius: 16, elevation: 2 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16 },
  
  frequencyContainer: { flexDirection: 'row', marginBottom: 25 },
  freqButton: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, alignItems: 'center', marginRight: 10 },
  freqActive: { backgroundColor: '#EEF2FF', borderColor: '#4f46e5' },
  freqText: { color: '#6B7280', fontWeight: '500' },
  freqTextActive: { color: '#4f46e5', fontWeight: 'bold' },

  infoBox: { flexDirection: 'row', backgroundColor: '#EEF2FF', padding: 15, borderRadius: 8, marginBottom: 25, alignItems: 'center' },
  infoText: { marginLeft: 10, color: '#4f46e5', flex: 1, fontSize: 13 },

  createButton: { backgroundColor: '#4f46e5', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default CreateCircleScreen;