import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { signupUser } from '../services/api';

const SignupScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    // Call the API
    const result = await signupUser(fullName, email, password);
    setLoading(false);

    if (result.success) {
      Alert.alert("Success", "Account created! Welcome to PadiSave.");
      // Navigate directly to Home (skipping login since they just made an account)
      navigation.replace('Main', { 
        screen: 'Home',
        params: { user: { id: result.user.userId, name: result.user.name, trustScore: 450 } } 
      });
    } else {
      Alert.alert('Signup Failed', result.error);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account 🚀</Text>
          <Text style={styles.subtitle}>Join your circle and start saving.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Prince Doe"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. prince@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Already have an account? Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F3F4F6', justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4f46e5', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#6B7280' },
  form: { backgroundColor: '#fff', padding: 20, borderRadius: 16, elevation: 2 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: '#4f46e5', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { textAlign: 'center', color: '#4f46e5', marginTop: 20, fontWeight: '500' }
});

export default SignupScreen;