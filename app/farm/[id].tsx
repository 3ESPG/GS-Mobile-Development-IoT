// app/farm/[id].tsx
// Detalhe completo de uma fazenda com métricas e histórico

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useApp } from '@/context/AppContext';
import { Colors, Spacing, BorderRadius, Typography } from '@/context/theme';
import { ScreenHeader, MetricCard, AlertCard, SectionHeader } from '@/components/ui';
import { mockReadings, chartSoilMoisture } from '@/data/mockData';

const { width: SCREEN_W } = Dimensions.get('window');
const CHART_W = Math.max(280, Math.min(SCREEN_W, 390) - Spacing.md * 2 - 32);

export default function FarmDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, farms, alerts } = useApp();
  const colors = Colors[theme];
  const router = useRouter();

  const farm = farms.find((f) => f.id === id);
  const farmAlerts = alerts.filter((a) => a.farmId === id);
  const lastReading = mockReadings[mockReadings.length - 1];

  if (!farm) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScreenHeader title="Fazenda não encontrada" onBack={() => router.back()} />
      </View>
    );
  }

  const statusColor =
    farm.status === 'critical' ? colors.danger : farm.status === 'warning' ? colors.warning : colors.success;
  const statusLabel = farm.status === 'critical' ? 'Crítico' : farm.status === 'warning' ? 'Atenção' : 'Normal';

  const chartConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: () => colors.primary,
    labelColor: () => colors.textMuted,
    strokeWidth: 2,
    propsForDots: { r: '4', strokeWidth: '2', stroke: colors.primary },
    propsForBackgroundLines: { stroke: colors.border, strokeDasharray: '4' },
  };

  const infoItems = [
    { icon: 'person-outline' as const, label: 'Proprietário', value: farm.owner },
    { icon: 'resize-outline' as const, label: 'Área total', value: `${farm.area} hectares` },
    { icon: 'leaf-outline' as const, label: 'Cultura', value: farm.crop },
    { icon: 'location-outline' as const, label: 'Localização', value: `${farm.city}, ${farm.state}` },
    { icon: 'navigate-outline' as const, label: 'Coordenadas', value: `${farm.latitude.toFixed(4)}, ${farm.longitude.toFixed(4)}` },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={farm.name} subtitle={`${farm.crop} • ${farm.area} ha`} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Status badge */}
        <View style={[styles.statusBanner, { backgroundColor: statusColor + '18', borderColor: statusColor + '44' }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>Status Atual: {statusLabel}</Text>
          <Text style={[styles.statusUpdate, { color: colors.textMuted }]}>
            {new Date(farm.lastUpdate).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {/* Informações da fazenda */}
        <SectionHeader title="Informações da Propriedade" />
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {infoItems.map((item, i) => (
            <View key={i} style={[styles.infoRow, i < infoItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.borderLight }]}>
              <View style={[styles.infoIcon, { backgroundColor: colors.primary + '18' }]}>
                <Ionicons name={item.icon} size={16} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{item.label}</Text>
                <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Métricas atuais */}
        <SectionHeader title="Leitura Atual dos Sensores" />
        <View style={styles.metricsRow}>
          <MetricCard label="Umidade Solo" value={`${lastReading.soilMoisture}`} unit="%" icon="water" status="warning" trend="down" />
          <MetricCard label="Temperatura" value={`${lastReading.temperature}`} unit="°C" icon="thermometer" status="critical" trend="up" />
        </View>
        <View style={styles.metricsRow}>
          <MetricCard label="NDVI" value={lastReading.ndvi.toFixed(2)} unit="" icon="leaf" status="warning" trend="down" />
          <MetricCard label="Vento" value={`${lastReading.windSpeed}`} unit="km/h" icon="partly-sunny-outline" status="warning" trend="up" />
        </View>

        {/* Gráfico rápido de umidade */}
        <SectionHeader title="Umidade do Solo — 7 dias" />
        <View style={[styles.chartBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <LineChart
            data={{ labels: chartSoilMoisture.labels, datasets: [{ data: chartSoilMoisture.values }] }}
            width={CHART_W}
            height={160}
            chartConfig={chartConfig}
            bezier
            style={{ marginLeft: -16 }}
          />
        </View>

        {/* Alertas da fazenda */}
        <SectionHeader title={`Alertas (${farmAlerts.length})`} />
        {farmAlerts.map((alert) => (
          <AlertCard
            key={alert.id}
            title={alert.title}
            description={alert.description}
            level={alert.level}
            timestamp={alert.timestamp}
            read={alert.read}
            onPress={() => router.push(`/alert/${alert.id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.md, paddingBottom: 60 },

  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { flex: 1, fontSize: Typography.fontSizes.md, fontWeight: '600' },
  statusUpdate: { fontSize: Typography.fontSizes.xs },

  infoCard: { borderRadius: BorderRadius.md, borderWidth: 1, overflow: 'hidden', marginBottom: Spacing.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  infoIcon: { width: 34, height: 34, borderRadius: BorderRadius.sm, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontSize: Typography.fontSizes.xs, marginBottom: 2 },
  infoValue: { fontSize: Typography.fontSizes.sm, fontWeight: '500' },

  metricsRow: { flexDirection: 'row', marginHorizontal: -4 },

  chartBox: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
});
