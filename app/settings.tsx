// app/settings.tsx
// Configurações do app: tema, usuário e preferências

import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Colors, Spacing, BorderRadius, Typography } from '@/context/theme';
import { ScreenHeader, InputField, Button } from '@/components/ui';

const SETTINGS_KEYS = {
  notifications: '@agrosat_notifications_enabled',
  autoRefresh: '@agrosat_auto_refresh',
};

export default function SettingsScreen() {
  const { theme, toggleTheme, userName, setUserName } = useApp();
  const colors = Colors[theme];
  const router = useRouter();

  const [nameInput, setNameInput] = useState(userName);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    async function loadPreferences() {
      const [storedNotifications, storedAutoRefresh] = await Promise.all([
        AsyncStorage.getItem(SETTINGS_KEYS.notifications),
        AsyncStorage.getItem(SETTINGS_KEYS.autoRefresh),
      ]);

      if (storedNotifications !== null) setNotificationsEnabled(storedNotifications === 'true');
      if (storedAutoRefresh !== null) setAutoRefresh(storedAutoRefresh === 'true');
    }

    loadPreferences();
  }, []);

  async function toggleNotifications() {
    const next = !notificationsEnabled;
    setNotificationsEnabled(next);
    await AsyncStorage.setItem(SETTINGS_KEYS.notifications, String(next));
  }

  async function toggleAutoRefresh() {
    const next = !autoRefresh;
    setAutoRefresh(next);
    await AsyncStorage.setItem(SETTINGS_KEYS.autoRefresh, String(next));
  }

  function handleSaveName() {
    if (!nameInput.trim() || nameInput.trim().length < 2) {
      setNameError('Nome deve ter pelo menos 2 caracteres');
      return;
    }
    setNameError('');
    setUserName(nameInput.trim());
    Alert.alert('✅ Salvo!', 'Seu nome foi atualizado com sucesso.');
  }

  const settingsItems = [
    {
      group: 'Conta',
      items: [
        {
          icon: 'person-outline' as const,
          label: 'Produtor / Usuário',
          desc: userName || 'Não definido',
          type: 'info' as const,
        },
      ],
    },
    {
      group: 'Preferências',
      items: [
        {
          icon: 'moon-outline' as const,
          label: 'Modo Escuro',
          desc: theme === 'dark' ? 'Ativado' : 'Desativado',
          type: 'toggle' as const,
          value: theme === 'dark',
          onToggle: toggleTheme,
        },
        {
          icon: 'notifications-outline' as const,
          label: 'Notificações de Alerta',
          desc: 'Receber alertas críticos',
          type: 'toggle' as const,
          value: notificationsEnabled,
          onToggle: toggleNotifications,
        },
        {
          icon: 'refresh-outline' as const,
          label: 'Atualização Automática',
          desc: 'Sincronizar dados a cada 30 min',
          type: 'toggle' as const,
          value: autoRefresh,
          onToggle: toggleAutoRefresh,
        },
      ],
    },
    {
      group: 'Sobre',
      items: [
        {
          icon: 'planet-outline' as const,
          label: 'AgroSat AI',
          desc: 'Versão 1.0.0 — Global Solution 2026.1',
          type: 'info' as const,
        },
        {
          icon: 'school-outline' as const,
          label: 'FIAP — Engenharia de Software',
          desc: 'Mobile Development & IoT • Prof. Hercules Ramos',
          type: 'info' as const,
        },
        {
          icon: 'code-slash-outline' as const,
          label: 'Stack',
          desc: 'React Native + Expo + TypeScript',
          type: 'info' as const,
        },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Configurações" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Nome do usuário */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>👤 Seu Perfil</Text>
        <InputField
          label="Seu Nome"
          value={nameInput}
          onChangeText={setNameInput}
          placeholder="Ex: João Mendes"
          error={nameError}
          icon="person-outline"
          autoCapitalize="words"
        />
        <Button
          label="Salvar Nome"
          onPress={handleSaveName}
          variant="primary"
          icon="checkmark-outline"
          style={{ marginBottom: Spacing.lg }}
        />

        {/* Grupos de configurações */}
        {settingsItems.map((group) => (
          <View key={group.group}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{group.group}</Text>
            <View style={[styles.settingsGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {group.items.map((item, i) => (
                <View
                  key={i}
                  style={[
                    styles.settingsRow,
                    i < group.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                  ]}
                >
                  <View style={[styles.settingsIcon, { backgroundColor: colors.primary + '18' }]}>
                    <Ionicons name={item.icon} size={18} color={colors.primary} />
                  </View>
                  <View style={styles.settingsInfo}>
                    <Text style={[styles.settingsLabel, { color: colors.textPrimary }]}>{item.label}</Text>
                    <Text style={[styles.settingsDesc, { color: colors.textMuted }]}>{item.desc}</Text>
                  </View>
                  {item.type === 'toggle' && (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: colors.border, true: colors.primary + '88' }}
                      thumbColor={item.value ? colors.primary : colors.textMuted}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Fontes de dados */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>🛰 Fontes de Dados</Text>
        <View style={[styles.dataSourceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {[
            { icon: '🌍', label: 'INPE CBERS-4A', desc: 'Imagens multiespectrais do Brasil' },
            { icon: '🔥', label: 'NASA FIRMS', desc: 'Monitoramento de focos de calor' },
            { icon: '🌦', label: 'INMET', desc: 'Dados meteorológicos nacionais' },
            { icon: '📡', label: 'Sensores IoT', desc: 'Leituras locais de campo' },
          ].map((s, i) => (
            <View key={i} style={styles.dataRow}>
              <Text style={styles.dataIcon}>{s.icon}</Text>
              <View>
                <Text style={[styles.dataLabel, { color: colors.textPrimary }]}>{s.label}</Text>
                <Text style={[styles.dataDesc, { color: colors.textMuted }]}>{s.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.md, paddingBottom: 60 },

  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },

  settingsGroup: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsInfo: { flex: 1 },
  settingsLabel: { fontSize: Typography.fontSizes.md, fontWeight: '500' },
  settingsDesc: { fontSize: Typography.fontSizes.xs, marginTop: 2 },

  dataSourceCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    gap: 14,
    marginBottom: Spacing.lg,
  },
  dataRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dataIcon: { fontSize: 22 },
  dataLabel: { fontSize: Typography.fontSizes.sm, fontWeight: '600' },
  dataDesc: { fontSize: Typography.fontSizes.xs },
});
