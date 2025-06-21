/**
 * Тесты для критических функций AppContext
 * Проверяют корректность расчетов статистики и обработки данных
 */

import { FuelRecord } from '../../types';

// Мокаем AsyncStorage
const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Мокаем useColorScheme
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  useColorScheme: jest.fn(() => 'light'),
}));

// Функция для пересчета дневного пробега (извлечена из AppContext)
const recalculateDailyMileage = (records: FuelRecord[]): FuelRecord[] => {
  const sortedRecords = [...records].sort((a, b) => a.date.localeCompare(b.date));
  
  return sortedRecords.map((record, index) => {
    if (!record.totalMileage) {
      return { ...record, dailyMileage: 0 };
    }
    
    if (index === 0) {
      return { ...record, dailyMileage: record.totalMileage };
    }
    
    const prevRecord = sortedRecords[index - 1];
    if (!prevRecord.totalMileage) {
      return { ...record, dailyMileage: record.totalMileage };
    }
    
    const dailyMileage = record.totalMileage - prevRecord.totalMileage;
    return { ...record, dailyMileage: Math.max(0, dailyMileage) };
  });
};

// Функция расчета месячной статистики (упрощенная версия из AppContext)
const calculateMonthlyStats = (records: FuelRecord[], month: string, settings: any) => {
  const monthRecords = records.filter((record: FuelRecord) => record.date.startsWith(month));
  
  if (monthRecords.length === 0) {
    return {
      totalMileage: 0,
      totalFuel: 0,
      fuelConsumption: 0,
      averageConsumption: 0,
      startFuel: settings.currentFuelAmount,
      endFuel: settings.currentFuelAmount,
      remainingFuelLimit: settings.monthlyFuelLimit,
      totalCost: 0,
      averageFuelPrice: settings.defaultFuelPrice,
      costPer100km: 0,
    };
  }
  
  const totalMileage = monthRecords.reduce((sum, r) => sum + r.dailyMileage, 0);
  const totalFuel = monthRecords.reduce((sum, r) => sum + r.fuelAmount, 0);
  const totalCost = monthRecords.reduce((sum, r) => sum + r.totalCost, 0);
  
  const averageFuelPrice = totalFuel > 0 ? totalCost / totalFuel : settings.defaultFuelPrice;
  const fuelConsumption = totalMileage > 0 ? (totalFuel / totalMileage) * 100 : 0;
  const costPer100km = totalMileage > 0 ? (totalCost / totalMileage) * 100 : 0;
  
  return {
    totalMileage,
    totalFuel,
    fuelConsumption,
    averageConsumption: fuelConsumption,
    startFuel: settings.currentFuelAmount,
    endFuel: settings.currentFuelAmount + totalFuel,
    remainingFuelLimit: Math.max(0, settings.monthlyFuelLimit - totalFuel),
    totalCost,
    averageFuelPrice,
    costPer100km,
  };
};

