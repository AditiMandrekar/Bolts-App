import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Colors, spacing } from '@/constants/Colors';
import { LogOut } from 'lucide-react-native';

export default function ManagerProfileScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState({
    personal_name: '',
    contact_number: '',
    email: '',
    colony_name: '',
    colony_address: '',
    ward_number: '',
    zone_number: '',
    president_name: '',
    president_contact: '',
    president_email: '',
    secretary_name: '',
    secretary_contact: '',
    secretary_email: '',
    number_of_buildings: '',
    occupied_residential_units: '',
    unoccupied_residential_units: '',
    offices: '',
    shops: '',
    eateries: '',
  });
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('colony_manager_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setProfile({
          personal_name: data.personal_name || '',
          contact_number: data.contact_number || '',
          email: data.email || user?.email || '',
          colony_name: data.colony_name || '',
          colony_address: data.colony_address || '',
          ward_number: data.ward_number || '',
          zone_number: data.zone_number || '',
          president_name: data.president_name || '',
          president_contact: data.president_contact || '',
          president_email: data.president_email || '',
          secretary_name: data.secretary_name || '',
          secretary_contact: data.secretary_contact || '',
          secretary_email: data.secretary_email || '',
          number_of_buildings: data.number_of_buildings?.toString() || '',
          occupied_residential_units: data.occupied_residential_units?.toString() || '',
          unoccupied_residential_units: data.unoccupied_residential_units?.toString() || '',
          offices: data.offices?.toString() || '',
          shops: data.shops?.toString() || '',
          eateries: data.eateries?.toString() || '',
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setSaveLoading(true);
    try {
      const profileData = {
        user_id: user?.id,
        personal_name: profile.personal_name,
        contact_number: profile.contact_number,
        email: profile.email,
        colony_name: profile.colony_name,
        colony_address: profile.colony_address,
        ward_number: profile.ward_number,
        zone_number: profile.zone_number,
        president_name: profile.president_name,
        president_contact: profile.president_contact,
        president_email: profile.president_email,
        secretary_name: profile.secretary_name,
        secretary_contact: profile.secretary_contact,
        secretary_email: profile.secretary_email,
        number_of_buildings: Number(profile.number_of_buildings) || 0,
        occupied_residential_units: Number(profile.occupied_residential_units) || 0,
        unoccupied_residential_units: Number(profile.unoccupied_residential_units) || 0,
        offices: Number(profile.offices) || 0,
        shops: Number(profile.shops) || 0,
        eateries: Number(profile.eateries) || 0,
      };

      const { error } = await supabase
        .from('colony_manager_profiles')
        .upsert(profileData);

      if (error) throw error;

      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/welcome');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
          <LogOut color={Colors.error} size={20} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <Input
          label="Personal Name"
          value={profile.personal_name}
          onChangeText={(text) => setProfile(prev => ({ ...prev, personal_name: text }))}
          placeholder="Enter your full name"
        />

        <Input
          label="Contact Number"
          value={profile.contact_number}
          onChangeText={(text) => setProfile(prev => ({ ...prev, contact_number: text }))}
          placeholder="Enter contact number"
          keyboardType="phone-pad"
        />

        <Input
          label="Email"
          value={profile.email}
          onChangeText={(text) => setProfile(prev => ({ ...prev, email: text }))}
          placeholder="Enter email address"
          keyboardType="email-address"
        />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Colony Information</Text>
        
        <Input
          label="Colony Name"
          value={profile.colony_name}
          onChangeText={(text) => setProfile(prev => ({ ...prev, colony_name: text }))}
          placeholder="Enter colony name"
        />

        <Input
          label="Colony Address"
          value={profile.colony_address}
          onChangeText={(text) => setProfile(prev => ({ ...prev, colony_address: text }))}
          placeholder="Enter complete address"
          multiline
          numberOfLines={3}
        />

        <Input
          label="Ward Number"
          value={profile.ward_number}
          onChangeText={(text) => setProfile(prev => ({ ...prev, ward_number: text }))}
          placeholder="Enter ward number"
        />

        <Input
          label="Zone Number"
          value={profile.zone_number}
          onChangeText={(text) => setProfile(prev => ({ ...prev, zone_number: text }))}
          placeholder="Enter zone number"
        />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Society Officials</Text>
        
        <Text style={styles.subsectionTitle}>President Details</Text>
        <Input
          label="President Name"
          value={profile.president_name}
          onChangeText={(text) => setProfile(prev => ({ ...prev, president_name: text }))}
          placeholder="Enter president name"
        />

        <Input
          label="President Contact"
          value={profile.president_contact}
          onChangeText={(text) => setProfile(prev => ({ ...prev, president_contact: text }))}
          placeholder="Enter president contact"
          keyboardType="phone-pad"
        />

        <Input
          label="President Email"
          value={profile.president_email}
          onChangeText={(text) => setProfile(prev => ({ ...prev, president_email: text }))}
          placeholder="Enter president email"
          keyboardType="email-address"
        />

        <Text style={styles.subsectionTitle}>Secretary Details</Text>
        <Input
          label="Secretary Name"
          value={profile.secretary_name}
          onChangeText={(text) => setProfile(prev => ({ ...prev, secretary_name: text }))}
          placeholder="Enter secretary name"
        />

        <Input
          label="Secretary Contact"
          value={profile.secretary_contact}
          onChangeText={(text) => setProfile(prev => ({ ...prev, secretary_contact: text }))}
          placeholder="Enter secretary contact"
          keyboardType="phone-pad"
        />

        <Input
          label="Secretary Email"
          value={profile.secretary_email}
          onChangeText={(text) => setProfile(prev => ({ ...prev, secretary_email: text }))}
          placeholder="Enter secretary email"
          keyboardType="email-address"
        />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Infrastructure Details</Text>
        
        <Input
          label="Number of Buildings"
          value={profile.number_of_buildings}
          onChangeText={(text) => setProfile(prev => ({ ...prev, number_of_buildings: text }))}
          placeholder="Enter number of buildings"
          keyboardType="numeric"
        />

        <Input
          label="Occupied Residential Units"
          value={profile.occupied_residential_units}
          onChangeText={(text) => setProfile(prev => ({ ...prev, occupied_residential_units: text }))}
          placeholder="Enter occupied units"
          keyboardType="numeric"
        />

        <Input
          label="Unoccupied Residential Units"
          value={profile.unoccupied_residential_units}
          onChangeText={(text) => setProfile(prev => ({ ...prev, unoccupied_residential_units: text }))}
          placeholder="Enter unoccupied units"
          keyboardType="numeric"
        />

        <Input
          label="Offices"
          value={profile.offices}
          onChangeText={(text) => setProfile(prev => ({ ...prev, offices: text }))}
          placeholder="Enter number of offices"
          keyboardType="numeric"
        />

        <Input
          label="Shops"
          value={profile.shops}
          onChangeText={(text) => setProfile(prev => ({ ...prev, shops: text }))}
          placeholder="Enter number of shops"
          keyboardType="numeric"
        />

        <Input
          label="Eateries"
          value={profile.eateries}
          onChangeText={(text) => setProfile(prev => ({ ...prev, eateries: text }))}
          placeholder="Enter number of eateries"
          keyboardType="numeric"
        />

        <Button
          title="Save Profile"
          onPress={saveProfile}
          loading={saveLoading}
          size="lg"
        />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.gray900,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: spacing.md,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
});