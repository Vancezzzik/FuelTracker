import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import React from 'react';
import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useApp } from '../context/AppContext';

export default function StatsScreen() {
  const { records = [], monthlyStats = {}, settings } = useApp();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      {/* Общая статистика */}
      {totalStats && (
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.cardTitle, isDark && styles.textLight]}>
            Общая статистика
          </Text>
          <Text style={[styles.dateRange, isDark && styles.textLight]}>
            {formatDisplayDate(totalStats.firstDate)} - {formatDisplayDate(totalStats.lastDate)}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, isDark && styles.textLight]}>
                {formatNumber(totalStats.totalMileage)} км
              </Text>
              <Text style={[styles.statLabel, isDark && styles.textGray]}>
                Общий пробег
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, isDark && styles.textLight]}>
                {formatNumber(totalStats.totalFuel, true)} л
              </Text>
              <Text style={[styles.statLabel, isDark && styles.textGray]}>
                Всего топлива
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, isDark && styles.textLight]}>
                {formatNumber(totalStats.averageConsumption, true)} л/100км
              </Text>
              <Text style={[styles.statLabel, isDark && styles.textGray]}>
                Средний расход
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Статистика по месяцам */}
      {sortedMonths.map(month => {
        const stats = monthlyStats[month];
        if (!stats || stats.totalMileage === 0) return null;

        const [year, monthNum] = month.split('-');
        const monthDate = new Date(parseInt(year), parseInt(monthNum) - 1);

        return (
          <View key={month} style={[styles.card, isDark && styles.cardDark]}>
            <Text style={[styles.cardTitle, isDark && styles.textLight]}>
              {format(monthDate, 'LLLL yyyy', { locale: ru })}
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, isDark && styles.textLight]}>
                  {formatNumber(stats.totalMileage)} км
                </Text>
                <Text style={[styles.statLabel, isDark && styles.textGray]}>
                  Пробег
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, isDark && styles.textLight]}>
                  {formatNumber(stats.totalFuel, true)} л
                </Text>
                <Text style={[styles.statLabel, isDark && styles.textGray]}>
                  Топливо
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, isDark && styles.textLight]}>
                  {formatNumber(stats.averageConsumption, true)} л/100км
                </Text>
                <Text style={[styles.statLabel, isDark && styles.textGray]}>
                  Расход
                </Text>
              </View>
            </View>
          </View>
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
    backgroundColor: '#1a1a1a',
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
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardDark: {
    backgroundColor: '#2a2a2a',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dateRange: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  textLight: {
    color: '#fff',
  },
  textGray: {
    color: '#999',
  },
}); 