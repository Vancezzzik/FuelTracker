import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';
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

const MonthlyStats: React.FC = () => {
  const { currentMonth, monthlyStats, settings, isDark } = useApp();
  const fontSizes = useFontSizes();

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
        isDark={isDark}
        fontSizes={fontSizes}
      />
      <StatsItem
        label="Заправлено бензина за месяц"
        value={`${formatFuel(stats.totalFuel)} л`}
        isDark={isDark}
        fontSizes={fontSizes}
      />
      <StatsItem
        label="Использовано бензина за месяц"
        value={`${formatFuel(fuelUsed)} л`}
        isDark={isDark}
        fontSizes={fontSizes}
      />
      {settings.showAnalytics && (
        <>
          <View style={styles.divider} />
          <StatsItem
            label="Общая стоимость топлива"
            value={`${formatNumber(stats.totalCost || 0)} ₽`}
            isDark={isDark}
            fontSizes={fontSizes}
          />
          <StatsItem
            label="Средняя цена за литр"
            value={`${formatFuel(stats.averageFuelPrice || 0)} ₽`}
            isDark={isDark}
            fontSizes={fontSizes}
          />
          <StatsItem
            label="Стоимость 100 км пробега"
            value={`${formatNumber(stats.costPer100km || 0)} ₽`}
            isDark={isDark}
            fontSizes={fontSizes}
          />
        </>
      )}
    </View>
  );
};

export default MonthlyStats;

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
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
});