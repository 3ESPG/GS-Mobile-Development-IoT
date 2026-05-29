// data/mockData.ts
// Dados simulados de satélites e sensores IoT para o AgroSat AI

export type AlertLevel = 'critical' | 'warning' | 'ok';

export interface SensorReading {
  id: string;
  timestamp: string;
  temperature: number;      // °C
  soilMoisture: number;     // % umidade do solo
  ndvi: number;             // Índice de vegetação (0-1)
  humidity: number;         // % umidade do ar
  rainfall: number;         // mm de chuva
  windSpeed: number;        // km/h
  latitude: number;
  longitude: number;
}

export interface Farm {
  id: string;
  name: string;
  owner: string;
  area: number;             // hectares
  crop: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  status: AlertLevel;
  lastUpdate: string;
}

export interface Alert {
  id: string;
  farmId: string;
  type: 'drought' | 'fire_risk' | 'pest' | 'low_ndvi' | 'frost' | 'flood';
  level: AlertLevel;
  title: string;
  description: string;
  recommendation: string;
  timestamp: string;
  read: boolean;
}

// Fazendas cadastradas
export const mockFarms: Farm[] = [
  {
    id: 'farm-001',
    name: 'Fazenda Santa Clara',
    owner: 'João Mendes',
    area: 320,
    crop: 'Soja',
    city: 'Ribeirão Preto',
    state: 'SP',
    latitude: -21.1704,
    longitude: -47.8103,
    status: 'warning',
    lastUpdate: '2026-05-28T10:30:00Z',
  },
  {
    id: 'farm-002',
    name: 'Fazenda Boa Vista',
    owner: 'Maria Silva',
    area: 180,
    crop: 'Milho',
    city: 'Sorriso',
    state: 'MT',
    latitude: -12.5447,
    longitude: -55.7219,
    status: 'critical',
    lastUpdate: '2026-05-28T10:15:00Z',
  },
  {
    id: 'farm-003',
    name: 'Rancho Esperança',
    owner: 'Carlos Souza',
    area: 75,
    crop: 'Café',
    city: 'Patrocínio',
    state: 'MG',
    latitude: -18.9404,
    longitude: -46.9939,
    status: 'ok',
    lastUpdate: '2026-05-28T10:00:00Z',
  },
];

// Leituras dos últimos 7 dias para farm-001
export const mockReadings: SensorReading[] = [
  {
    id: 'r-001',
    timestamp: '2026-05-22T08:00:00Z',
    temperature: 28.5,
    soilMoisture: 62,
    ndvi: 0.72,
    humidity: 68,
    rainfall: 5.2,
    windSpeed: 12,
    latitude: -21.1704,
    longitude: -47.8103,
  },
  {
    id: 'r-002',
    timestamp: '2026-05-23T08:00:00Z',
    temperature: 30.1,
    soilMoisture: 58,
    ndvi: 0.70,
    humidity: 64,
    rainfall: 0,
    windSpeed: 15,
    latitude: -21.1704,
    longitude: -47.8103,
  },
  {
    id: 'r-003',
    timestamp: '2026-05-24T08:00:00Z',
    temperature: 31.8,
    soilMoisture: 51,
    ndvi: 0.68,
    humidity: 59,
    rainfall: 0,
    windSpeed: 18,
    latitude: -21.1704,
    longitude: -47.8103,
  },
  {
    id: 'r-004',
    timestamp: '2026-05-25T08:00:00Z',
    temperature: 33.2,
    soilMoisture: 44,
    ndvi: 0.65,
    humidity: 52,
    rainfall: 0,
    windSpeed: 20,
    latitude: -21.1704,
    longitude: -47.8103,
  },
  {
    id: 'r-005',
    timestamp: '2026-05-26T08:00:00Z',
    temperature: 34.5,
    soilMoisture: 38,
    ndvi: 0.61,
    humidity: 48,
    rainfall: 0,
    windSpeed: 22,
    latitude: -21.1704,
    longitude: -47.8103,
  },
  {
    id: 'r-006',
    timestamp: '2026-05-27T08:00:00Z',
    temperature: 35.8,
    soilMoisture: 32,
    ndvi: 0.57,
    humidity: 43,
    rainfall: 0,
    windSpeed: 25,
    latitude: -21.1704,
    longitude: -47.8103,
  },
  {
    id: 'r-007',
    timestamp: '2026-05-28T08:00:00Z',
    temperature: 36.4,
    soilMoisture: 28,
    ndvi: 0.53,
    humidity: 40,
    rainfall: 0,
    windSpeed: 28,
    latitude: -21.1704,
    longitude: -47.8103,
  },
];

// Alertas ativos
export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    farmId: 'farm-002',
    type: 'fire_risk',
    level: 'critical',
    title: '🔥 Alto Risco de Queimada',
    description: 'Temperatura acima de 38°C combinada com umidade abaixo de 30% e vento forte. Dados satelitais indicam foco de calor a 12km.',
    recommendation: 'Ative o sistema de irrigação imediatamente. Acione a equipe de brigada contra incêndio. Contate o Corpo de Bombeiros caso detecte fumaça.',
    timestamp: '2026-05-28T09:45:00Z',
    read: false,
  },
  {
    id: 'alert-002',
    farmId: 'farm-001',
    type: 'drought',
    level: 'warning',
    title: '💧 Estresse Hídrico Detectado',
    description: 'Umidade do solo caiu 34 pontos em 6 dias (62% → 28%). Sem previsão de chuva nos próximos 5 dias segundo dados INPE.',
    recommendation: 'Agende irrigação para as próximas 24h. Priorize zonas com NDVI abaixo de 0.55. Considere cobertura morta no solo.',
    timestamp: '2026-05-28T10:30:00Z',
    read: false,
  },
  {
    id: 'alert-003',
    farmId: 'farm-001',
    type: 'low_ndvi',
    level: 'warning',
    title: '🌿 Queda no Índice de Vegetação',
    description: 'NDVI reduziu de 0.72 para 0.53 em 7 dias. Possível início de estresse na lavoura de soja.',
    recommendation: 'Verifique visualmente a plantação. Considere análise foliar para descartar pragas ou deficiência nutricional.',
    timestamp: '2026-05-28T10:30:00Z',
    read: true,
  },
  {
    id: 'alert-004',
    farmId: 'farm-003',
    type: 'pest',
    level: 'ok',
    title: '✅ Monitoramento Normal',
    description: 'Todos os indicadores dentro dos limites ideais. Lavoura de café com boa saúde.',
    recommendation: 'Continue o monitoramento regular. Próxima leitura satelital prevista para amanhã.',
    timestamp: '2026-05-28T10:00:00Z',
    read: true,
  },
];

// Dados para o gráfico de temperatura (7 dias)
export const chartTemperature = {
  labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  values: [28.5, 30.1, 31.8, 33.2, 34.5, 35.8, 36.4],
};

// Dados para o gráfico de umidade do solo (7 dias)
export const chartSoilMoisture = {
  labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  values: [62, 58, 51, 44, 38, 32, 28],
};

// Dados para o gráfico de NDVI (7 dias)
export const chartNDVI = {
  labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  values: [0.72, 0.70, 0.68, 0.65, 0.61, 0.57, 0.53],
};

export const cropTypes = [
  'Soja', 'Milho', 'Café', 'Cana-de-açúcar', 'Algodão',
  'Arroz', 'Feijão', 'Trigo', 'Laranja', 'Manga', 'Outro',
];

export const brazilianStates = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR',
  'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
];
