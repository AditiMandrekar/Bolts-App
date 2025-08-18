import { Tabs } from 'expo-router';
import { Truck, User, FileText, MapPin } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function CollectorTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray400,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.gray200,
          paddingTop: 8,
          paddingBottom: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => (
            <Truck size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="waste-form"
        options={{
          title: 'Submit Waste',
          tabBarIcon: ({ size, color }) => (
            <FileText size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          title: 'Vehicle Tracking',
          tabBarIcon: ({ size, color }) => (
            <MapPin size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}