// app/_layout.tsx
// Layout raiz: configura Provider global e pilha de navegação

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from '@/context/AppContext';
import { View } from 'react-native';
import { Colors } from '@/context/theme';

function RootNavigator() {
  const { theme } = useApp();
  const colors = Colors[theme];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="farm/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="alert/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="add-farm" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}
