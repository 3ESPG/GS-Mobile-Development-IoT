// components/ui.tsx
// Componentes reutilizáveis do AgroSat AI

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Colors, Typography, Spacing, BorderRadius } from '@/context/theme';
import { AlertLevel } from '@/data/mockData';

type IconName = keyof typeof Ionicons.glyphMap;

// ─── Header da tela ──────────────────────────────────────────────────────────

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightIcon?: IconName;
  onRightPress?: () => void;
  onBack?: () => void;
}

export function ScreenHeader({ title, subtitle, rightIcon, onRightPress, onBack }: ScreenHeaderProps) {
  const { theme } = useApp();
  const colors = Colors[theme];

  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <View style={styles.headerLeft}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
          </TouchableOpacity>
        )}
        <View>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
          )}
        </View>
      </View>
      {rightIcon && (
        <TouchableOpacity onPress={onRightPress} style={styles.headerRight}>
          <Ionicons name={rightIcon} size={22} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Card de métricas ────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string;
  unit: string;
  icon: IconName;
  trend?: 'up' | 'down' | 'stable';
  status?: AlertLevel;
  onPress?: () => void;
}

export function MetricCard({ label, value, unit, icon, trend, status, onPress }: MetricCardProps) {
  const { theme } = useApp();
  const colors = Colors[theme];

  const statusColor = status === 'critical'
    ? colors.danger
    : status === 'warning'
    ? colors.warning
    : colors.success;

  const trendIcon: IconName = trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'remove';
  const trendColor = trend === 'up' ? colors.danger : trend === 'down' ? colors.success : colors.textMuted;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.metricTop}>
        <View style={[styles.metricIconBg, { backgroundColor: statusColor + '22' }]}>
          <Ionicons name={icon} size={18} color={statusColor} />
        </View>
        {trend && (
          <Ionicons name={trendIcon} size={14} color={trendColor} />
        )}
      </View>
      <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
        {value}
        <Text style={[styles.metricUnit, { color: colors.textMuted }]}> {unit}</Text>
      </Text>
      <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Card de alerta ──────────────────────────────────────────────────────────

interface AlertCardProps {
  title: string;
  description: string;
  level: AlertLevel;
  timestamp: string;
  read: boolean;
  onPress?: () => void;
}

export function AlertCard({ title, description, level, timestamp, read, onPress }: AlertCardProps) {
  const { theme } = useApp();
  const colors = Colors[theme];

  const levelColor = level === 'critical' ? colors.danger : level === 'warning' ? colors.warning : colors.success;
  const levelBg = levelColor + '18';

  const date = new Date(timestamp);
  const timeStr = date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.alertCard,
        {
          backgroundColor: colors.surface,
          borderColor: read ? colors.border : levelColor,
          borderLeftWidth: read ? 1 : 4,
          opacity: read ? 0.75 : 1,
        },
      ]}
    >
      <View style={styles.alertHeader}>
        <View style={[styles.alertBadge, { backgroundColor: levelBg }]}>
          <Text style={[styles.alertBadgeText, { color: levelColor }]}>
            {level === 'critical' ? 'CRÍTICO' : level === 'warning' ? 'ATENÇÃO' : 'NORMAL'}
          </Text>
        </View>
        <Text style={[styles.alertTime, { color: colors.textMuted }]}>{timeStr}</Text>
      </View>
      <Text style={[styles.alertTitle, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.alertDesc, { color: colors.textSecondary }]} numberOfLines={2}>
        {description}
      </Text>
      {!read && (
        <View style={[styles.unreadDot, { backgroundColor: levelColor }]} />
      )}
    </TouchableOpacity>
  );
}

// ─── Card de fazenda ─────────────────────────────────────────────────────────

interface FarmCardProps {
  name: string;
  crop: string;
  area: number;
  city: string;
  state: string;
  status: AlertLevel;
  lastUpdate: string;
  onPress?: () => void;
}

export function FarmCard({ name, crop, area, city, state, status, lastUpdate, onPress }: FarmCardProps) {
  const { theme } = useApp();
  const colors = Colors[theme];

  const statusColor = status === 'critical' ? colors.danger : status === 'warning' ? colors.warning : colors.success;
  const statusLabel = status === 'critical' ? 'Crítico' : status === 'warning' ? 'Atenção' : 'Normal';

  const date = new Date(lastUpdate);
  const timeStr = date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.farmCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.farmCardLeft}>
        <View style={[styles.farmIcon, { backgroundColor: colors.primary + '22' }]}>
          <Ionicons name="leaf" size={22} color={colors.primary} />
        </View>
        <View style={styles.farmInfo}>
          <Text style={[styles.farmName, { color: colors.textPrimary }]}>{name}</Text>
          <Text style={[styles.farmMeta, { color: colors.textSecondary }]}>
            {crop} • {area} ha • {city}/{state}
          </Text>
          <Text style={[styles.farmUpdate, { color: colors.textMuted }]}>
            Atualizado em {timeStr}
          </Text>
        </View>
      </View>
      <View style={styles.farmCardRight}>
        <View style={[styles.statusPill, { backgroundColor: statusColor + '22' }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} style={{ marginTop: 8 }} />
      </View>
    </TouchableOpacity>
  );
}

