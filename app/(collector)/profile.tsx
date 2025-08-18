import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Picker } from '@/components/ui/Picker';
import { Card } from '@/components/ui/Card';
import { Colors, spacing } from '@/constants/Colors';
import { WORKING_STATUS_OPTIONS, SHIFT_TIMINGS } from '@/constants/WasteTypes';
import { Camera, LogOut } from 'lucide-react-native';

export default function CollectorProfileScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState({
    personal_name: '',
    employee_id: '',
    contact_number: '',
    years_of_experience: '',
    complete_address: '',
    assigned_areas: '',
    shift_timing: '',
    vehicle_number: '',
    supervisor_name: '',
    working_status: '',
    daily_task_counter: '',
    profile_picture: '',
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
        .from('garbage_collector_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setProfile({
          personal_name: data.personal_name || '',
          employee_id: data.employee_id || '',
          contact_number: data.contact_number || '',
          years_of_experience: data.years_of_experience?.toString() || '',
          complete_address: data.complete_address || '',
          assigned_areas: data.assigned_areas?.join(', ') || '',
          shift_timing: data.shift_timing || '',
          vehicle_number: data.vehicle_number || '',
          supervisor_name: data.supervisor_name || '',
          working_status: data.working_status || '',
          daily_task_counter: data.daily_task_counter?.toString() || '',
          profile_picture: data.profile_picture || '',
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfile(prev => ({ ...prev, profile_picture: result.assets[0].uri }));
    }
  };

  const saveProfile = async () => {
    setSaveLoading(true);
    try {
      const profileData = {
        user_id: user?.id,
        personal_name: profile.personal_name,
        employee_id: profile.employee_id,
        contact_number: profile.contact_number,
        years_of_experience: Number(profile.years_of_experience) || 0,
        complete_address: profile.complete_address,
        assigned_areas: profile.assigned_areas.split(',').map(area => area.trim()),
        shift_timing: profile.shift_timing,
        vehicle_number: profile.vehicle_number,
        supervisor_name: profile.supervisor_name,
        working_status: profile.working_status,
        daily_task_counter: Number(profile.daily_task_counter) || 0,
        profile_picture: profile.profile_picture,
      };

      const { error } = await supabase
        .from('garbage_collector_profiles')
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
        <View style={styles.profilePictureSection}>
          <TouchableOpacity onPress={pickImage} style={styles.profilePictureContainer}>
            {profile.profile_picture ? (
              <Image source={{ uri: profile.profile_picture }} style={styles.profilePicture} />
            ) : (
              <View style={styles.placeholderPicture}>
                <Camera color={Colors.gray400} size={32} />
                <Text style={styles.placeholderText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Input
          label="Personal Name"
          value={profile.personal_name}
          onChangeText={(text) => setProfile(prev => ({ ...prev, personal_name: text }))}
          placeholder="Enter your full name"
        />

        <Input
          label="Employee ID"
          value={profile.employee_id}
          onChangeText={(text) => setProfile(prev => ({ ...prev, employee_id: text }))}
          placeholder="Enter employee ID"
        />

        <Input
          label="Contact Number"
          value={profile.contact_number}
          onChangeText={(text) => setProfile(prev => ({ ...prev, contact_number: text }))}
          placeholder="Enter contact number"
          keyboardType="phone-pad"
        />

        <Input
          label="Years of Experience"
          value={profile.years_of_experience}
          onChangeText={(text) => setProfile(prev => ({ ...prev, years_of_experience: text }))}
          placeholder="Enter years of experience"
          keyboardType="numeric"
        />

        <Input
          label="Complete Address"
          value={profile.complete_address}
          onChangeText={(text) => setProfile(prev => ({ ...prev, complete_address: text }))}
          placeholder="Enter your complete address"
          multiline
          numberOfLines={3}
        />

        <Input
          label="Assigned Areas"
          value={profile.assigned_areas}
          onChangeText={(text) => setProfile(prev => ({ ...prev, assigned_areas: text }))}
          placeholder="Enter assigned areas (comma separated)"
          multiline
          numberOfLines={2}
        />

        <Picker
          label="Shift Timing"
          value={profile.shift_timing}
          onValueChange={(value) => setProfile(prev => ({ ...prev, shift_timing: value }))}
          options={SHIFT_TIMINGS.map(shift => ({ label: shift, value: shift }))}
          placeholder="Select shift timing"
        />

        <Input
          label="Vehicle Number"
          value={profile.vehicle_number}
          onChangeText={(text) => setProfile(prev => ({ ...prev, vehicle_number: text }))}
          placeholder="Enter vehicle number"
        />

        <Input
          label="Supervisor Name"
          value={profile.supervisor_name}
          onChangeText={(text) => setProfile(prev => ({ ...prev, supervisor_name: text }))}
          placeholder="Enter supervisor name"
        />

        <Picker
          label="Working Status"
          value={profile.working_status}
          onValueChange={(value) => setProfile(prev => ({ ...prev, working_status: value }))}
          options={WORKING_STATUS_OPTIONS.map(status => ({ label: status, value: status }))}
          placeholder="Select working status"
        />

        <Input
          label="Daily Task Counter"
          value={profile.daily_task_counter}
          onChangeText={(text) => setProfile(prev => ({ ...prev, daily_task_counter: text }))}
          placeholder="Enter daily task count"
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
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  profilePictureContainer: {
    alignItems: 'center',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderPicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.gray300,
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: Colors.gray400,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});