import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Colors, spacing } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { User, Building } from 'lucide-react-native';

interface UserProfile {
  id: string;
  email: string;
  role: string;
  name?: string;
  created_at: string;
}

export default function UserManagementScreen() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch all user profiles
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedUsers = profiles?.map(profile => ({
        id: profile.id,
        email: profile.email,
        role: profile.role,
        created_at: profile.created_at,
      })) || [];

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderUserItem = ({ item }: { item: UserProfile }) => (
    <Card style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userIcon}>
          {item.role === 'colony_manager' ? (
            <Building color={Colors.secondary} size={20} />
          ) : (
            <User color={Colors.primary} size={20} />
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.userRole}>
            {item.role.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </Card>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>User Management</Text>
        <Text style={styles.subtitle}>Manage all system users</Text>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>User Statistics</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {users.filter(u => u.role === 'garbage_collector').length}
            </Text>
            <Text style={styles.statLabel}>Collectors</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {users.filter(u => u.role === 'colony_manager').length}
            </Text>
            <Text style={styles.statLabel}>Managers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{users.length}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>All Users</Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading users...</Text>
        ) : (
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          />
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.gray900,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray600,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.gray900,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray600,
  },
  loadingText: {
    textAlign: 'center',
    color: Colors.gray600,
    fontSize: 16,
  },
  userCard: {
    padding: spacing.md,
    marginBottom: 0,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: spacing.xs,
  },
  userRole: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '600',
  },
  userDate: {
    fontSize: 12,
    color: Colors.gray500,
  },
});