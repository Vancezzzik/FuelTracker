import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useApp } from '../context/AppContext';

export const FuelCalendar: React.FC = () => {
  const router = useRouter();
  const { records, setCurrentMonth, currentMonth } = useApp();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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
        }}
      />
    </View>
  );
};

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
  },
}); 