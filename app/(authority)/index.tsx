import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Colors, spacing } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { ChartBar as BarChart3, Users, Building, Package, LogOut } from 'lucide-react-native';

export default function AuthorityDashboard() {
  const { signOut } = useAuth();
  const [stats, setStats] = useState({
    totalCollectors: 0,
    totalManagers: 0,
    totalColonies: 0,
    totalWasteCollected: 0,
    weeklySubmissions: 0,
    monthlySubmissions: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get collector count
      const { count: collectorsCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'garbage_collector');

      // Get manager count
      const { count: managersCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'colony_manager');

      // Get total waste submissions
      const { data: wasteData } = await supabase
        .from('waste_submissions')
        .select('weight');

      const totalWaste = wasteData?.reduce((sum, item) => sum + item.weight, 0) || 0;

      // Get unique colonies count
      const { data: coloniesData } = await supabase
        .from('waste_submissions')
        .select('colony_name')
        .neq('colony_name', null);

      const uniqueColonies = new Set(coloniesData?.map(item => item.colony_name)).size;

      setStats({
        totalCollectors: collectorsCount || 0,
        totalManagers: managersCount || 0,
        totalColonies: uniqueColonies,
        totalWasteCollected: totalWaste,
        weeklySubmissions: wasteData?.length || 0,
        monthlySubmissions: wasteData?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/welcome');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Government Dashboard</Text>
          <Text style={styles.subtitle}>System-wide analytics and insights</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
          <LogOut color={Colors.error} size={20} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Users color={Colors.primary} size={24} />
          <Text style={styles.statNumber}>{stats.totalCollectors}</Text>
          <Text style={styles.statLabel}>Garbage Collectors</Text>
        </Card>

        <Card style={styles.statCard}>
          <Building color={Colors.secondary} size={24} />
          <Text style={styles.statNumber}>{stats.totalManagers}</Text>
          <Text style={styles.statLabel}>Colony Managers</Text>
        </Card>

        <Card style={styles.statCard}>
          <BarChart3 color={Colors.accent} size={24} />
          <Text style={styles.statNumber}>{stats.totalColonies}</Text>
          <Text style={styles.statLabel}>Active Colonies</Text>
        </Card>

        <Card style={styles.statCard}>
          <Package color={Colors.success} size={24} />
          <Text style={styles.statNumber}>{stats.totalWasteCollected.toFixed(1)} kg</Text>
          <Text style={styles.statLabel}>Total Waste Collected</Text>
        </Card>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>System Overview</Text>
        <View style={styles.overviewGrid}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Weekly Submissions</Text>
            <Text style={styles.overviewValue}>{stats.weeklySubmissions}</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Monthly Submissions</Text>
            <Text style={styles.overviewValue}>{stats.monthlySubmissions}</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <Text style={styles.description}>
          Use the tabs below to manage users, search colonies, and track vehicles 
          across the entire waste management system.
        </Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        <Text style={styles.description}>
          Monitor collection efficiency, response times, and waste processing 
          statistics across all managed areas.
        </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  logoutText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.gray900,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray600,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: spacing.md,
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewItem: {
    flex: 1,
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 14,
    color: Colors.gray600,
    marginBottom: spacing.xs,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.gray900,
  },
  description: {
    fontSize: 14,
    color: Colors.gray600,
    lineHeight: 20,
  },
});