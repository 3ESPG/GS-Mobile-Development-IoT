// app/(tabs)/farms.tsx
// Tela de gerenciamento de fazendas

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Colors, Spacing, BorderRadius, Typography } from '@/context/theme';
import { FarmCard, ScreenHeader, SectionHeader } from '@/components/ui';

export default function FarmsScreen() {
  const { theme, farms, setSelectedFarmId, selectedFarmId } = useApp();
  const colors = Colors[theme];
  const router = useRouter();

  const criticalFarms = farms.filter((f) => f.status === 'critical');
  const warningFarms = farms.filter((f) => f.status === 'warning');
  const okFarms = farms.filter((f) => f.status === 'ok');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Minhas Fazendas"
        subtitle={`${farms.length} propriedade${farms.length > 1 ? 's' : ''} monitorada${farms.length > 1 ? 's' : ''}`}
        rightIcon="add-circle-outline"
        onRightPress={() => router.push('/add-farm')}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Resumo de status */}
        <View style={styles.statusRow}>
          <View style={[styles.statusSummary, { backgroundColor: colors.danger + '18', borderColor: colors.danger + '44' }]}>
            <Text style={[styles.statusCount, { color: colors.danger }]}>{criticalFarms.length}</Text>
            <Text style={[styles.statusLabel, { color: colors.textMuted }]}>Crítico</Text>
          </View>
          <View style={[styles.statusSummary, { backgroundColor: colors.warning + '18', borderColor: colors.warning + '44' }]}>
            <Text style={[styles.statusCount, { color: colors.warning }]}>{warningFarms.length}</Text>
            <Text style={[styles.statusLabel, { color: colors.textMuted }]}>Atenção</Text>
          </View>
          <View style={[styles.statusSummary, { backgroundColor: colors.success + '18', borderColor: colors.success + '44' }]}>
            <Text style={[styles.statusCount, { color: colors.success }]}>{okFarms.length}</Text>
            <Text style={[styles.statusLabel, { color: colors.textMuted }]}>Normal</Text>
          </View>
        </View>

        {/* Fazenda selecionada atualmente */}
        <View style={[styles.selectedBanner, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '40' }]}>
          <Ionicons name="radio-button-on" size={14} color={colors.primary} />
          <Text style={[styles.selectedText, { color: colors.primary }]}>
            Monitorando: {farms.find((f) => f.id === selectedFarmId)?.name}
          </Text>
        </View>

        {/* Lista de fazendas */}
        <SectionHeader title="Todas as Propriedades" action="+ Nova" onAction={() => router.push('/add-farm')} />
        {farms.map((farm) => (
          <FarmCard
            key={farm.id}
            name={farm.name}
            crop={farm.crop}
            area={farm.area}
            city={farm.city}
            state={farm.state}
            status={farm.status}
            lastUpdate={farm.lastUpdate}
            onPress={() => {
              setSelectedFarmId(farm.id);
              router.push(`/farm/${farm.id}`);
            }}
          />
        ))}

        {/* Botão de adicionar nova fazenda */}
        <TouchableOpacity
          style={[styles.addButton, { borderColor: colors.primary, backgroundColor: colors.primary + '10' }]}
          onPress={() => router.push('/add-farm')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color={colors.primary} />
          <Text style={[styles.addButtonText, { color: colors.primary }]}>Cadastrar Nova Fazenda</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.md, paddingBottom: 80 },

  statusRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.md },
  statusSummary: {
    flex: 1,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
  },
  statusCount: { fontSize: Typography.fontSizes.xxl, fontWeight: Typography.fontWeights.bold },
  statusLabel: { fontSize: Typography.fontSizes.xs, marginTop: 3 },

  selectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  selectedText: { fontSize: Typography.fontSizes.sm, fontWeight: '600' },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    paddingVertical: 16,
    marginTop: Spacing.sm,
  },
  addButtonText: { fontSize: Typography.fontSizes.md, fontWeight: '600' },
});
