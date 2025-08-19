import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Colors, spacing } from '@/constants/Colors';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  overlay?: boolean;
}

export function LoadingSpinner({ 
  size = 'large', 
  color = Colors.primary, 
  text,
  overlay = false 
}: LoadingSpinnerProps) {
  const content = (
    <View style={[styles.container, overlay && styles.overlay]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );

  return content;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1000,
  },
  text: {
    marginTop: spacing.md,
    fontSize: 16,
    color: Colors.gray600,
    textAlign: 'center',
  },
});