import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useApp } from '../context/AppContext';

const FuelCalendar: React.FC = () => {
  const router = useRouter();
  const { records, setCurrentMonth, currentMonth, isDark } = useApp();
  const [key, setKey] = useState(0);

  // Принудительное обновление календаря при изменении темы
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [isDark]);

  const markedDates = records.reduce((acc, record) => {
    acc[record.date] = { marked: true, dotColor: '#2089dc' };
    return acc;
  }, {} as Record<string, { marked: boolean; dotColor: string }>);

  const handleMonthChange = (month: any) => {
    const monthStr = format(new Date(month.timestamp), 'yyyy-MM');
    setCurrentMonth(monthStr);
  };

  const handleDayPress = (day: any) => {
    router.push({
      pathname: '/record/[date]',
      params: { date: day.dateString }
    } as any);
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Calendar
        key={key}
        onMonthChange={handleMonthChange}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{
          calendarBackground: isDark ? '#2a2a2a' : '#fff',
          textSectionTitleColor: isDark ? '#fff' : '#333',
          selectedDayBackgroundColor: '#2089dc',
          selectedDayTextColor: '#fff',
          todayTextColor: '#2089dc',
          dayTextColor: isDark ? '#fff' : '#333',
          textDisabledColor: isDark ? '#666' : '#999',
          monthTextColor: isDark ? '#fff' : '#333',
          arrowColor: isDark ? '#fff' : '#333',
          dotColor: '#2089dc',
          todayBackgroundColor: isDark ? '#404040' : '#e6e6e6',
        }}
      />
    </View>
  );
};

export default FuelCalendar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  containerDark: {
    backgroundColor: '#2a2a2a',
    shadowOpacity: 0.2,
  },
}); 