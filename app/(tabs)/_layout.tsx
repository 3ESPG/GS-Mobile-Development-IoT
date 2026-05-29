// app/(tabs)/_layout.tsx
// Navegação por abas do app

import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Colors } from '@/context/theme';

type IconName = keyof typeof Ionicons.glyphMap;

function TabIcon({
  name,
  focused,
  color,
  badge,
}: {
  name: IconName;
  focused: boolean;
  color: string;
  badge?: number;
}) {
  return (
    <View style={styles.iconWrapper}>
      <Ionicons name={name} size={22} color={color} />
      {badge && badge > 0 ? (
        <View style={styles.badge}>
        </View>
      ) : null}
    </View>
  );
}

export default function TabLayout() {
  const { theme, unreadAlerts } = useApp();
  const colors = Colors[theme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 6,
          paddingTop: 6,
          height: 62,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="farms"
        options={{
          title: 'Fazendas',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'leaf' : 'leaf-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name={focused ? 'notifications' : 'notifications-outline'}
              focused={focused}
              color={color}
              badge={unreadAlerts}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'stats-chart' : 'stats-chart-outline'} focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#ef5350',
    borderRadius: 6,
    width: 10,
    height: 10,
  },
});