// ─── Seção header ─────────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  const { theme } = useApp();
  const colors = Colors[theme];

  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={[styles.sectionAction, { color: colors.primary }]}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Loading ─────────────────────────────────────────────────────────────────

export function LoadingSpinner({ label }: { label?: string }) {
  const { theme } = useApp();
  const colors = Colors[theme];

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      {label && <Text style={[styles.loadingLabel, { color: colors.textSecondary }]}>{label}</Text>}
    </View>
  );
}

// ─── Campo de input estilizado ───────────────────────────────────────────────

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words';
  icon?: IconName;
}

import { TextInput } from 'react-native';

export function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  icon,
}: InputFieldProps) {
  const { theme } = useApp();
  const colors = Colors[theme];

  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: error ? colors.danger : colors.border,
          },
        ]}
      >
        {icon && <Ionicons name={icon} size={18} color={colors.textMuted} style={{ marginRight: 8 }} />}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={[styles.input, { color: colors.textPrimary }]}
        />
      </View>
      {error ? (
        <Text style={[styles.inputError, { color: colors.danger }]}>{error}</Text>
      ) : null}
    </View>
  );
}

// ─── Botão primário ─────────────────────────────────────────────────────────

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({ label, onPress, variant = 'primary', icon, disabled, loading, style }: ButtonProps) {
  const { theme } = useApp();
  const colors = Colors[theme];

  const bgColor =
    variant === 'primary'
      ? colors.primary
      : variant === 'danger'
      ? colors.danger
      : colors.surface;

  const textColor =
    variant === 'primary' || variant === 'danger' ? '#000' : colors.textPrimary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        { backgroundColor: bgColor, borderColor: colors.border, opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={18} color={textColor} style={{ marginRight: 6 }} />}
          <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  backBtn: { marginRight: 10, padding: 4 },
  headerTitle: { fontSize: Typography.fontSizes.xl, fontWeight: Typography.fontWeights.bold },
  headerSubtitle: { fontSize: Typography.fontSizes.sm, marginTop: 2 },
  headerRight: { padding: 8 },

  // Metric card
  metricCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    flex: 1,
    minWidth: 0,
    margin: 4,
  },
  metricTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  metricIconBg: { width: 36, height: 36, borderRadius: BorderRadius.sm, alignItems: 'center', justifyContent: 'center' },
  metricValue: { fontSize: Typography.fontSizes.xxl, fontWeight: Typography.fontWeights.bold },
  metricUnit: { fontSize: Typography.fontSizes.sm, fontWeight: Typography.fontWeights.regular },
  metricLabel: { fontSize: Typography.fontSizes.sm, marginTop: 4 },

  // Alert card
  alertCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    position: 'relative',
  },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  alertBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full },
  alertBadgeText: { fontSize: Typography.fontSizes.xs, fontWeight: Typography.fontWeights.bold, letterSpacing: 0.5 },
  alertTime: { fontSize: Typography.fontSizes.xs },
  alertTitle: { fontSize: Typography.fontSizes.md, fontWeight: Typography.fontWeights.semibold, marginBottom: 4 },
  alertDesc: { fontSize: Typography.fontSizes.sm, lineHeight: 18 },
  unreadDot: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4 },

  // Farm card
  farmCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  farmCardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  farmIcon: { width: 44, height: 44, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  farmInfo: { flex: 1 },
  farmName: { fontSize: Typography.fontSizes.md, fontWeight: Typography.fontWeights.semibold },
  farmMeta: { fontSize: Typography.fontSizes.sm, marginTop: 2 },
  farmUpdate: { fontSize: Typography.fontSizes.xs, marginTop: 3 },
  farmCardRight: { alignItems: 'flex-end' },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.full },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  statusText: { fontSize: Typography.fontSizes.xs, fontWeight: Typography.fontWeights.semibold },

  // Section header
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm, marginTop: Spacing.md },
  sectionTitle: { fontSize: Typography.fontSizes.lg, fontWeight: Typography.fontWeights.semibold },
  sectionAction: { fontSize: Typography.fontSizes.sm, fontWeight: Typography.fontWeights.medium },

  // Loading
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  loadingLabel: { marginTop: Spacing.sm, fontSize: Typography.fontSizes.sm },

  // Input
  inputWrapper: { marginBottom: Spacing.md },
  inputLabel: { fontSize: Typography.fontSizes.sm, fontWeight: Typography.fontWeights.medium, marginBottom: 6 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  input: { flex: 1, fontSize: Typography.fontSizes.md },
  inputError: { fontSize: Typography.fontSizes.xs, marginTop: 4 },

  // Button
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
  },
  buttonText: { fontSize: Typography.fontSizes.md, fontWeight: Typography.fontWeights.bold },
});
