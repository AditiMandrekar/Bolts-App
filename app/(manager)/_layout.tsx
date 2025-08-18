import { Tabs } from 'expo-router';
import { ChartBar as BarChart3, Download, Users, MapPin } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function ManagerTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.secondary,
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
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="export"
        options={{
          title: 'Export Data',
          tabBarIcon: ({ size, color }) => (
            <Download size={size} color={color} />
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
            <Users size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}