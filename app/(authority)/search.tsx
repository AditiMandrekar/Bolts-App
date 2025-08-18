import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Colors, spacing } from '@/constants/Colors';
import { Search, MapPin, Users } from 'lucide-react-native';

interface Colony {
  id: string;
  name: string;
  address: string;
  manager: string;
  buildings: number;
  residents: number;
}

export default function SearchColoniesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [colonies] = useState<Colony[]>([
    {
      id: '1',
      name: 'Green Valley Colony',
      address: 'Sector 12, New Delhi',
      manager: 'Amit Patel',
      buildings: 15,
      residents: 450,
    },
    {
      id: '2',
      name: 'Sunrise Apartments',
      address: 'Phase 2, Gurgaon',
      manager: 'Neha Singh',
      buildings: 8,
      residents: 320,
    },
    {
      id: '3',
      name: 'Palm Grove Society',
      address: 'Sector 45, Noida',
      manager: 'Ravi Kumar',
      buildings: 12,
      residents: 380,
    },
    {
      id: '4',
      name: 'Rose Garden Complex',
      address: 'Block C, Faridabad',
      manager: 'Priya Sharma',
      buildings: 20,
      residents: 600,
    },
  ]);

  const filteredColonies = colonies.filter(colony =>
    colony.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    colony.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    colony.manager.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderColonyItem = ({ item }: { item: Colony }) => (
    <Card style={styles.colonyCard}>
      <View style={styles.colonyHeader}>
        <Text style={styles.colonyName}>{item.name}</Text>
        <View style={styles.colonyStats}>
          <Text style={styles.statText}>{item.buildings} buildings</Text>
        </View>
      </View>
      
      <View style={styles.colonyInfo}>
        <MapPin color={Colors.gray400} size={16} />
        <Text style={styles.colonyAddress}>{item.address}</Text>
      </View>
      
      <View style={styles.colonyFooter}>
        <View style={styles.managerInfo}>
          <Users color={Colors.gray400} size={16} />
          <Text style={styles.managerText}>Manager: {item.manager}</Text>
        </View>
        <Text style={styles.residentsText}>{item.residents} residents</Text>
      </View>
    </Card>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Colonies</Text>
        <Text style={styles.subtitle}>Find and manage colony information</Text>
      </View>

      <Card style={styles.searchCard}>
        <View style={styles.searchContainer}>
          <Search color={Colors.gray400} size={20} />
          <Input
            label=""
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by colony name, address, or manager..."
          />
        </View>
      </Card>

      <Text style={styles.resultsTitle}>
        {searchQuery ? `Results for "${searchQuery}"` : 'All Colonies'} ({filteredColonies.length})
      </Text>

      <FlatList
        data={filteredColonies}
        renderItem={renderColonyItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      />
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
  searchCard: {
    padding: spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  colonyCard: {
    marginBottom: 0,
  },
  colonyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  colonyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.gray900,
    flex: 1,
  },
  colonyStats: {
    alignItems: 'flex-end',
  },
  statText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  colonyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  colonyAddress: {
    fontSize: 14,
    color: Colors.gray600,
    flex: 1,
  },
  colonyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  managerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  managerText: {
    fontSize: 14,
    color: Colors.gray700,
  },
  residentsText: {
    fontSize: 12,
    color: Colors.gray500,
    fontWeight: '600',
  },
});