// context/AppContext.tsx
// Estado global compartilhado entre todas as telas do AgroSat AI

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Farm,
  Alert,
  SensorReading,
  mockFarms,
  mockAlerts,
  mockReadings,
} from '@/data/mockData';

// ─── Tipos ─────────────────────────────────────────────────────────────────────

export type ColorTheme = 'dark' | 'light';

interface AppState {
  farms: Farm[];
  alerts: Alert[];
  readings: SensorReading[];
  selectedFarmId: string;
  theme: ColorTheme;
  userName: string;
  unreadAlerts: number;
  isLoading: boolean;
}

interface AppContextType extends AppState {
  setSelectedFarmId: (id: string) => void;
  toggleTheme: () => void;
  markAlertRead: (alertId: string) => void;
  addFarm: (farm: Farm) => void;
  setUserName: (name: string) => void;
  getSelectedFarm: () => Farm | undefined;
  getAlertsForFarm: (farmId: string) => Alert[];
  refreshData: () => void;
}

// ─── Context ────────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  FARMS: '@agrosat_farms',
  ALERTS: '@agrosat_alerts',
  THEME: '@agrosat_theme',
  USER_NAME: '@agrosat_username',
  SELECTED_FARM: '@agrosat_selected_farm',
};

// ─── Provider ───────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [farms, setFarms] = useState<Farm[]>(mockFarms);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [readings] = useState<SensorReading[]>(mockReadings);
  const [selectedFarmId, setSelectedFarmIdState] = useState<string>(mockFarms[0].id);
  const [theme, setTheme] = useState<ColorTheme>('dark');
  const [userName, setUserNameState] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Carrega dados persistidos no AsyncStorage ao iniciar
  useEffect(() => {
    loadPersistedData();
  }, []);

  async function loadPersistedData() {
    try {
      const [storedFarms, storedAlerts, storedTheme, storedUserName, storedFarmId] =
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.FARMS),
          AsyncStorage.getItem(STORAGE_KEYS.ALERTS),
          AsyncStorage.getItem(STORAGE_KEYS.THEME),
          AsyncStorage.getItem(STORAGE_KEYS.USER_NAME),
          AsyncStorage.getItem(STORAGE_KEYS.SELECTED_FARM),
        ]);

      if (storedFarms) setFarms(JSON.parse(storedFarms));
      if (storedAlerts) setAlerts(JSON.parse(storedAlerts));
      if (storedTheme) setTheme(storedTheme as ColorTheme);
      if (storedUserName) setUserNameState(storedUserName);
      if (storedFarmId) setSelectedFarmIdState(storedFarmId);
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // ─── Ações ─────────────────────────────────────────────────────────────────

  async function setSelectedFarmId(id: string) {
    setSelectedFarmIdState(id);
    await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_FARM, id);
  }

  async function toggleTheme() {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, newTheme);
  }

  async function markAlertRead(alertId: string) {
    const updated = alerts.map((a) =>
      a.id === alertId ? { ...a, read: true } : a
    );
    setAlerts(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(updated));
  }

  async function addFarm(farm: Farm) {
    const updated = [...farms, farm];
    setFarms(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.FARMS, JSON.stringify(updated));
  }

  async function setUserName(name: string) {
    setUserNameState(name);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, name);
  }

  function getSelectedFarm(): Farm | undefined {
    return farms.find((f) => f.id === selectedFarmId);
  }

  function getAlertsForFarm(farmId: string): Alert[] {
    return alerts.filter((a) => a.farmId === farmId);
  }

  function refreshData() {
    // Simula refresh - em produção buscaria da API
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1200);
  }

  // Calcula alertas não lidos
  const unreadAlerts = alerts.filter((a) => !a.read).length;

  return (
    <AppContext.Provider
      value={{
        farms,
        alerts,
        readings,
        selectedFarmId,
        theme,
        userName,
        unreadAlerts,
        isLoading,
        setSelectedFarmId,
        toggleTheme,
        markAlertRead,
        addFarm,
        setUserName,
        getSelectedFarm,
        getAlertsForFarm,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider');
  return ctx;
}
