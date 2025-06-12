import React from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useApp } from '../context/AppContext';

interface StatsItemProps {
  label: string;
  value: string;
}

const StatsItem: React.FC<StatsItemProps> = ({ label, value }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.statsItem}>
      <Text style={[styles.label, isDark && styles.labelDark]}>{label}</Text>
      <Text style={[styles.value, isDark && styles.valueDark]}>{value}</Text>
    </View>
  );
};

export const MonthlyStats: React.FC = () => {
  const { currentMonth, monthlyStats, settings } = useApp();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const stats = monthlyStats[currentMonth] || {
    totalMileage: 0,
    totalFuel: 0,
    fuelConsumption: 0,
    averageConsumption: 0,
    startFuel: 0,
    endFuel: 0,
  };

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const formatFuel = (liters: number) => {
    return liters.toFixed(2);
  };

  // Расчет использованного топлива на основе пробега и среднего расхода
  const fuelUsed = (stats.totalMileage * settings.fuelConsumptionPer100km) / 100;

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <StatsItem
        label="Пробег за месяц"
        value={`${formatNumber(Math.max(0, stats.totalMileage))} км`}
      />
      <StatsItem
        label="Заправлено бензина за месяц"
        value={`${formatFuel(stats.totalFuel)} л`}
      />
      <StatsItem
        label="Использовано бензина за месяц"
        value={`${formatFuel(fuelUsed)} л`}
      />
    </View>
  );
};

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