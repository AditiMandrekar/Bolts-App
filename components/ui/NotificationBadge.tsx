import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface NotificationBadgeProps {
  count: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function NotificationBadge({ count, size = 'md', color = Colors.error }: NotificationBadgeProps) {
  if (count === 0) return null;

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <View style={[styles.badge, styles[size], { backgroundColor: color }]}>
      <Text style={[styles.text, styles[`${size}Text`]]}>
        {displayCount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -8,
    right: -8,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  sm: {
    height: 16,
    paddingHorizontal: 4,
    minWidth: 16,
  },
  md: {
    height: 20,
    paddingHorizontal: 6,
    minWidth: 20,
  },
  lg: {
    height: 24,
    paddingHorizontal: 8,
    minWidth: 24,
  },
  text: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  smText: {
    fontSize: 10,
  },
  mdText: {
    fontSize: 12,
  },
  lgText: {
    fontSize: 14,
  },
});