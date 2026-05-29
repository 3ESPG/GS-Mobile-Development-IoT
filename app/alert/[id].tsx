// app/alert/[id].tsx
// Detalhe completo de um alerta com recomendações

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Colors, Spacing, BorderRadius, Typography } from '@/context/theme';
import { ScreenHeader, Button } from '@/components/ui';

export default function AlertDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, alerts, farms, markAlertRead } = useApp();
  const colors = Colors[theme];
  const router = useRouter();

  const alert = alerts.find((a) => a.id === id);
  const farm = farms.find((f) => f.id === alert?.farmId);

  useEffect(() => {
    if (alert && !alert.read) markAlertRead(alert.id);
  }, [alert?.id]);

  if (!alert) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScreenHeader title="Alerta não encontrado" onBack={() => router.back()} />
      </View>
    );
  }

  const levelColor =
    alert.level === 'critical' ? colors.danger : alert.level === 'warning' ? colors.warning : colors.success;
  const levelLabel =
    alert.level === 'critical' ? 'CRÍTICO' : alert.level === 'warning' ? 'ATENÇÃO' : 'NORMAL';

  const date = new Date(alert.timestamp);
  const dateStr = date.toLocaleString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit',
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Detalhe do Alerta" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Badge de nível */}
        <View style={[styles.levelBanner, { backgroundColor: levelColor + '18', borderColor: levelColor + '44' }]}>
          <Ionicons
            name={alert.level === 'critical' ? 'warning' : alert.level === 'warning' ? 'alert-circle' : 'checkmark-circle'}
            size={32}
            color={levelColor}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.levelLabel, { color: levelColor }]}>{levelLabel}</Text>
            <Text style={[styles.levelDate, { color: colors.textMuted }]}>{dateStr}</Text>
          </View>
        </View>

        {/* Título */}
        <Text style={[styles.title, { color: colors.textPrimary }]}>{alert.title}</Text>

        {/* Fazenda */}
        {farm && (
          <View style={[styles.farmInfo, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="leaf-outline" size={16} color={colors.primary} />
            <Text style={[styles.farmText, { color: colors.textSecondary }]}>
              {farm.name} — {farm.city}/{farm.state}
            </Text>
          </View>
        )}

        {/* Descrição */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={18} color={colors.accent} />
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>O que foi detectado</Text>
          </View>
          <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>{alert.description}</Text>
        </View>

        {/* Recomendação */}
        <View style={[styles.section, { backgroundColor: colors.primary + '0f', borderColor: colors.primary + '44' }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bulb-outline" size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Recomendação da IA</Text>
          </View>
          <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>{alert.recommendation}</Text>
        </View>

        {/* Fonte dos dados */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="planet-outline" size={18} color={colors.textMuted} />
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Fonte dos dados</Text>
          </View>
          <Text style={[styles.sectionBody, { color: colors.textMuted }]}>
            Análise combinada de imagens satelitais INPE CBERS-4A, dados NASA FIRMS e leituras dos sensores IoT instalados na propriedade.
          </Text>
        </View>

        <Button
          label="Voltar para Alertas"
          onPress={() => router.back()}
          variant="secondary"
          icon="arrow-back-outline"
          style={{ marginTop: Spacing.md }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.md, paddingBottom: 60 },

  levelBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  levelLabel: { fontSize: Typography.fontSizes.lg, fontWeight: Typography.fontWeights.bold },
  levelDate: { fontSize: Typography.fontSizes.xs, marginTop: 3, textTransform: 'capitalize' },

  title: { fontSize: Typography.fontSizes.xxl, fontWeight: Typography.fontWeights.bold, marginBottom: Spacing.md, lineHeight: 32 },

  farmInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  farmText: { fontSize: Typography.fontSizes.sm },

  section: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionTitle: { fontSize: Typography.fontSizes.md, fontWeight: Typography.fontWeights.semibold },
  sectionBody: { fontSize: Typography.fontSizes.sm, lineHeight: 22 },
});
