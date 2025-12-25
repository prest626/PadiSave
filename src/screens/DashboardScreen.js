import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DashboardScreen = () => {
  // Mock Data
  const userStats = {
    name: "Prince",
    trustScore: 720,
    totalSaved: "₦450,000",
  };

  const activeCircles = [
    { id: 1, name: "Uni Textbooks", amount: "₦50k", progress: 0.75, nextTurn: "You" },
    { id: 2, name: "Laptop Fund", amount: "₦100k", progress: 0.30, nextTurn: "Sarah" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {userStats.name} 👋</Text>
            <Text style={styles.subGreeting}>Let's check your financial health.</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
             <Ionicons name="person-circle-outline" size={40} color="#444" />
          </TouchableOpacity>
        </View>

        {/* Trust Score Card */}
        <LinearGradient
          colors={['#0f172a', '#1e293b']}
          style={styles.trustCard}
        >
          <View style={styles.trustHeader}>
            <Text style={styles.trustLabel}>Financial Trust Score</Text>
            <Ionicons name="shield-checkmark" size={24} color="#4ade80" />
          </View>
          
          <Text style={styles.scoreText}>{userStats.trustScore}</Text>
          
          <View style={styles.scoreBadge}>
            <Ionicons name="trending-up" size={16} color="#166534" />
            <Text style={styles.scoreChange}>+15 pts this month</Text>
          </View>

          <View style={styles.divider} />
          
          <View style={styles.walletRow}>
             <Text style={styles.walletLabel}>Total Saved</Text>
             <Text style={styles.walletValue}>{userStats.totalSaved}</Text>
          </View>
        </LinearGradient>

        {/* AI Insight Pill */}
        <TouchableOpacity style={styles.aiPill}>
          <View style={styles.aiIconContainer}>
             <Ionicons name="bulb" size={20} color="#fff" />
          </View>
          <View style={styles.aiTextContainer}>
            <Text style={styles.aiTitle}>Padi Coach Tip</Text>
            <Text style={styles.aiMessage} numberOfLines={1}>
              Great consistency! You're 2 cycles away from...
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6366f1" />
        </TouchableOpacity>

        {/* Active Circles Section */}
        <Text style={styles.sectionTitle}>Your Savings Circles</Text>
        
        {activeCircles.map((circle) => (
          <View key={circle.id} style={styles.circleCard}>
            <View style={styles.circleHeader}>
              <View style={styles.iconCircle}>
                <Ionicons name="people" size={20} color="#f97316" />
              </View>
              <View style={styles.circleInfo}>
                <Text style={styles.circleName}>{circle.name}</Text>
                <Text style={styles.circleAmount}>{circle.amount} / month</Text>
              </View>
              <View style={[
                  styles.statusBadge, 
                  circle.nextTurn === 'You' ? styles.statusAlert : styles.statusGood
                ]}>
                <Text style={[
                  styles.statusText,
                  circle.nextTurn === 'You' ? styles.textAlert : styles.textGood
                ]}>
                  {circle.nextTurn === 'You' ? 'Your Turn' : 'Active'}
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${circle.progress * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(circle.progress * 100)}% Complete</Text>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  subGreeting: { fontSize: 14, color: '#6B7280' },
  trustCard: { padding: 24, borderRadius: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  trustHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  trustLabel: { color: '#94A3B8', fontWeight: '600' },
  scoreText: { fontSize: 48, fontWeight: 'bold', color: '#fff' },
  scoreBadge: { backgroundColor: '#dcfce7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4 },
  scoreChange: { color: '#166534', fontWeight: 'bold', fontSize: 12 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 16 },
  walletRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  walletLabel: { color: '#94A3B8' },
  walletValue: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  aiPill: { backgroundColor: '#EEF2FF', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#E0E7FF' },
  aiIconContainer: { backgroundColor: '#6366f1', padding: 8, borderRadius: 50, marginRight: 12 },
  aiTextContainer: { flex: 1 },
  aiTitle: { fontSize: 12, fontWeight: 'bold', color: '#4338ca' },
  aiMessage: { fontSize: 13, color: '#3730a3' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 },
  circleCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  circleHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconCircle: { backgroundColor: '#FFEDD5', padding: 10, borderRadius: 50, marginRight: 12 },
  circleInfo: { flex: 1 },
  circleName: { fontWeight: 'bold', fontSize: 16, color: '#1F2937' },
  circleAmount: { fontSize: 12, color: '#6B7280' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusAlert: { backgroundColor: '#FEE2E2' },
  statusGood: { backgroundColor: '#DCFCE7' },
  textAlert: { color: '#991B1B', fontWeight: 'bold', fontSize: 10 },
  textGood: { color: '#166534', fontWeight: 'bold', fontSize: 10 },
  progressContainer: { height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  progressBar: { height: '100%', backgroundColor: '#3B82F6' },
  progressText: { fontSize: 10, color: '#9CA3AF', textAlign: 'right' },
});

export default DashboardScreen;