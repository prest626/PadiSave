import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { fetchUserData } from '../services/api';

const CoachScreen = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi Prince! I'm Padi, your financial coach. I noticed you paid your 'Uni Textbooks' circle on time. That boosted your trust score!", sender: 'ai' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    // 1. Add User Message
    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // 2. Simulate AI Response (Mock Logic for Demo)
    setTimeout(() => {
      let aiText = "That's a great question. Based on your current savings rate of ₦50k/month, you are on track to qualify for a laptop financing plan by next month.";
      
      if (input.toLowerCase().includes('score')) {
        aiText = "Your Trust Score is 720. It improved because you've made 3 consecutive payments without delay. To reach 750, try joining one more circle.";
      } else if (input.toLowerCase().includes('loan')) {
        aiText = "PadiSave doesn't offer traditional loans, but your score qualifies you for 'Buy Now, Pay Later' options with our partners at Slot and Jumia.";
      }

      const aiMsg = { id: Date.now() + 1, text: aiText, sender: 'ai' };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500); // 1.5 second delay to look real
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Padi Coach 🤖</Text>
        <Text style={styles.subtitle}>Powered by Azure OpenAI</Text>
      </View>

      <ScrollView style={styles.chatArea} contentContainerStyle={{ paddingBottom: 20 }}>
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.bubble, msg.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.msgText, msg.sender === 'user' ? styles.userText : styles.aiText]}>{msg.text}</Text>
          </View>
        ))}
        {isTyping && (
          <View style={styles.typingIndicator}>
             <Text style={styles.typingText}>Padi is typing...</Text>
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
        <View style={styles.inputArea}>
          <TextInput 
            style={styles.input} 
            placeholder="Ask about your finances..." 
            value={input}
            onChangeText={setInput}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  subtitle: { fontSize: 12, color: '#6366f1', fontWeight: '600' },
  chatArea: { flex: 1, padding: 15 },
  bubble: { maxWidth: '80%', padding: 14, borderRadius: 16, marginBottom: 12 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#4f46e5', borderBottomRightRadius: 2 },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#fff', borderBottomLeftRadius: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  msgText: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#fff' },
  aiText: { color: '#374151' },
  typingIndicator: { marginLeft: 10, marginTop: 5 },
  typingText: { fontSize: 12, color: '#9CA3AF', fontStyle: 'italic' },
  inputArea: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 24, paddingHorizontal: 20, paddingVertical: 12, fontSize: 16, marginRight: 10, color: '#1F2937' },
  sendButton: { backgroundColor: '#4f46e5', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' }
});

export default CoachScreen;