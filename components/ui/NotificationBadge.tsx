import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface NotificationBadgeProps {
  count: number;
  size?: 'sm' | 'md';
}

export function NotificationBadge({ count, size = 'md' }: NotificationBadgeProps) {
  if (count === 0) return null;

  return (
    <View style={[styles.badge, styles[size]]}>
      <Text style={[styles.text, styles[`${size}Text`]]}>
        {count > 99 ? '99+' : count.toString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -8,
    right: -8,
  },
  sm: {
    height: 16,
    paddingHorizontal: 6,
  },
  md: {
    height: 20,
    paddingHorizontal: 8,
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
});