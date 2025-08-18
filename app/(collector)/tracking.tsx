import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Colors, spacing } from '@/constants/Colors';
import { MapPin, Clock, Activity } from 'lucide-react-native';

export default function VehicleTrackingScreen() {
  const [trackingData, setTrackingData] = useState({
    currentLocation: 'Green Valley Colony, Sector 12',
    lastUpdated: new Date().toLocaleTimeString(),
    status: 'Active',
    todayDistance: '24.5 km',
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Vehicle Tracking</Text>
        <Text style={styles.subtitle}>Real-time location and status</Text>
      </View>

      <Card>
        <View style={styles.statusHeader}>
          <View style={styles.statusIndicator}>
            <Activity color={Colors.success} size={20} />
            <Text style={styles.statusText}>Vehicle Active</Text>
          </View>
        </View>

        <View style={styles.trackingInfo}>
          <View style={styles.infoRow}>
            <MapPin color={Colors.primary} size={20} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Current Location</Text>
              <Text style={styles.infoValue}>{trackingData.currentLocation}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Clock color={Colors.secondary} size={20} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Last Updated</Text>
              <Text style={styles.infoValue}>{trackingData.lastUpdated}</Text>
            </View>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Today's Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Distance Covered:</Text>
          <Text style={styles.summaryValue}>{trackingData.todayDistance}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Collection Points:</Text>
          <Text style={styles.summaryValue}>12 locations</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Status:</Text>
          <Text style={[styles.summaryValue, styles.activeStatus]}>
            {trackingData.status}
          </Text>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Location History</Text>
        <Text style={styles.description}>
          Your vehicle location is tracked for safety and efficiency. Location data helps 
          optimize collection routes and ensures accountability.
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
  statusHeader: {
    marginBottom: spacing.lg,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.success,
  },
  trackingInfo: {
    gap: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.gray600,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.gray900,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.gray600,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray900,
  },
  activeStatus: {
    color: Colors.success,
  },
  description: {
    fontSize: 14,
    color: Colors.gray600,
    lineHeight: 20,
  },
});