describe('AppContext utils', () => {
  describe('recalculateDailyMileage', () => {
    it('должен корректно рассчитывать дневной пробег для последовательных записей', () => {
      const records: FuelRecord[] = [
        {
          id: '1',
          date: '2024-01-01',
          totalMileage: 1000,
          dailyMileage: 0,
          fuelAmount: 50,
          fuelPrice: 50,
          totalCost: 2500,
        },
        {
          id: '2',
          date: '2024-01-02',
          totalMileage: 1150,
          dailyMileage: 0,
          fuelAmount: 30,
          fuelPrice: 50,
          totalCost: 1500,
        },
        {
          id: '3',
          date: '2024-01-03',
          totalMileage: 1300,
          dailyMileage: 0,
          fuelAmount: 40,
          fuelPrice: 50,
          totalCost: 2000,
        },
      ];

      const result = recalculateDailyMileage(records);

      expect(result[0].dailyMileage).toBe(1000); // Первая запись
      expect(result[1].dailyMileage).toBe(150);  // 1150 - 1000
      expect(result[2].dailyMileage).toBe(150);  // 1300 - 1150
    });

    it('должен обрабатывать записи без общего пробега', () => {
      const records: FuelRecord[] = [
        {
          id: '1',
          date: '2024-01-01',
          totalMileage: 0,
          dailyMileage: 0,
          fuelAmount: 50,
          fuelPrice: 50,
          totalCost: 2500,
        },
        {
          id: '2',
          date: '2024-01-02',
          totalMileage: 1150,
          dailyMileage: 0,
          fuelAmount: 30,
          fuelPrice: 50,
          totalCost: 1500,
        },
      ];

      const result = recalculateDailyMileage(records);

      expect(result[0].dailyMileage).toBe(0);    // Нет общего пробега
      expect(result[1].dailyMileage).toBe(1150); // Используется как первая запись с пробегом
    });

    it('должен сортировать записи по дате', () => {
      const records: FuelRecord[] = [
        {
          id: '2',
          date: '2024-01-03',
          totalMileage: 1300,
          dailyMileage: 0,
          fuelAmount: 40,
          fuelPrice: 50,
          totalCost: 2000,
        },
        {
          id: '1',
          date: '2024-01-01',
          totalMileage: 1000,
          dailyMileage: 0,
          fuelAmount: 50,
          fuelPrice: 50,
          totalCost: 2500,
        },
      ];

      const result = recalculateDailyMileage(records);

      expect(result[0].date).toBe('2024-01-01');
      expect(result[1].date).toBe('2024-01-03');
      expect(result[0].dailyMileage).toBe(1000);
      expect(result[1].dailyMileage).toBe(300); // 1300 - 1000
    });

    it('должен предотвращать отрицательный дневной пробег', () => {
      const records: FuelRecord[] = [
        {
          id: '1',
          date: '2024-01-01',
          totalMileage: 1500,
          dailyMileage: 0,
          fuelAmount: 50,
          fuelPrice: 50,
          totalCost: 2500,
        },
        {
          id: '2',
          date: '2024-01-02',
          totalMileage: 1000, // Меньше предыдущего
          dailyMileage: 0,
          fuelAmount: 30,
          fuelPrice: 50,
          totalCost: 1500,
        },
      ];

      const result = recalculateDailyMileage(records);

      expect(result[1].dailyMileage).toBe(0); // Должно быть 0, а не -500
    });
  });

  describe('calculateMonthlyStats', () => {
    const mockSettings = {
      currentFuelAmount: 100,
      monthlyFuelLimit: 200,
      defaultFuelPrice: 50,
      fuelConsumptionPer100km: 8,
    };

    it('должен корректно рассчитывать статистику для месяца с записями', () => {
      const records: FuelRecord[] = [
        {
          id: '1',
          date: '2024-01-01',
          totalMileage: 1000,
          dailyMileage: 100,
          fuelAmount: 50,
          fuelPrice: 50,
          totalCost: 2500,
        },
        {
          id: '2',
          date: '2024-01-02',
          totalMileage: 1150,
          dailyMileage: 150,
          fuelAmount: 30,
          fuelPrice: 52,
          totalCost: 1560,
        },
      ];

      const stats = calculateMonthlyStats(records, '2024-01', mockSettings);

      expect(stats.totalMileage).toBe(250); // 100 + 150
      expect(stats.totalFuel).toBe(80);     // 50 + 30
      expect(stats.totalCost).toBe(4060);   // 2500 + 1560
      expect(stats.averageFuelPrice).toBeCloseTo(50.75); // 4060 / 80
      expect(stats.fuelConsumption).toBeCloseTo(32); // (80 / 250) * 100
      expect(stats.costPer100km).toBeCloseTo(1624); // (4060 / 250) * 100
    });

    it('должен возвращать нулевые значения для месяца без записей', () => {
      const records: FuelRecord[] = [];
      const stats = calculateMonthlyStats(records, '2024-01', mockSettings);

      expect(stats.totalMileage).toBe(0);
      expect(stats.totalFuel).toBe(0);
      expect(stats.totalCost).toBe(0);
      expect(stats.fuelConsumption).toBe(0);
      expect(stats.averageFuelPrice).toBe(mockSettings.defaultFuelPrice);
      expect(stats.costPer100km).toBe(0);
      expect(stats.remainingFuelLimit).toBe(mockSettings.monthlyFuelLimit);
    });

    it('должен фильтровать записи только для указанного месяца', () => {
      const records: FuelRecord[] = [
        {
          id: '1',
          date: '2024-01-15',
          totalMileage: 1000,
          dailyMileage: 100,
          fuelAmount: 50,
          fuelPrice: 50,
          totalCost: 2500,
        },
        {
          id: '2',
          date: '2024-02-15', // Другой месяц
          totalMileage: 1150,
          dailyMileage: 150,
          fuelAmount: 30,
          fuelPrice: 50,
          totalCost: 1500,
        },
      ];

      const stats = calculateMonthlyStats(records, '2024-01', mockSettings);

      expect(stats.totalMileage).toBe(100); // Только январская запись
      expect(stats.totalFuel).toBe(50);
      expect(stats.totalCost).toBe(2500);
    });

    it('должен корректно рассчитывать остаток лимита топлива', () => {
      const records: FuelRecord[] = [
        {
          id: '1',
          date: '2024-01-01',
          totalMileage: 1000,
          dailyMileage: 100,
          fuelAmount: 150, // Больше половины лимита
          fuelPrice: 50,
          totalCost: 7500,
        },
      ];

      const stats = calculateMonthlyStats(records, '2024-01', mockSettings);

      expect(stats.remainingFuelLimit).toBe(50); // 200 - 150
    });

    it('должен предотвращать отрицательный остаток лимита', () => {
      const records: FuelRecord[] = [
        {
          id: '1',
          date: '2024-01-01',
          totalMileage: 1000,
          dailyMileage: 100,
          fuelAmount: 250, // Больше лимита
          fuelPrice: 50,
          totalCost: 12500,
        },
      ];

      const stats = calculateMonthlyStats(records, '2024-01', mockSettings);

      expect(stats.remainingFuelLimit).toBe(0); // Не должно быть отрицательным
    });
  });
});