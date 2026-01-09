import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { loginUser } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage'

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('prince@test.com'); // Pre-filled for demo speed
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await loginUser(email, password);
    setLoading(false);

    if (result.success) {
      // Navigate to Home and PASS the user data to it
      await AsyncStorage.setItem('user', JSON.stringify(result.user))
      navigation.replace('Main', { 
        screen: 'Home',
      });
    } else {
      Alert.alert('Login Failed', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PadiSave 🚀</Text>
        <Text style={styles.subtitle}>Login to access your circles</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
            disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#4f46e5', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#6B7280' },
  form: { backgroundColor: '#fff', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: '#4f46e5', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { textAlign: 'center', color: '#4f46e5', marginTop: 20, fontWeight: '500' }
});

export default LoginScreen;