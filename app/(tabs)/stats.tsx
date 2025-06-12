import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import DailyStats from '../components/DailyStats';
import MonthHeader from '../components/MonthHeader';
import MonthlyStats from '../components/MonthlyStats';
import TotalMileageCard from '../components/TotalMileageCard';
import { useApp } from '../context/AppContext';

export default function StatsScreen() {
  const { records = [], monthlyStats = {}, settings, isDark } = useApp();
  const [key, setKey] = React.useState(0);

  // Обновляем ключ при изменении темы
  React.useEffect(() => {
    setKey((prev: number) => prev + 1);
  }, [isDark]);

  // Добавляем отладочный вывод
  React.useEffect(() => {
    console.log('Current theme isDark:', isDark);
  }, [isDark]);

  // Рассчитываем общую статистику
  const totalStats = React.useMemo(() => {
    if (!records || records.length === 0) return null;

    const sortedRecords = [...records].sort((a, b) => a.date.localeCompare(b.date));
    
    // Используем общий пробег из настроек
    const totalMileage = settings.totalMileage;
    const totalFuel = records.reduce((sum, record) => sum + record.fuelAmount, 0);
    const averageConsumption = totalMileage > 0 ? (totalFuel / totalMileage) * 100 : 0;

    return {
      totalMileage,
      totalFuel,
      averageConsumption,
      firstDate: sortedRecords[0].date,
      lastDate: sortedRecords[sortedRecords.length - 1].date,
    };
  }, [records, settings.totalMileage]);

  // Сортируем месяцы в обратном порядке
  const sortedMonths = React.useMemo(() => {
    if (!monthlyStats) return [];
    
    return Object.keys(monthlyStats)
      .sort((a, b) => b.localeCompare(a))
      .filter(month => monthlyStats[month] && monthlyStats[month].totalMileage > 0);
  }, [monthlyStats]);

  const formatNumber = (num: number, withDecimals: boolean = false) => {
    // Округляем число до нужной точности
    const roundedNum = withDecimals ? num : Math.round(num);
    // Преобразуем в строку с фиксированным количеством десятичных знаков
    const numStr = withDecimals ? roundedNum.toFixed(1) : roundedNum.toString();
    // Разделяем на целую и дробную части
    const [wholePart, decimalPart] = numStr.split('.');
    // Форматируем целую часть с разделителями тысяч
    const formattedWholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    // Возвращаем отформатированное число
    return decimalPart ? `${formattedWholePart}.${decimalPart}` : formattedWholePart;
  };

  const formatDisplayDate = (date: string) => {
    return format(new Date(date), 'd MMMM yyyy', { locale: ru });
  };

  if (!records || records.length === 0) {
    return (
      <View style={[styles.container, isDark && styles.containerDark, styles.emptyContainer]}>
        <Ionicons 
          name="analytics-outline" 
          size={64} 
          color={isDark ? '#666' : '#ccc'} 
        />
        <Text style={[styles.emptyTitle, isDark && styles.textLight]}>
          Нет данных для статистики
        </Text>
        <Text style={[styles.emptyText, isDark && styles.textGray]}>
          Добавьте записи о заправках, чтобы увидеть статистику расхода топлива
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      key={key}
      style={[styles.container, isDark && styles.containerDark]}
      contentContainerStyle={styles.contentContainer}
    >
      <TotalMileageCard />

      {sortedMonths.map(month => {
        const stats = monthlyStats[month];
        if (!stats || stats.totalMileage === 0) return null;

        const [year, monthNum] = month.split('-');
        const monthDate = new Date(parseInt(year), parseInt(monthNum) - 1);

        return (
          <React.Fragment key={month}>
            <MonthHeader date={monthDate} />
            <MonthlyStats />
            <DailyStats />
          </React.Fragment>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#1A1A1A',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  textLight: {
    color: '#fff',
  },
  textGray: {
    color: '#999',
  },
});