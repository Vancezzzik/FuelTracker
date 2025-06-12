// Типы для записей о заправке
export interface FuelRecord {
  id: string;
  date: string;
  totalMileage: number;
  dailyMileage: number;
  fuelAmount: number;
}

// Типы для месячной статистики
export interface MonthlyStats {
  totalMileage: number;
  totalFuel: number;
  fuelConsumption: number;
  averageConsumption: number;
  startFuel: number;
  endFuel: number;
  remainingFuelLimit: number; // Остаток от месячного лимита
}

// Типы для ежедневной статистики
export interface DailyStats {
  startMileage: number;
  endMileage: number;
  dailyMileage: number;
  fuelAdded: number;
  startFuel: number;
  endFuel: number;
  fuelUsed: number;
}

// Типы для настроек приложения
export interface AppSettings {
  fuelConsumptionPer100km: number;
  totalMileage: number; // Общий пробег автомобиля
  currentFuelAmount: number;
  theme: 'system' | 'light' | 'dark';
  monthlyFuelLimit: number; // Лимит бензина на месяц
}

// Типы для состояния приложения
export interface AppState {
  records: FuelRecord[];
  currentMonth: string;
  monthlyStats: Record<string, MonthlyStats>;
  settings: AppSettings;
}

export interface AppContextType {
  isDark: boolean;
  addRecord: (record: Omit<FuelRecord, 'id'>) => Promise<void>;
  updateRecord: (record: FuelRecord) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  calculateMonthStats: (month: string, records?: FuelRecord[]) => void;
  updateSettings: (settings: AppSettings) => Promise<void>;
  currentMonth: string;
  monthlyStats: { [key: string]: MonthlyStats };
  records: FuelRecord[];
  settings: AppSettings;
}

// Пустой объект для экспорта по умолчанию
export default {}; 