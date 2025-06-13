// Типы для записей о заправке
export interface FuelRecord {
  id: string;
  date: string;
  totalMileage: number;
  dailyMileage: number;
  fuelAmount: number;
  fuelPrice: number; // Цена за литр топлива
  totalCost: number; // Общая стоимость заправки
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
  totalCost: number; // Общая стоимость топлива за месяц
  averageFuelPrice: number; // Средняя цена за литр топлива
  costPer100km: number; // Стоимость 100 км пробега
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
  defaultFuelPrice: number; // Цена топлива по умолчанию
  monthlyBudget: number; // Месячный бюджет на топливо
  showAnalytics: boolean; // Показывать ли аналитику
  fontSize: 'normal' | 'medium' | 'large'; // Размер шрифта
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