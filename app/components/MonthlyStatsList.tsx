import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';

interface StatItemProps {
  label: string;
  value: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export const MonthlyStatsList: React.FC = () => {
  const { monthlyStats } = useApp();

  const sortedMonths = Object.keys(monthlyStats).sort((a, b) => b.localeCompare(a));

  return (
    <ScrollView style={styles.container}>
      {sortedMonths.map((month) => {
        const stats = monthlyStats[month];
        return (
          <View key={month} style={styles.monthContainer}>
            <Text style={styles.monthTitle}>{month}</Text>
            <StatItem
              label="Общий пробег"
              value={`${stats.totalMileage.toFixed(1)} км`}
            />
            <StatItem
              label="Заправлено топлива"
              value={`${stats.totalFuel.toFixed(1)} л`}
            />
            <StatItem
              label="Расход топлива"
              value={`${stats.fuelConsumption.toFixed(1)} л`}
            />
            <StatItem
              label="Средний расход на 100 км"
              value={`${stats.averageConsumption.toFixed(1)} л`}
            />
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  monthContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
}); 