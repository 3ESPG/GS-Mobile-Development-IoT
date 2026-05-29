// app/add-farm.tsx
// Formulário de cadastro de nova fazenda com validação completa

import React, { useState } from 'react';
import * as Location from 'expo-location';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Colors, Spacing, BorderRadius, Typography } from '@/context/theme';
import { ScreenHeader, InputField, Button } from '@/components/ui';
import { cropTypes, brazilianStates, Farm } from '@/data/mockData';

// ─── Erros do formulário ─────────────────────────────────────────────────────

interface FormErrors {
  name?: string;
  owner?: string;
  area?: string;
  crop?: string;
  city?: string;
  state?: string;
  latitude?: string;
  longitude?: string;
}

export default function AddFarmScreen() {
  const { theme, addFarm } = useApp();
  const colors = Colors[theme];
  const router = useRouter();

  // Estado do formulário
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [area, setArea] = useState('');
  const [crop, setCrop] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  // ─── Validação ──────────────────────────────────────────────────────────────

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!name.trim() || name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }
    if (!owner.trim() || owner.trim().length < 3) {
      newErrors.owner = 'Nome do proprietário é obrigatório';
    }
    if (!area.trim() || isNaN(Number(area)) || Number(area) <= 0) {
      newErrors.area = 'Área deve ser um número positivo';
    }
    if (!crop) {
      newErrors.crop = 'Selecione uma cultura';
    }
    if (!city.trim() || city.trim().length < 2) {
      newErrors.city = 'Cidade é obrigatória';
    }
    if (!state) {
      newErrors.state = 'Selecione um estado';
    }
    if (latitude.trim() && (isNaN(Number(latitude)) || Number(latitude) < -90 || Number(latitude) > 90)) {
      newErrors.latitude = 'Latitude deve estar entre -90 e 90';
    }
    if (longitude.trim() && (isNaN(Number(longitude)) || Number(longitude) < -180 || Number(longitude) > 180)) {
      newErrors.longitude = 'Longitude deve estar entre -180 e 180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleUseCurrentLocation() {
    try {
      setLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== Location.PermissionStatus.GRANTED) {
        Alert.alert(
          'Permissão necessária',
          'Não foi possível acessar o GPS. Você ainda pode informar a localização manualmente.'
        );
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLatitude(current.coords.latitude.toFixed(6));
      setLongitude(current.coords.longitude.toFixed(6));
      setErrors((prev) => ({ ...prev, latitude: undefined, longitude: undefined }));
    } catch {
      Alert.alert(
        'Localização indisponível',
        'Não foi possível capturar sua posição agora. Tente novamente ou preencha manualmente.'
      );
    } finally {
      setLocating(false);
    }
  }

  // ─── Submissão ───────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!validate()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // Simula chamada à API

    const newFarm: Farm = {
      id: `farm-${Date.now()}`,
      name: name.trim(),
      owner: owner.trim(),
      area: Number(area),
      crop,
      city: city.trim(),
      state,
      latitude: latitude.trim() ? Number(latitude) : -15 - Math.random() * 10,
      longitude: longitude.trim() ? Number(longitude) : -50 - Math.random() * 10,
      status: 'ok',
      lastUpdate: new Date().toISOString(),
    };

    addFarm(newFarm);
    setLoading(false);

    Alert.alert(
      '✅ Fazenda Cadastrada!',
      `${name} foi adicionada ao monitoramento com sucesso.`,
      [{ text: 'Ver Fazendas', onPress: () => router.replace('/(tabs)/farms') }]
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader
        title="Nova Fazenda"
        subtitle="Cadastrar propriedade"
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Info banner */}
        <View style={[styles.infoBanner, { backgroundColor: colors.accent + '15', borderColor: colors.accent + '40' }]}>
          <Ionicons name="information-circle-outline" size={18} color={colors.accent} />
          <Text style={[styles.infoBannerText, { color: colors.accent }]}>
            Após o cadastro, sensores IoT e dados satelitais serão vinculados automaticamente à sua propriedade.
          </Text>
        </View>

        {/* Dados da propriedade */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>📋 Dados da Propriedade</Text>

        <InputField
          label="Nome da Fazenda *"
          value={name}
          onChangeText={setName}
          placeholder="Ex: Fazenda Santa Clara"
          error={errors.name}
          icon="home-outline"
          autoCapitalize="words"
        />

        <InputField
          label="Proprietário *"
          value={owner}
          onChangeText={setOwner}
          placeholder="Nome completo"
          error={errors.owner}
          icon="person-outline"
          autoCapitalize="words"
        />

        <InputField
          label="Área (hectares) *"
          value={area}
          onChangeText={setArea}
          placeholder="Ex: 250"
          error={errors.area}
          keyboardType="decimal-pad"
          icon="resize-outline"
        />

        {/* Seletor de cultura */}
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Cultura Principal *</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cropList}
        >
          {cropTypes.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setCrop(c)}
              style={[
                styles.cropChip,
                {
                  backgroundColor: crop === c ? colors.primary + '22' : colors.surface,
                  borderColor: crop === c ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[styles.cropChipText, { color: crop === c ? colors.primary : colors.textSecondary }]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {errors.crop && <Text style={[styles.errorText, { color: colors.danger }]}>{errors.crop}</Text>}

        {/* Localização */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginTop: Spacing.md }]}>📍 Localização</Text>

        <InputField
          label="Cidade *"
          value={city}
          onChangeText={setCity}
          placeholder="Ex: Ribeirão Preto"
          error={errors.city}
          icon="location-outline"
          autoCapitalize="words"
        />

        {/* Seletor de estado */}
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Estado *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cropList}>
          {brazilianStates.map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => setState(s)}
              style={[
                styles.stateChip,
                {
                  backgroundColor: state === s ? colors.primary + '22' : colors.surface,
                  borderColor: state === s ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[styles.stateChipText, { color: state === s ? colors.primary : colors.textSecondary }]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {errors.state && <Text style={[styles.errorText, { color: colors.danger }]}>{errors.state}</Text>}

        <View style={[styles.gpsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.gpsHeader}>
            <Ionicons name="navigate-outline" size={18} color={colors.accent} />
            <Text style={[styles.gpsTitle, { color: colors.textPrimary }]}>Coordenadas da Fazenda</Text>
          </View>
          <Text style={[styles.gpsText, { color: colors.textMuted }]}>
            Essas coordenadas conectam a propriedade aos dados satelitais e aos sensores de campo.
          </Text>
          <Button
            label="Usar GPS"
            onPress={handleUseCurrentLocation}
            variant="secondary"
            icon="locate-outline"
            loading={locating}
            style={{ marginTop: 12 }}
          />
        </View>

        <View style={styles.coordinateRow}>
          <InputField
            label="Latitude"
            value={latitude}
            onChangeText={setLatitude}
            placeholder="-21.170400"
            error={errors.latitude}
            keyboardType="decimal-pad"
            icon="navigate-outline"
          />
          <InputField
            label="Longitude"
            value={longitude}
            onChangeText={setLongitude}
            placeholder="-47.810300"
            error={errors.longitude}
            keyboardType="decimal-pad"
            icon="navigate-outline"
          />
        </View>

        {/* Botões */}
        <View style={styles.buttons}>
          <Button
            label="Cancelar"
            onPress={() => router.back()}
            variant="secondary"
            style={{ flex: 1, marginRight: 8 }}
          />
          <Button
            label="Cadastrar"
            onPress={handleSubmit}
            variant="primary"
            icon="checkmark-outline"
            loading={loading}
            style={{ flex: 2 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.md, paddingBottom: 60 },

  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  infoBannerText: { flex: 1, fontSize: Typography.fontSizes.sm, lineHeight: 20 },

  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
    marginBottom: 8,
  },

  cropList: { gap: 8, paddingBottom: 4, paddingTop: 2, marginBottom: Spacing.sm },
  cropChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  cropChipText: { fontSize: Typography.fontSizes.sm, fontWeight: '500' },

  stateChip: {
    width: 44,
    height: 36,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateChipText: { fontSize: Typography.fontSizes.sm, fontWeight: '600' },

  errorText: { fontSize: Typography.fontSizes.xs, marginTop: -8, marginBottom: Spacing.sm, marginLeft: 4 },

  gpsCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  gpsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  gpsTitle: { fontSize: Typography.fontSizes.md, fontWeight: Typography.fontWeights.semibold },
  gpsText: { fontSize: Typography.fontSizes.sm, lineHeight: 20 },
  coordinateRow: { gap: 0 },

  buttons: { flexDirection: 'row', marginTop: Spacing.lg },
});
