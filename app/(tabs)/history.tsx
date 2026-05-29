// app/(tabs)/history.tsx
// Dashboard de histórico com gráficos detalhados de todos os sensores

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useApp } from '@/context/AppContext';
import { Colors, Spacing, BorderRadius, Typography } from '@/context/theme';
import { ScreenHeader, SectionHeader } from '@/components/ui';
import { mockReadings, chartSoilMoisture, chartTemperature, chartNDVI } from '@/data/mockData';

const { width: SCREEN_W } = Dimensions.get('window');
const CHART_W = Math.max(280, Math.min(SCREEN_W, 390) - Spacing.md * 2 - 32);

export default function HistoryScreen() {
  const { theme, getSelectedFarm } = useApp();
  const colors = Colors[theme];
  const farm = getSelectedFarm();
  const [period] = useState('7d');

  const chartConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    color: (opacity = 1) => colors.primary + Math.round(opacity * 255).toString(16).padStart(2, '0'),
    labelColor: () => colors.textMuted,
    strokeWidth: 2.5,
    propsForDots: { r: '4', strokeWidth: '2', stroke: colors.primary },
    propsForBackgroundLines: { stroke: colors.border, strokeDasharray: '4' },
    decimalPlaces: 0,
  };

  const ndviConfig = {
    ...chartConfig,
    color: (opacity = 1) => colors.success + Math.round(opacity * 255).toString(16).padStart(2, '0'),
    propsForDots: { r: '4', strokeWidth: '2', stroke: colors.success },
    decimalPlaces: 2,
  };

  const tempConfig = {
    ...chartConfig,
    color: (opacity = 1) => colors.warning + Math.round(opacity * 255).toString(16).padStart(2, '0'),
    propsForDots: { r: '4', strokeWidth: '2', stroke: colors.warning },
  };

  // Dados de chuva simulados para o bar chart
  const rainfallData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [{ data: [5.2, 0, 0, 0, 0, 0, 0] }],
  };

  // Estatísticas dos últimos 7 dias
  const temps = mockReadings.map((r) => r.temperature);
  const moistures = mockReadings.map((r) => r.soilMoisture);
  const ndvis = mockReadings.map((r) => r.ndvi);

  const stats = [
    { label: 'Temp. Máx.', value: `${Math.max(...temps).toFixed(1)}°C`, color: colors.danger },
    { label: 'Temp. Mín.', value: `${Math.min(...temps).toFixed(1)}°C`, color: colors.accent },
    { label: 'Umid. Máx.', value: `${Math.max(...moistures)}%`, color: colors.success },
    { label: 'Umid. Mín.', value: `${Math.min(...moistures)}%`, color: colors.warning },
    { label: 'NDVI Máx.', value: Math.max(...ndvis).toFixed(2), color: colors.success },
    { label: 'NDVI Mín.', value: Math.min(...ndvis).toFixed(2), color: colors.warning },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Histórico de Dados"
        subtitle={farm ? `${farm.name} • Últimos 7 dias` : 'Selecione uma fazenda'}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Estatísticas resumidas */}
        <SectionHeader title="Resumo do Período" />
        <View style={styles.statsGrid}>
          {stats.map((s, i) => (
            <View
              key={i}
              style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Gráfico de umidade do solo */}
        <SectionHeader title="💧 Umidade do Solo (%)" />
        <View style={[styles.chartBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <LineChart
            data={{ labels: chartSoilMoisture.labels, datasets: [{ data: chartSoilMoisture.values }] }}
            width={CHART_W}
            height={170}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
          <Text style={[styles.chartNote, { color: colors.textMuted }]}>
            ⚠️ Queda de 34 pontos em 7 dias — risco de estresse hídrico
          </Text>
        </View>

        {/* Gráfico de temperatura */}
        <SectionHeader title="🌡 Temperatura do Ar (°C)" />
        <View style={[styles.chartBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <LineChart
            data={{ labels: chartTemperature.labels, datasets: [{ data: chartTemperature.values }] }}
            width={CHART_W}
            height={170}
            chartConfig={tempConfig}
            bezier
            style={styles.chart}
          />
          <Text style={[styles.chartNote, { color: colors.textMuted }]}>
            ⚠️ Temperatura acima de 35°C desde quinta-feira
          </Text>
        </View>

        {/* Gráfico de NDVI */}
        <SectionHeader title="🌿 Índice de Vegetação (NDVI)" />
        <View style={[styles.chartBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <LineChart
            data={{ labels: chartNDVI.labels, datasets: [{ data: chartNDVI.values }] }}
            width={CHART_W}
            height={170}
            chartConfig={ndviConfig}
            bezier
            style={styles.chart}
          />
          <View style={styles.ndviLegend}>
            <View style={[styles.ndviRange, { backgroundColor: colors.success + '20' }]}>
              <Text style={[styles.ndviRangeText, { color: colors.success }]}>0.6–1.0 Saudável</Text>
            </View>
            <View style={[styles.ndviRange, { backgroundColor: colors.warning + '20' }]}>
              <Text style={[styles.ndviRangeText, { color: colors.warning }]}>0.4–0.6 Atenção</Text>
            </View>
            <View style={[styles.ndviRange, { backgroundColor: colors.danger + '20' }]}>
              <Text style={[styles.ndviRangeText, { color: colors.danger }]}>0.0–0.4 Crítico</Text>
            </View>
          </View>
        </View>

        {/* Gráfico de chuva */}
        <SectionHeader title="🌧 Precipitação (mm)" />
        <View style={[styles.chartBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <BarChart
            data={rainfallData}
            width={CHART_W}
            height={160}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => colors.accent + Math.round(opacity * 255).toString(16).padStart(2, '0'),
            }}
            style={styles.chart}
            yAxisLabel=""
            yAxisSuffix="mm"
            showValuesOnTopOfBars
          />
          <Text style={[styles.chartNote, { color: colors.textMuted }]}>
            📌 Total de 5.2mm no período. Média ideal: 35mm/semana para soja
          </Text>
        </View>

        {/* Fonte dos dados */}
        <View style={[styles.dataSource, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.dataSourceTitle, { color: colors.textSecondary }]}>🛰 Fontes de Dados</Text>
          <Text style={[styles.dataSourceText, { color: colors.textMuted }]}>
            • INPE CBERS-4A — imagens multiespectrais (NDVI){'\n'}
            • NASA FIRMS — monitoramento de queimadas{'\n'}
            • Sensores IoT de campo — temperatura e umidade{'\n'}
            • INMET — dados meteorológicos locais
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.md, paddingBottom: 80 },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.sm,
  },
  statCard: {
    width: '31%',
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  statValue: { fontSize: Typography.fontSizes.lg, fontWeight: Typography.fontWeights.bold },
  statLabel: { fontSize: Typography.fontSizes.xs, marginTop: 4, textAlign: 'center' },

  chartBox: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  chart: { marginLeft: -16, marginTop: 4 },
  chartNote: { fontSize: Typography.fontSizes.xs, marginTop: 8, lineHeight: 16 },

  ndviLegend: { flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' },
  ndviRange: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.full },
  ndviRangeText: { fontSize: 11, fontWeight: '600' },

  dataSource: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  dataSourceTitle: { fontSize: Typography.fontSizes.sm, fontWeight: '600', marginBottom: 8 },
  dataSourceText: { fontSize: Typography.fontSizes.xs, lineHeight: 20 },
});
