import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Colors, spacing } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { FileText, Package, Clock, TrendingUp } from 'lucide-react-native';

export default function CollectorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    todaySubmissions: 0,
    totalWeight: 0,
    weeklySubmissions: 0,
    averageWeight: 0,
  });

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // Get today's submissions
      const { data: todayData } = await supabase
        .from('waste_submissions')
        .select('weight')
        .eq('collector_id', user?.id)
        .gte('date_time', today);

      // Get weekly submissions
      const { data: weeklyData } = await supabase
        .from('waste_submissions')
        .select('weight')
        .eq('collector_id', user?.id)
        .gte('date_time', weekAgo);

      const todaySubmissions = todayData?.length || 0;
      const totalWeight = todayData?.reduce((sum, item) => sum + item.weight, 0) || 0;
      const weeklySubmissions = weeklyData?.length || 0;
      const averageWeight = weeklySubmissions > 0 
        ? (weeklyData?.reduce((sum, item) => sum + item.weight, 0) || 0) / weeklySubmissions 
        : 0;

      setStats({
        todaySubmissions,
        totalWeight,
        weeklySubmissions,
        averageWeight,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Track your daily waste collection</Text>
      </View>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <FileText color={Colors.primary} size={24} />
          </View>
          <Text style={styles.statNumber}>{stats.todaySubmissions}</Text>
          <Text style={styles.statLabel}>Today's Submissions</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Package color={Colors.secondary} size={24} />
          </View>
          <Text style={styles.statNumber}>{stats.totalWeight.toFixed(1)} kg</Text>
          <Text style={styles.statLabel}>Today's Total Weight</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Clock color={Colors.accent} size={24} />
          </View>
          <Text style={styles.statNumber}>{stats.weeklySubmissions}</Text>
          <Text style={styles.statLabel}>Weekly Submissions</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <TrendingUp color={Colors.success} size={24} />
          </View>
          <Text style={styles.statNumber}>{stats.averageWeight.toFixed(1)} kg</Text>
          <Text style={styles.statLabel}>Average Weight</Text>
        </Card>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <Text style={styles.sectionDescription}>
          Submit waste collection forms and track your vehicle location.
        </Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Text style={styles.sectionDescription}>
          Your recent waste submissions will appear here.
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
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.gray900,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray600,
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
    padding: spacing.lg,
  },
  statIconContainer: {
    marginBottom: spacing.sm,
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
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.gray600,
    lineHeight: 20,
  },
});