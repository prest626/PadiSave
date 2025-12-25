import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const ProfileScreen = () => {
  const [isIlpConnected, setIsIlpConnected] = React.useState(true);

  const MenuItem = ({ icon, label, color = '#374151', isDestructive = false }) => (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <View style={[styles.iconContainer, { backgroundColor: isDestructive ? '#FEE2E2' : '#F3F4F6' }]}>
          <Ionicons name={icon} size={20} color={isDestructive ? '#EF4444' : color} />
        </View>
        <Text style={[styles.menuLabel, { color: isDestructive ? '#EF4444' : '#374151' }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
             <Text style={styles.avatarText}>PN</Text>
          </View>
          <Text style={styles.name}>Prince Nnadi-Ike</Text>
          <Text style={styles.email}>prince@unt.edu</Text>
          <View style={styles.tag}>
             <Text style={styles.tagText}>Tier 2 Saver</Text>
          </View>
        </View>

        {/* Integration Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Integrations</Text>
          <View style={styles.row}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
               <Ionicons name="wallet-outline" size={22} color="#4f46e5" style={{marginRight: 12}} />
               <View>
                 <Text style={styles.rowTitle}>Interledger Wallet</Text>
                 <Text style={styles.rowSubtitle}>{isIlpConnected ? 'Connected: $ilp.uphold.com/prince' : 'Not Connected'}</Text>
               </View>
            </View>
            <Switch 
              value={isIlpConnected} 
              onValueChange={setIsIlpConnected} 
              trackColor={{ false: "#767577", true: "#4f46e5" }}
            />
          </View>
        </View>

        {/* Settings Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <MenuItem icon="document-text-outline" label="Transaction History" />
          <MenuItem icon="shield-checkmark-outline" label="Trust Score Report" />
          <MenuItem icon="notifications-outline" label="Notifications" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <MenuItem icon="lock-closed-outline" label="Change Password" />
          <MenuItem icon="log-out-outline" label="Log Out" isDestructive />
        </View>

        <Text style={styles.version}>PadiSave v1.0.0 (MVP)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: '#fff', padding: 30, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#4f46e5', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  email: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  tag: { backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagText: { color: '#4f46e5', fontSize: 12, fontWeight: 'bold' },
  section: { marginTop: 20, backgroundColor: '#fff', paddingHorizontal: 20 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#9CA3AF', marginBottom: 10, marginTop: 20, textTransform: 'uppercase' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  rowTitle: { fontSize: 16, color: '#1F2937', fontWeight: '500' },
  rowSubtitle: { fontSize: 12, color: '#6B7280' },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { padding: 8, borderRadius: 8, marginRight: 12 },
  menuLabel: { fontSize: 16, fontWeight: '500' },
  version: { textAlign: 'center', color: '#D1D5DB', marginTop: 30, marginBottom: 40, fontSize: 12 }
});

export default ProfileScreen;