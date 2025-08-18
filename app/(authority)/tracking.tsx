import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Colors, spacing } from '@/constants/Colors';
import { MapPin, Clock, Activity, Truck, Building } from 'lucide-react-native';

export default function AuthorityTrackingScreen() {
  const allVehicleData = [
    {
      id: '1',
      vehicleNumber: 'GC-001',
      collectorName: 'Rajesh Kumar',
      currentLocation: 'Green Valley Colony, Block A',
      lastUpdated: '2 mins ago',
      status: 'Active',
      colony: 'Green Valley Colony',
    },
    {
      id: '2',
      vehicleNumber: 'GC-002', 
      collectorName: 'Priya Sharma',
      currentLocation: 'Sunrise Apartments, Gate 2',
      lastUpdated: '5 mins ago',
      status: 'Active',
      colony: 'Sunrise Apartments',
    },
    {
      id: '3',
      vehicleNumber: 'GC-003',
      collectorName: 'Mohammed Ali',
      currentLocation: 'Palm Grove Society, Main Road',
      lastUpdated: '1 min ago',
      status: 'Active',
      colony: 'Palm Grove Society',
    },
    {
      id: '4',
      vehicleNumber: 'GC-004',
      collectorName: 'Sunita Devi',
      currentLocation: 'Rose Garden Complex, Tower B',
      lastUpdated: '8 mins ago',
      status: 'Inactive',
      colony: 'Rose Garden Complex',
    },
  ];

  const activeVehicles = allVehicleData.filter(v => v.status === 'Active').length;
  const totalVehicles = allVehicleData.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>System-wide Tracking</Text>
        <Text style={styles.subtitle}>Monitor all collection vehicles</Text>
      </View>

      <Card>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Truck color={Colors.primary} size={24} />
            <Text style={styles.summaryNumber}>{totalVehicles}</Text>
            <Text style={styles.summaryLabel}>Total Vehicles</Text>
          </View>
          <View style={styles.summaryItem}>
            <Activity color={Colors.success} size={24} />
            <Text style={styles.summaryNumber}>{activeVehicles}</Text>
            <Text style={styles.summaryLabel}>Active Now</Text>
          </View>
          <View style={styles.summaryItem}>
            <Building color={Colors.secondary} size={24} />
            <Text style={styles.summaryNumber}>4</Text>
            <Text style={styles.summaryLabel}>Colonies Covered</Text>
          </View>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>All Vehicles Status</Text>

      {allVehicleData.map((vehicle) => (
        <Card key={vehicle.id} style={styles.vehicleCard}>
          <View style={styles.vehicleHeader}>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleNumber}>{vehicle.vehicleNumber}</Text>
              <Text style={styles.collectorName}>{vehicle.collectorName}</Text>
              <Text style={styles.colonyName}>{vehicle.colony}</Text>
            </View>
            <View style={[
              styles.statusBadge, 
              vehicle.status === 'Active' ? styles.activeStatus : styles.inactiveStatus
            ]}>
              <Text style={styles.statusText}>{vehicle.status}</Text>
            </View>
          </View>

          <View style={styles.locationInfo}>
            <MapPin color={Colors.primary} size={16} />
            <Text style={styles.locationText}>{vehicle.currentLocation}</Text>
          </View>

          <View style={styles.timeInfo}>
            <Clock color={Colors.gray400} size={14} />
            <Text style={styles.timeText}>Last updated: {vehicle.lastUpdated}</Text>
          </View>
        </Card>
      ))}

      <Card>
        <Text style={styles.sectionTitle}>Tracking Overview</Text>
        <Text style={styles.description}>
          Monitor the real-time location and status of all waste collection vehicles 
          across the entire municipality. This centralized view helps ensure 
          efficient operations and accountability.
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.gray900,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.gray600,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: spacing.md,
  },
  vehicleCard: {
    marginBottom: spacing.md,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.gray900,
  },
  collectorName: {
    fontSize: 14,
    color: Colors.gray600,
    marginBottom: spacing.xs,
  },
  colonyName: {
    fontSize: 12,
    color: Colors.secondary,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  activeStatus: {
    backgroundColor: Colors.success,
  },
  inactiveStatus: {
    backgroundColor: Colors.gray400,
  },
  statusText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  locationText: {
    fontSize: 14,
    color: Colors.gray700,
    flex: 1,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  timeText: {
    fontSize: 12,
    color: Colors.gray500,
  },
  description: {
    fontSize: 14,
    color: Colors.gray600,
    lineHeight: 20,
  },
});