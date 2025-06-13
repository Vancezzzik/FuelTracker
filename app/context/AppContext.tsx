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
  defaultFuelPrice: 50, // Цена топлива по умолчанию (50 руб/л)
  monthlyBudget: 5000, // Месячный бюджет на топливо (5000 руб)
  showAnalytics: true, // Показывать аналитику по умолчанию
  fontSize: 'normal', // Размер шрифта по умолчанию
};

const DEFAULT_STATE: AppState = {
  records: [],
  currentMonth: format(new Date(), 'yyyy-MM'),
  monthlyStats: {},
  settings: DEFAULT_SETTINGS,
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const systemColorScheme = useColorScheme();

  // Определяем текущую тему на основе настроек
  const currentTheme = state.settings.theme === 'system' ? systemColorScheme : state.settings.theme;
  const isDark = currentTheme === 'dark';

  const addRecord = async (record: Omit<FuelRecord, 'id'>) => {
    try {
      // Если dailyMileage уже задан, используем его, иначе рассчитываем
      let dailyMileage = record.dailyMileage || 0;
      
      if (!record.dailyMileage && record.totalMileage) {
        // Рассчитываем dailyMileage на основе totalMileage только если он не задан
        const sortedRecords = [...state.records].sort((a, b) => a.date.localeCompare(b.date));
        const previousRecord = sortedRecords.find(r => r.date < record.date && r.totalMileage);
        
        if (previousRecord && previousRecord.totalMileage) {
          dailyMileage = record.totalMileage - previousRecord.totalMileage;
        } else {
          dailyMileage = record.totalMileage;
        }
      }
      
      const newRecord = { ...record, dailyMileage, id: Date.now().toString() };
      const updatedRecords = [...state.records, newRecord];
      
      // Добавляем определение recordMonth
      const recordMonth = record.date.substring(0, 7);
      
      // ДОБАВИТЬ: Обновляем общий пробег в настройках
      const newTotalMileage = state.settings.totalMileage + dailyMileage;
      const updatedSettings = {
        ...state.settings,
        totalMileage: newTotalMileage
      };
      
      const updatedState: AppState = {
        ...state,
        records: updatedRecords,
        settings: updatedSettings // Обновляем настройки
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
  
      const deletedDailyMileage = recordToDelete.dailyMileage || 0;
      const recordMonth = recordToDelete.date.substring(0, 7);
  
      // Создаем новый массив записей без удаляемой
      const updatedRecords = state.records.filter(record => record.id !== id);
  
      // ДОБАВИТЬ: Обновляем общий пробег в настройках
      const newTotalMileage = state.settings.totalMileage - deletedDailyMileage;
      const updatedSettings = {
        ...state.settings,
        totalMileage: Math.max(0, newTotalMileage) // Не даем пробегу стать отрицательным
      };
  
      // Создаем обновленное состояние
      const updatedState: AppState = {
        ...state,
        records: updatedRecords,
        settings: updatedSettings
      };
  
      // Обновляем состояние
      setState(updatedState);
  
      // Сохраняем данные
      await saveData(updatedState);
  
      // Пересчитываем статистику для месяца удаленной записи
      calculateMonthStats(recordMonth, updatedRecords);
      
      // ИСПРАВЛЕНИЕ: Также пересчитываем статистику для текущего месяца, если он отличается
      if (recordMonth !== state.currentMonth) {
        calculateMonthStats(state.currentMonth, updatedRecords);
      }
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

          // Расчет общей стоимости топлива
          const totalCost = monthRecords.reduce((sum: number, record: FuelRecord) => {
            // Если у записи есть totalCost, используем его, иначе рассчитываем на основе цены и количества
            if (record.totalCost) {
              return sum + record.totalCost;
            } else if (record.fuelPrice && record.fuelAmount) {
              return sum + (record.fuelPrice * record.fuelAmount);
            } else if (record.fuelAmount) {
              // Если нет цены, используем цену по умолчанию
              return sum + (newSettings.defaultFuelPrice * record.fuelAmount);
            }
            return sum;
          }, 0);

          // Расчет средней цены за литр
          const averageFuelPrice = totalFuel > 0 ? totalCost / totalFuel : newSettings.defaultFuelPrice;

          // Расчет стоимости 100 км пробега
          const costPer100km = totalMileage > 0 ? (totalCost / totalMileage) * 100 : 0;

          updatedMonthlyStats[month] = {
            totalMileage,
            totalFuel,
            fuelConsumption,
            averageConsumption: totalMileage > 0 ? (fuelConsumption / totalMileage) * 100 : 0,
            startFuel,
            endFuel: startFuel + totalFuel - fuelConsumption,
            remainingFuelLimit,
            totalCost,
            averageFuelPrice,
            costPer100km,
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
      
      // Если нет записей за месяц, устанавливаем нулевые значения
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
              startFuel: prev.settings.currentFuelAmount, // ИСПРАВЛЕНО: используем prev.settings
              endFuel: prev.settings.currentFuelAmount,   // ИСПРАВЛЕНО: используем prev.settings
              remainingFuelLimit: prev.settings.monthlyFuelLimit, // ИСПРАВЛЕНО: используем prev.settings
              totalCost: 0,
              averageFuelPrice: prev.settings.defaultFuelPrice, // ИСПРАВЛЕНО: используем prev.settings
              costPer100km: 0,
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

      // Расчет общей стоимости топлива
      const totalCost = monthRecords.reduce((sum: number, record: FuelRecord) => {
        // Если у записи есть totalCost, используем его, иначе рассчитываем на основе цены и количества
        if (record.totalCost) {
          return sum + record.totalCost;
        } else if (record.fuelPrice && record.fuelAmount) {
          return sum + (record.fuelPrice * record.fuelAmount);
        } else if (record.fuelAmount) {
          // Если нет цены, используем цену по умолчанию
          return sum + (state.settings.defaultFuelPrice * record.fuelAmount);
        }
        return sum;
      }, 0);

      // Расчет средней цены за литр
      const averageFuelPrice = totalFuel > 0 ? totalCost / totalFuel : state.settings.defaultFuelPrice;

      // Расчет стоимости 100 км пробега
      const costPer100km = totalMileage > 0 ? (totalCost / totalMileage) * 100 : 0;

      const stats: MonthlyStats = {
        totalMileage,
        totalFuel,
        fuelConsumption: totalFuel,
        averageConsumption,
        startFuel: sortedRecords[0].fuelAmount,
        endFuel: sortedRecords[sortedRecords.length - 1].fuelAmount,
        remainingFuelLimit,
        totalCost,
        averageFuelPrice,
        costPer100km,
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
      throw error;
    }
  };

  const getLastRecord = () => {
    if (state.records.length === 0) return undefined;
    return state.records[state.records.length - 1];
  };

  const updateRecord = async (record: FuelRecord) => {
    try {
      const recordIndex = state.records.findIndex(r => r.id === record.id);
      if (recordIndex === -1) {
        console.warn('Record not found:', record.id);
        return;
      }
  
      const oldRecord = state.records[recordIndex];
      const oldDailyMileage = oldRecord.dailyMileage || 0;
      
      // Рассчитываем dailyMileage на основе totalMileage
      let dailyMileage = 0;
      if (record.totalMileage) {
        // Находим предыдущую запись по дате (исключая текущую обновляемую)
        const otherRecords = state.records.filter(r => r.id !== record.id);
        const sortedRecords = [...otherRecords].sort((a, b) => a.date.localeCompare(b.date));
        const previousRecord = sortedRecords.find(r => r.date < record.date && r.totalMileage);
        
        if (previousRecord && previousRecord.totalMileage) {
          dailyMileage = record.totalMileage - previousRecord.totalMileage;
        } else {
          // Если нет предыдущей записи, используем totalMileage как dailyMileage
          dailyMileage = record.totalMileage;
        }
      }
  
      const updatedRecords = [...state.records];
      updatedRecords[recordIndex] = { ...record, dailyMileage };
  
      // ДОБАВИТЬ: Обновляем общий пробег в настройках
      const mileageDifference = dailyMileage - oldDailyMileage;
      const newTotalMileage = state.settings.totalMileage + mileageDifference;
      const updatedSettings = {
        ...state.settings,
        totalMileage: newTotalMileage
      };
  
      const updatedState: AppState = {
        ...state,
        records: updatedRecords,
        settings: updatedSettings
      };
  
      // Обновляем состояние
      setState(updatedState);
  
      // Сохраняем данные
      await saveData(updatedState);
  
      // Пересчитываем статистику
      calculateMonthStats(record.date.substring(0, 7), updatedRecords);
    } catch (error) {
      console.error('Error updating record:', error);
      throw error;
    }
  };

  const recalculateDailyMileage = (records: FuelRecord[]): FuelRecord[] => {
    const sortedRecords = [...records].sort((a, b) => a.date.localeCompare(b.date));
    
    return sortedRecords.map((record, index) => {
      if (!record.totalMileage) {
        return { ...record, dailyMileage: 0 };
      }
      
      if (index === 0) {
        // Первая запись - используем totalMileage как dailyMileage
        return { ...record, dailyMileage: record.totalMileage };
      }
      
      // Находим предыдущую запись с totalMileage
      const previousRecord = sortedRecords.slice(0, index).reverse().find(r => r.totalMileage);
      
      if (previousRecord && previousRecord.totalMileage) {
        const dailyMileage = record.totalMileage - previousRecord.totalMileage;
        return { ...record, dailyMileage: Math.max(0, dailyMileage) };
      } else {
        return { ...record, dailyMileage: record.totalMileage };
      }
    });
  };

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsedData = JSON.parse(data);
        
        // Пересчитываем dailyMileage для всех записей
        const recalculatedRecords = recalculateDailyMileage(parsedData.records || []);
        
        const updatedState = {
          ...parsedData,
          records: recalculatedRecords
        };
        
        setState(updatedState);
        
        // Сохраняем обновленные данные
        if (recalculatedRecords.length > 0) {
          await saveData(updatedState);
          
          // Пересчитываем статистику для всех месяцев
          const months = Array.from(new Set(recalculatedRecords.map(r => r.date.substring(0, 7))));
          months.forEach(month => {
            calculateMonthStats(month, recalculatedRecords);
          });
        }
        
        // ИСПРАВЛЕНИЕ: Всегда инициализируем статистику для текущего месяца
        const currentMonth = format(new Date(), 'yyyy-MM');
        calculateMonthStats(currentMonth, recalculatedRecords);
      } else {
        // ИСПРАВЛЕНИЕ: Если данных нет, инициализируем статистику для текущего месяца
        const currentMonth = format(new Date(), 'yyyy-MM');
        calculateMonthStats(currentMonth, []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async (newState: AppState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const contextValue: AppContextType = {
    ...state,
    addRecord,
    updateRecord,
    deleteRecord,
    setCurrentMonth,
    calculateMonthStats,
    updateSettings,
    getLastRecord,
    isDark,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};