import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, spacing } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { Download, Calendar } from 'lucide-react-native';

export default function ExportDataScreen() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const generateCSV = (data: any[]) => {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    );

    return [headers, ...rows].join('\n');
  };

  const exportData = async () => {
    if (!startDate || !endDate) {
      Alert.alert('Error', 'Please select both start and end dates');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('waste_submissions')
        .select(`
          date_time,
          waste_type,
          weight,
          colony_name,
          garbage_collector_profiles!inner(personal_name, employee_id)
        `)
        .gte('date_time', startDate)
        .lte('date_time', endDate)
        .order('date_time', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        Alert.alert('No Data', 'No waste submissions found for the selected date range');
        return;
      }

      const formattedData = data.map(item => ({
        Date: new Date(item.date_time).toLocaleDateString(),
        Time: new Date(item.date_time).toLocaleTimeString(),
        'Waste Type': item.waste_type,
        'Weight (kg)': item.weight,
        'Colony Name': item.colony_name,
        'Collector Name': item.garbage_collector_profiles?.personal_name || 'Unknown',
        'Employee ID': item.garbage_collector_profiles?.employee_id || 'N/A',
      }));

      const csvContent = generateCSV(formattedData);
      
      // In a real app, you would save this to device storage or share it
      Alert.alert(
        'Export Ready', 
        `Successfully exported ${formattedData.length} records. In a production app, this would be saved to your device.`
      );
      
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Export Data</Text>
        <Text style={styles.subtitle}>Download waste collection reports</Text>
      </View>

      <Card>
        <View style={styles.iconContainer}>
          <Download color={Colors.secondary} size={32} />
        </View>
        
        <Text style={styles.cardTitle}>Export Waste Data</Text>
        <Text style={styles.cardDescription}>
          Generate CSV reports of waste collection data for specified date ranges.
        </Text>

        <Input
          label="Start Date"
          value={startDate}
          onChangeText={setStartDate}
          placeholder="YYYY-MM-DD"
        />

        <Input
          label="End Date"
          value={endDate}
          onChangeText={setEndDate}
          placeholder="YYYY-MM-DD"
        />

        <Button
          title="Export to CSV"
          onPress={exportData}
          loading={loading}
          size="lg"
        />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Export Options</Text>
        <View style={styles.optionsList}>
          <View style={styles.optionItem}>
            <Calendar color={Colors.primary} size={20} />
            <Text style={styles.optionText}>Custom date range selection</Text>
          </View>
          <View style={styles.optionItem}>
            <Download color={Colors.secondary} size={20} />
            <Text style={styles.optionText}>CSV format for easy analysis</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Data Included</Text>
        <Text style={styles.description}>
          Exported files include: Date & Time, Waste Type, Weight, Colony Name, 
          Collector Name, Employee ID, and submission timestamps.
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
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.gray900,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray600,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.gray600,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: spacing.md,
  },
  optionsList: {
    gap: spacing.md,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  optionText: {
    fontSize: 16,
    color: Colors.gray700,
  },
  description: {
    fontSize: 14,
    color: Colors.gray600,
    lineHeight: 20,
  },
});