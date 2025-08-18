import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Colors, spacing } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { Package, TrendingUp, Users, Calendar } from 'lucide-react-native';

interface WasteSubmission {
  id: string;
  date_time: string;
  waste_type: string;
  weight: number;
  colony_name: string;
  collector_name: string;
}

export default function ManagerDashboard() {
  const [submissions, setSubmissions] = useState<WasteSubmission[]>([]);
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    totalWeight: 0,
    uniqueCollectors: 0,
    todaySubmissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch waste submissions with collector names
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('waste_submissions')
        .select(`
          *,
          garbage_collector_profiles!inner(personal_name)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (submissionsError) throw submissionsError;

      const formattedSubmissions = submissionsData?.map(submission => ({
        id: submission.id,
        date_time: submission.date_time,
        waste_type: submission.waste_type,
        weight: submission.weight,
        colony_name: submission.colony_name,
        collector_name: submission.garbage_collector_profiles?.personal_name || 'Unknown',
      })) || [];

      setSubmissions(formattedSubmissions);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todaySubmissions = formattedSubmissions.filter(
        sub => sub.date_time.startsWith(today)
      ).length;

      const totalWeight = formattedSubmissions.reduce((sum, sub) => sum + sub.weight, 0);
      const uniqueCollectors = new Set(formattedSubmissions.map(sub => sub.collector_name)).size;

      setStats({
        totalSubmissions: formattedSubmissions.length,
        totalWeight,
        uniqueCollectors,
        todaySubmissions,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSubmissionItem = ({ item }: { item: WasteSubmission }) => (
    <Card style={styles.submissionCard}>
      <View style={styles.submissionHeader}>
        <Text style={styles.submissionColony}>{item.colony_name}</Text>
        <Text style={styles.submissionDate}>
          {new Date(item.date_time).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.submissionType}>{item.waste_type}</Text>
      <View style={styles.submissionFooter}>
        <Text style={styles.submissionWeight}>{item.weight} kg</Text>
        <Text style={styles.submissionCollector}>by {item.collector_name}</Text>
      </View>
    </Card>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Manager Dashboard</Text>
        <Text style={styles.subtitle}>Colony waste management overview</Text>
      </View>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Package color={Colors.primary} size={24} />
          <Text style={styles.statNumber}>{stats.totalSubmissions}</Text>
          <Text style={styles.statLabel}>Total Submissions</Text>
        </Card>

        <Card style={styles.statCard}>
          <TrendingUp color={Colors.secondary} size={24} />
          <Text style={styles.statNumber}>{stats.totalWeight.toFixed(1)} kg</Text>
          <Text style={styles.statLabel}>Total Weight</Text>
        </Card>

        <Card style={styles.statCard}>
          <Users color={Colors.accent} size={24} />
          <Text style={styles.statNumber}>{stats.uniqueCollectors}</Text>
          <Text style={styles.statLabel}>Active Collectors</Text>
        </Card>

        <Card style={styles.statCard}>
          <Calendar color={Colors.success} size={24} />
          <Text style={styles.statNumber}>{stats.todaySubmissions}</Text>
          <Text style={styles.statLabel}>Today's Submissions</Text>
        </Card>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Recent Submissions</Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading submissions...</Text>
        ) : (
          <FlatList
            data={submissions}
            renderItem={renderSubmissionItem}
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
  loadingText: {
    textAlign: 'center',
    color: Colors.gray600,
    fontSize: 16,
  },
  submissionCard: {
    padding: spacing.md,
    marginBottom: 0,
  },
  submissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  submissionColony: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray900,
  },
  submissionDate: {
    fontSize: 12,
    color: Colors.gray500,
  },
  submissionType: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  submissionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submissionWeight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.gray900,
  },
  submissionCollector: {
    fontSize: 12,
    color: Colors.gray600,
  },
});