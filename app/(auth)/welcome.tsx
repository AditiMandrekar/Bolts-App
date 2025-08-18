import { View, Text, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Colors, spacing } from '@/constants/Colors';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/3735747/pexels-photo-3735747.jpeg' }}
          style={styles.image}
        />
        <Text style={styles.title}>WasteTrack</Text>
        <Text style={styles.subtitle}>Efficient Waste Management System</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Join our comprehensive waste management platform. Choose your role to get started.
        </Text>

        <View style={styles.buttonContainer}>
          <Link href="/(auth)/collector-auth" asChild>
            <Button title="Garbage Collector" size="lg" />
          </Link>
          
          <Link href="/(auth)/manager-auth" asChild>
            <Button title="Colony Manager" variant="secondary" size="lg" />
          </Link>
          
          <Link href="/(auth)/authority-auth" asChild>
            <Button title="Government Authority" variant="outline" size="lg" />
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.gray600,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  description: {
    fontSize: 16,
    color: Colors.gray700,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  buttonContainer: {
    gap: spacing.md,
  },
});