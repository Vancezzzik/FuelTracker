import { AppSettings, AppState, FuelRecord, MonthlyStats } from '@app/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

interface AppContextType extends AppState {
  addRecord: (record: Omit<FuelRecord, 'id'>) => Promise<void>;
  updateRecord: (record: FuelRecord) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  setCurrentMonth: (month: string) => void;
  calculateMonthStats: (month: string) => void;
  updateSettings: (settings: AppSettings) => Promise<void>;
  getLastRecord: () => FuelRecord | undefined;
  isDark: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = '@fuel_tracker_data';
const DEFAULT_SETTINGS: AppSettings = {
  fuelConsumptionPer100km: 13,
  totalMileage: 0,
  currentFuelAmount: 0,
  theme: 'system',
  monthlyFuelLimit: 100,
};

const DEFAULT_STATE: AppState = {
  records: [],
  currentMonth: format(new Date(), 'yyyy-MM'),
  monthlyStats: {},
  settings: DEFAULT_SETTINGS,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const systemColorScheme = useColorScheme();

  // Определяем текущую тему на основе настроек
  const currentTheme = state.settings.theme === 'system' ? systemColorScheme : state.settings.theme;
  const isDark = currentTheme === 'dark';

  const addRecord = async (record: Omit<FuelRecord, 'id'>) => {
    try {
      const newRecord = { ...record, id: Date.now().toString() };
      const updatedRecords = [...state.records, newRecord];
      const recordMonth = record.date.substring(0, 7);

      const updatedState: AppState = {
        ...state,
        records: updatedRecords,
      };

      // Обновляем состояние
      setState(updatedState);

      // Сохраняем данные
      await saveData(updatedState);

      // Пересчитываем статистику
      calculateMonthStats(recordMonth, updatedRecords);
    } catch (error) {
      console.error('Error adding record:', error);
      throw error;
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      // Находим запись для определения месяца
      const recordToDelete = state.records.find(record => record.id === id);
      if (!recordToDelete) {
        console.warn('Record not found:', id);
        return;
      }

      // Получаем месяц удаляемой записи
      const recordMonth = recordToDelete.date.substring(0, 7);

      // Создаем новый массив записей без удаляемой
      const updatedRecords = state.records.filter(record => record.id !== id);

      // Создаем обновленное состояние
      const updatedState: AppState = {
        ...state,
        records: updatedRecords,
      };

      // Обновляем состояние
      setState(updatedState);

      // Сохраняем данные
      await saveData(updatedState);

      // Пересчитываем статистику
      calculateMonthStats(recordMonth, updatedRecords);
    } catch (error) {
      console.error('Error deleting record:', error);
      throw error;
    }
  };

  const updateSettings = async (newSettings: AppSettings) => {
    try {
      const updatedState: AppState = {
        ...state,
        settings: newSettings,
      };

      // Сохраняем данные
      await saveData(updatedState);

      // Обновляем состояние
      setState((prevState) => {
        // Пересчитываем статистику с новыми настройками
        const updatedMonthlyStats = { ...prevState.monthlyStats };
        const months = Array.from(
          new Set(prevState.records.map((r) => r.date.substring(0, 7)))
        );

        months.forEach((month) => {
          const monthRecords = prevState.records.filter(
            (r) => r.date.substring(0, 7) === month
          );

          // Рассчитываем статистику для месяца
          let totalMileage = 0;
          let totalFuel = 0;
          let startFuel = newSettings.currentFuelAmount;

          monthRecords.forEach((record) => {
            totalMileage += record.dailyMileage;
            totalFuel += record.fuelAmount;
          });

          // Расчет расхода топлива на основе нового значения среднего расхода
          const fuelConsumption = (totalMileage * newSettings.fuelConsumptionPer100km) / 100;
          
          // Расчет остатка лимита с новым значением месячного лимита
          const remainingFuelLimit = month === prevState.currentMonth 
            ? newSettings.monthlyFuelLimit - totalFuel
            : updatedMonthlyStats[month]?.remainingFuelLimit ?? newSettings.monthlyFuelLimit;

          updatedMonthlyStats[month] = {
            totalMileage,
            totalFuel,
            fuelConsumption,
            averageConsumption: totalMileage > 0 ? (fuelConsumption / totalMileage) * 100 : 0,
            startFuel,
            endFuel: startFuel + totalFuel - fuelConsumption,
            remainingFuelLimit,
          };
        });

        return {
          ...prevState,
          settings: newSettings,
          monthlyStats: updatedMonthlyStats,
        };
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  const setCurrentMonth = (month: string) => {
    setState(prev => ({
      ...prev,
      currentMonth: month,
    }));
  };

  const calculateMonthStats = (month: string, records: FuelRecord[] = state.records) => {
    try {
      const monthRecords = records.filter((record: FuelRecord) => record.date.startsWith(month));
      
      // Если нет записей за месяц, устанавливаем полный лимит
      if (monthRecords.length === 0) {
        setState((prev: AppState) => ({
          ...prev,
          monthlyStats: {
            ...prev.monthlyStats,
            [month]: {
              totalMileage: 0,
              totalFuel: 0,
              fuelConsumption: 0,
              averageConsumption: 0,
              startFuel: state.settings.currentFuelAmount,
              endFuel: state.settings.currentFuelAmount,
              remainingFuelLimit: state.settings.monthlyFuelLimit,
            },
          },
        }));
        return;
      }

      const sortedRecords = [...monthRecords].sort((a: FuelRecord, b: FuelRecord) => 
        a.date.localeCompare(b.date)
      );

      // Считаем общее количество заправленного топлива за месяц
      const totalFuel = monthRecords.reduce((sum: number, record: FuelRecord) => 
        sum + (record.fuelAmount || 0), 0
      );

      const totalMileage = monthRecords.reduce((sum: number, record: FuelRecord) => 
        sum + (record.dailyMileage || 0), 0
      );

      // Расчет среднего расхода
      const averageConsumption = totalMileage > 0 ? (totalFuel / totalMileage) * 100 : 0;

      // Расчет оставшегося лимита (не может быть меньше 0)
      const remainingFuelLimit = Math.max(0, state.settings.monthlyFuelLimit - totalFuel);

      const stats: MonthlyStats = {
        totalMileage,
        totalFuel,
        fuelConsumption: totalFuel,
        averageConsumption,
        startFuel: sortedRecords[0].fuelAmount,
        endFuel: sortedRecords[sortedRecords.length - 1].fuelAmount,
        remainingFuelLimit,
      };

      setState((prev: AppState) => ({
        ...prev,
        monthlyStats: {
          ...prev.monthlyStats,
          [month]: stats,
        },
      }));
    } catch (error) {
      console.error('Error calculating month stats:', error);
    }
  };

  const getLastRecord = () => {
    if (state.records.length === 0) return undefined;
    return [...state.records].sort((a, b) => b.date.localeCompare(a.date))[0];
  };

  const updateRecord = async (record: FuelRecord) => {
    try {
      const oldRecord = state.records.find(r => r.id === record.id);
      if (!oldRecord) {
        console.warn('Record not found:', record.id);
        return;
      }

      // Обновляем запись в массиве
      const updatedRecords = state.records.map(r => 
        r.id === record.id ? record : r
      );

      // Создаем обновленное состояние
      const updatedState: AppState = {
        ...state,
        records: updatedRecords,
      };

      // Обновляем состояние
      setState(updatedState);

      // Сохраняем данные
      await saveData(updatedState);

      // Пересчитываем статистику для месяца обновленной записи
      const recordMonth = record.date.substring(0, 7);
      calculateMonthStats(recordMonth, updatedRecords);

      // Если изменился месяц записи, пересчитываем статистику для старого месяца
      const oldMonth = oldRecord.date.substring(0, 7);
      if (oldMonth !== recordMonth) {
        calculateMonthStats(oldMonth, updatedRecords);
      }
    } catch (error) {
      console.error('Error updating record:', error);
      throw error;
    }
  };

  // Загрузка данных при монтировании
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsedData = JSON.parse(data) as AppState;
        const newState: AppState = {
          ...DEFAULT_STATE,
          ...parsedData,
          settings: {
            ...DEFAULT_SETTINGS,
            ...parsedData.settings,
          },
          monthlyStats: {},
        };
        setState(newState);

        // Пересчитываем статистику для всех месяцев после загрузки
        const months = Array.from(new Set(newState.records.map((r: FuelRecord) => r.date.substring(0, 7)))) as string[];
        months.forEach((month) => calculateMonthStats(month, newState.records));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async (newState: AppState) => {
    try {
      const dataToSave = JSON.stringify(newState);
      await AsyncStorage.setItem(STORAGE_KEY, dataToSave);
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  };

  // Создаем значение контекста
  const contextValue: AppContextType = {
    ...state,
    isDark,
    addRecord,
    updateRecord,
    deleteRecord,
    setCurrentMonth,
    calculateMonthStats,
    updateSettings,
    getLastRecord,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 