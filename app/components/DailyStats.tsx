import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { DailyStats as DailyStatsType } from '../types';
import { useFontSizes } from '../hooks/useFontSizes';

interface StatsItemProps {
  label: string;
  value: string;
  isDark: boolean;
  fontSizes: ReturnType<typeof useFontSizes>;
}

const StatsItem: React.FC<StatsItemProps> = ({ label, value, isDark, fontSizes }) => {
  return (
    <View style={styles.statsItem}>
      <Text style={[styles.label, isDark && styles.labelDark, { fontSize: fontSizes.medium }]}>{label}</Text>
      <Text style={[styles.value, isDark && styles.valueDark, { fontSize: fontSizes.large }]}>{value}</Text>
    </View>
  );
};

const DailyStats: React.FC = () => {
  const { records, settings, isDark } = useApp();
  const fontSizes = useFontSizes();
  const [stats, setStats] = useState<DailyStatsType>({
    startMileage: 0,
    endMileage: 0,
    dailyMileage: 0,
    fuelAdded: 0,
    startFuel: 0,
    endFuel: 0,
    fuelUsed: 0,
  });

  useEffect(() => {
    calculateDailyStats();
  }, [records, settings]);

  const calculateDailyStats = () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Получаем все записи до сегодняшнего дня
    const previousRecords = records.filter(r => r.date < today);
    // Получаем записи за сегодня
    const todayRecords = records.filter(r => r.date === today);
    
    // Рассчитываем общий расход топлива за все предыдущие дни
    const previousTotalFuelUsed = previousRecords.reduce((sum, r) => 
      sum + (r.dailyMileage * settings.fuelConsumptionPer100km) / 100, 0);
    
    // Рассчитываем общее количество заправленного топлива за все предыдущие дни
    const previousTotalFuelAdded = previousRecords.reduce((sum, r) => 
      sum + r.fuelAmount, 0);
    
    // Суммируем заправки за сегодня
    const todayFuelAdded = todayRecords.reduce((sum, r) => sum + r.fuelAmount, 0);
    
    // Суммируем пробег за сегодня
    const todayMileage = todayRecords.reduce((sum, r) => sum + r.dailyMileage, 0);
    
    // Расчет расхода топлива за сегодня
    const todayFuelUsed = (todayMileage * settings.fuelConsumptionPer100km) / 100;
    
    const startMileage = settings.totalMileage - todayMileage;
    const endMileage = settings.totalMileage;
    
    // Расчет остатка топлива на начало дня
    // Берем текущий остаток из настроек, добавляем все предыдущие заправки и вычитаем весь предыдущий расход
    const startFuel = Math.max(0, settings.currentFuelAmount + previousTotalFuelAdded - previousTotalFuelUsed);
    
    // Расчет остатка на конец дня
    // К остатку на начало дня добавляем сегодняшние заправки и вычитаем сегодняшний расход
    const endFuel = Math.max(0, startFuel + todayFuelAdded - todayFuelUsed);

    setStats({
      startMileage,
      endMileage,
      dailyMileage: todayMileage,
      fuelAdded: todayFuelAdded,
      startFuel,
      endFuel,
      fuelUsed: todayFuelUsed,
    });
  };

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const formatFuel = (liters: number) => {
    return liters.toFixed(3);
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <StatsItem
        label="Пробег на начало дня"
        value={`${formatNumber(stats.startMileage)} км`}
        isDark={isDark}
        fontSizes={fontSizes}
      />
      <StatsItem
        label="Заправлено бензина сегодня"
        value={`${formatFuel(stats.fuelAdded)} л`}
        isDark={isDark}
        fontSizes={fontSizes}
      />
      <StatsItem
        label="Остаток бензина на начало дня"
        value={`${formatFuel(stats.startFuel)} л`}
        isDark={isDark}
        fontSizes={fontSizes}
      />
      <StatsItem
        label="Остаток бензина на конец дня"
        value={`${formatFuel(stats.endFuel)} л`}
        isDark={isDark}
        fontSizes={fontSizes}
      />
      <StatsItem
        label="Расход бензина за сегодня"
        value={`${formatFuel(stats.fuelUsed)} л`}
        isDark={isDark}
        fontSizes={fontSizes}
      />
      <StatsItem
        label="Пробег на конец дня"
        value={`${formatNumber(stats.endMileage)} км`}
        isDark={isDark}
        fontSizes={fontSizes}
      />
      <StatsItem
        label="Пробег за сегодня"
        value={`${formatNumber(stats.dailyMileage)} км`}
        isDark={isDark}
        fontSizes={fontSizes}
      />
    </View>
  );
};

export default DailyStats;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  containerDark: {
    backgroundColor: '#2a2a2a',
  },
  statsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  labelDark: {
    color: '#999',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  valueDark: {
    color: '#fff',
  },
});