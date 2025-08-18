import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (!user) {
        router.replace('/(auth)/welcome');
      } else if (role) {
        switch (role) {
          case 'garbage_collector':
            router.replace('/(collector)');
            break;
          case 'colony_manager':
            router.replace('/(manager)');
            break;
          case 'government_authority':
            router.replace('/(authority)');
            break;
          default:
            router.replace('/(auth)/welcome');
        }
      }
    }
  }, [user, role, authLoading, roleLoading]);

  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
  },
  loadingText: {
    fontSize: 18,
    color: Colors.gray600,
  },
});