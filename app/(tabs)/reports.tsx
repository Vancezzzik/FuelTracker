import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Analytics from '../components/Analytics';
import DailyStats from '../components/DailyStats';
import MonthlyStats from '../components/MonthlyStats';
import TotalMileageCard from '../components/TotalMileageCard';
import { useApp } from '../context/AppContext';
import { useFontSizes } from '../hooks/useFontSizes';

/**
 * Экран статистики и отчетов
 * Отображает аналитику расходов на топливо
 */
export default function StatsScreen() {
  const { isDark } = useApp();
  const fontSizes = useFontSizes();

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.card, isDark && styles.cardDark]}>
        <Text style={[styles.cardTitle, isDark && styles.cardTitleDark, { fontSize: fontSizes.title }]}>Отчеты</Text>
      </View>
      
      {/* Общий пробег */}
      <TotalMileageCard />
      
      {/* Аналитика расходов */}
      <Analytics />
      
      {/* Статистика за месяц */}
      <MonthlyStats />
      
      {/* Статистика за день */}
      <DailyStats />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  containerDark: {
    backgroundColor: '#1A1A1A',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardDark: {
    backgroundColor: '#2a2a2a',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  cardTitleDark: {
    color: '#fff',
  },
});