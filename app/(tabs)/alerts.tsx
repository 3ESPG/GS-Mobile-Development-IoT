// app/(tabs)/alerts.tsx
// Central de alertas com filtragem por nível

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Colors, Spacing, BorderRadius, Typography } from '@/context/theme';
import { AlertCard, ScreenHeader } from '@/components/ui';
import { AlertLevel } from '@/data/mockData';

type Filter = 'all' | AlertLevel;

export default function AlertsScreen() {
  const { theme, alerts, markAlertRead, farms } = useApp();
  const colors = Colors[theme];
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = alerts.filter((a) => filter === 'all' || a.level === filter);
  const sorted = [...filtered].sort((a, b) => {
    const order = { critical: 0, warning: 1, ok: 2 };
    if (a.read !== b.read) return a.read ? 1 : -1;
    return order[a.level] - order[b.level];
  });

  const filterOptions: { key: Filter; label: string; color: string }[] = [
    { key: 'all', label: 'Todos', color: colors.primary },
    { key: 'critical', label: '🔴 Crítico', color: colors.danger },
    { key: 'warning', label: '🟡 Atenção', color: colors.warning },
    { key: 'ok', label: '🟢 Normal', color: colors.success },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Central de Alertas"
        subtitle={`${alerts.filter((a) => !a.read).length} não lidos`}
      />

      {/* Filtros */}
      <View style={[styles.filterBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filterOptions.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              onPress={() => setFilter(opt.key)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: filter === opt.key ? opt.color + '22' : 'transparent',
                  borderColor: filter === opt.key ? opt.color : colors.border,
                },
              ]}
            >
              <Text style={[styles.filterText, { color: filter === opt.key ? opt.color : colors.textMuted }]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {sorted.length === 0 ? (
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>✅</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhum alerta nesta categoria</Text>
          </View>
        ) : (
          sorted.map((alert) => {
            const farm = farms.find((f) => f.id === alert.farmId);
            return (
              <View key={alert.id}>
                {farm && (
                  <Text style={[styles.farmLabel, { color: colors.textMuted }]}>📍 {farm.name}</Text>
                )}
                <AlertCard
                  title={alert.title}
                  description={alert.description}
                  level={alert.level}
                  timestamp={alert.timestamp}
                  read={alert.read}
                  onPress={() => {
                    markAlertRead(alert.id);
                    router.push(`/alert/${alert.id}`);
                  }}
                />
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterBar: { borderBottomWidth: 1, paddingVertical: 10 },
  filterScroll: { paddingHorizontal: Spacing.md, gap: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  filterText: { fontSize: Typography.fontSizes.sm, fontWeight: '600' },
  scroll: { padding: Spacing.md, paddingBottom: 80 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: Typography.fontSizes.md },
  farmLabel: { fontSize: Typography.fontSizes.xs, marginBottom: 4, marginLeft: 4 },
});
