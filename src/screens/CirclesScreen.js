import { Ionicons } from '@expo/vector-icons';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CirclesScreen = () => {
  // Mock Data: The rotation order for a specific circle
  const currentRotation = [
    { id: 1, name: 'Prince (You)', status: 'paid', date: 'Oct 1', amount: '₦50k' },
    { id: 2, name: 'Sarah', status: 'paid', date: 'Nov 1', amount: '₦50k' },
    { id: 3, name: 'Emeka', status: 'pending', date: 'Dec 1', amount: '₦50k' },
    { id: 4, name: 'Tunde', status: 'upcoming', date: 'Jan 1', amount: '₦50k' },
  ];

  const renderMember = ({ item, index }) => (
    <View style={styles.memberRow}>
      <View style={styles.timelineContainer}>
        <View style={[styles.dot, item.status === 'paid' ? styles.dotPaid : item.status === 'pending' ? styles.dotPending : styles.dotUpcoming]} />
        {index !== currentRotation.length - 1 && <View style={styles.line} />}
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberDate}>Payout: {item.date}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.amountText}>{item.amount}</Text>
        {item.status === 'paid' && <Ionicons name="checkmark-circle" size={16} color="#16a34a" />}
        {item.status === 'pending' && <Ionicons name="time" size={16} color="#ca8a04" />}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Circles</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Active Circle Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Uni Textbooks 📚</Text>
              <Text style={styles.cardSubtitle}>Monthly Contribution</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Active</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statLabel}>Total Pot</Text>
              <Text style={styles.statValue}>₦200,000</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>Your Turn</Text>
              <Text style={styles.statValue}>Oct 1st</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>Members</Text>
              <Text style={styles.statValue}>4/4</Text>
            </View>
          </View>

          <View style={styles.divider} />
          
          <Text style={styles.sectionHeader}>Rotation Schedule</Text>
          <FlatList 
            data={currentRotation}
            renderItem={renderMember}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* Pending Invitation Card (Visual Filler) */}
        <View style={[styles.card, { opacity: 0.8 }]}>
           <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Laptop Fund 💻</Text>
            <View style={[styles.badge, { backgroundColor: '#fef3c7' }]}>
              <Text style={[styles.badgeText, { color: '#d97706' }]}>Pending</Text>
            </View>
          </View>
          <Text style={{ color: '#6b7280', marginTop: 8 }}>Waiting for 2 more members to join...</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { padding: 20, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
  addButton: { backgroundColor: '#4f46e5', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  cardSubtitle: { fontSize: 12, color: '#6B7280' },
  badge: { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: '#166534', fontSize: 10, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statLabel: { fontSize: 12, color: '#9CA3AF' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 20 },
  sectionHeader: { fontSize: 14, fontWeight: '600', color: '#4B5563', marginBottom: 15 },
  memberRow: { flexDirection: 'row', height: 60 },
  timelineContainer: { alignItems: 'center', width: 30 },
  dot: { width: 12, height: 12, borderRadius: 6, zIndex: 10 },
  dotPaid: { backgroundColor: '#16a34a' },
  dotPending: { backgroundColor: '#ca8a04' },
  dotUpcoming: { backgroundColor: '#e5e7eb' },
  line: { width: 2, flex: 1, backgroundColor: '#e5e7eb', position: 'absolute', top: 12, bottom: -12 },
  memberInfo: { flex: 1, paddingLeft: 10 },
  memberName: { fontWeight: '600', color: '#374151' },
  memberDate: { fontSize: 12, color: '#9CA3AF' },
  amountContainer: { alignItems: 'flex-end' },
  amountText: { fontWeight: 'bold', color: '#1F2937' }
});

export default CirclesScreen;