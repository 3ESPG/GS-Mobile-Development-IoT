// app/(tabs)/index.tsx
// Dashboard principal: métricas em tempo real da fazenda selecionada

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useApp } from '@/context/AppContext';
import { Colors, Spacing, BorderRadius, Typography } from '@/context/theme';
import { MetricCard, SectionHeader, AlertCard, ScreenHeader } from '@/components/ui';
import { mockReadings, chartSoilMoisture, chartTemperature, chartNDVI } from '@/data/mockData';

const { width: SCREEN_W } = Dimensions.get('window');
const CHART_W = Math.max(280, Math.min(SCREEN_W, 390) - Spacing.md * 2 - 32);

type ChartTab = 'soil' | 'temp' | 'ndvi';

export default function DashboardScreen() {
  const { theme, getSelectedFarm, alerts, unreadAlerts, refreshData, isLoading } = useApp();
  const colors = Colors[theme];
  const router = useRouter();

  const farm = getSelectedFarm();
  const lastReading = mockReadings[mockReadings.length - 1];
  const [activeChart, setActiveChart] = useState<ChartTab>('soil');
  const [refreshing, setRefreshing] = useState(false);

  // useEffect: atualiza título ao trocar de fazenda
  useEffect(() => {
    // Em produção, buscaria dados da API aqui
  }, [farm?.id]);

  function onRefresh() {
    setRefreshing(true);
    refreshData();
    setTimeout(() => setRefreshing(false), 1200);
  }

  const chartData = activeChart === 'soil'
    ? chartSoilMoisture
    : activeChart === 'temp'
    ? chartTemperature
    : chartNDVI;

  const chartConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: activeChart === 'ndvi' ? 2 : 0,
    color: () => colors.primary,
    labelColor: () => colors.textMuted,
    strokeWidth: 2,
    propsForDots: { r: '4', strokeWidth: '2', stroke: colors.primary },
    propsForBackgroundLines: { stroke: colors.border, strokeDasharray: '4' },
  };

  const farmAlerts = alerts
    .filter((a) => a.farmId === farm?.id)
    .sort((a, b) => (a.read ? 1 : -1))
    .slice(0, 3);

  // Calcula status das métricas
  function moistureStatus() {
    if (lastReading.soilMoisture < 30) return 'critical';
    if (lastReading.soilMoisture < 45) return 'warning';
    return 'ok';
  }
  function tempStatus() {
    if (lastReading.temperature > 35) return 'critical';
    if (lastReading.temperature > 32) return 'warning';
    return 'ok';
  }
  function ndviStatus() {
    if (lastReading.ndvi < 0.55) return 'critical';
    if (lastReading.ndvi < 0.65) return 'warning';
    return 'ok';
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="AgroSat AI"
        subtitle={farm ? `${farm.name} • ${farm.city}/${farm.state}` : 'Selecione uma fazenda'}
        rightIcon="settings-outline"
        onRightPress={() => router.push('/settings')}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Banner de alerta crítico */}
        {unreadAlerts > 0 && (
          <TouchableOpacity
            style={[styles.alertBanner, { backgroundColor: colors.danger + '20', borderColor: colors.danger }]}
            onPress={() => router.push('/(tabs)/alerts')}
            activeOpacity={0.8}
          >
            <Ionicons name="warning" size={18} color={colors.danger} />
            <Text style={[styles.alertBannerText, { color: colors.danger }]}>
              {unreadAlerts} alerta{unreadAlerts > 1 ? 's' : ''} não lido{unreadAlerts > 1 ? 's' : ''} — Toque para ver
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.danger} />
          </TouchableOpacity>
        )}

        {/* Satélite info bar */}
        <View style={[styles.satelliteBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.satItem}>
            <Ionicons name="planet-outline" size={14} color={colors.accent} />
            <Text style={[styles.satText, { color: colors.accent }]}>INPE CBERS-4A</Text>
          </View>
          <View style={styles.satDivider} />
          <View style={styles.satItem}>
            <Ionicons name="time-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.satText, { color: colors.textMuted }]}>28/05 • 10:30</Text>
          </View>
          <View style={styles.satDivider} />
          <View style={styles.satItem}>
            <View style={[styles.satDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.satText, { color: colors.success }]}>Online</Text>
          </View>
        </View>

        {/* Métricas principais */}
        <SectionHeader title="Métricas em Tempo Real" />
        <View style={styles.metricsGrid}>
          <MetricCard
            label="Umidade Solo"
            value={lastReading.soilMoisture.toString()}
            unit="%"
            icon="water"
            trend="down"
            status={moistureStatus()}
          />
          <MetricCard
            label="Temperatura"
            value={lastReading.temperature.toString()}
            unit="°C"
            icon="thermometer"
            trend="up"
            status={tempStatus()}
          />
        </View>
        <View style={styles.metricsGrid}>
          <MetricCard
            label="Índice NDVI"
            value={lastReading.ndvi.toFixed(2)}
            unit=""
            icon="leaf"
            trend="down"
            status={ndviStatus()}
          />
          <MetricCard
            label="Umidade Ar"
            value={lastReading.humidity.toString()}
            unit="%"
            icon="cloud"
            trend="down"
            status="warning"
          />
        </View>
        <View style={styles.metricsGrid}>
          <MetricCard
            label="Vento"
            value={lastReading.windSpeed.toString()}
            unit="km/h"
            icon="partly-sunny-outline"
            trend="up"
            status={lastReading.windSpeed > 25 ? 'warning' : 'ok'}
          />
          <MetricCard
            label="Chuva Hoje"
            value={lastReading.rainfall.toString()}
            unit="mm"
            icon="rainy"
            trend="stable"
            status="ok"
          />
        </View>

        {/* Gráficos */}
        <SectionHeader title="Evolução nos Últimos 7 Dias" />
        <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Seletor de gráfico */}
          <View style={[styles.chartTabs, { backgroundColor: colors.background }]}>
            {([
              { key: 'soil', label: '💧 Umidade' },
              { key: 'temp', label: '🌡 Temp' },
              { key: 'ndvi', label: '🌿 NDVI' },
            ] as { key: ChartTab; label: string }[]).map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveChart(tab.key)}
                style={[
                  styles.chartTab,
                  activeChart === tab.key && { backgroundColor: colors.primary + '22', borderColor: colors.primary },
                  { borderColor: 'transparent' },
                ]}
              >
                <Text
                  style={[
                    styles.chartTabText,
                    { color: activeChart === tab.key ? colors.primary : colors.textMuted },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <LineChart
            data={{
              labels: chartData.labels,
              datasets: [{ data: chartData.values }],
            }}
            width={CHART_W}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Alertas recentes */}
        <SectionHeader
          title="Alertas Recentes"
          action="Ver todos"
          onAction={() => router.push('/(tabs)/alerts')}
        />
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

        {/* Rodapé com crédito de dados */}
        <View style={styles.footer}>
          <Ionicons name="planet-outline" size={12} color={colors.textMuted} />
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Dados via INPE, NASA FIRMS e sensores IoT de campo
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.md, paddingBottom: Spacing.xxl },

  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.md,
    gap: 8,
  },
  alertBannerText: { flex: 1, fontSize: Typography.fontSizes.sm, fontWeight: '600' },

  satelliteBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    justifyContent: 'space-around',
  },
  satItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  satDivider: { width: 1, height: 16, backgroundColor: '#1e3a5f' },
  satDot: { width: 6, height: 6, borderRadius: 3 },
  satText: { fontSize: Typography.fontSizes.xs, fontWeight: '500' },

  metricsGrid: { flexDirection: 'row', marginHorizontal: -4 },

  chartCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  chartTabs: { flexDirection: 'row', borderRadius: BorderRadius.sm, marginBottom: 12, padding: 3 },
  chartTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  chartTabText: { fontSize: Typography.fontSizes.sm, fontWeight: '600' },
  chart: { marginLeft: -16, marginTop: 4 },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  footerText: { fontSize: Typography.fontSizes.xs },
});
