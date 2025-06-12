import React from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useApp } from '../context/AppContext';

export const MonthTitle: React.FC = () => {
  const { currentMonth } = useApp();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getMonthName = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    
    return date.toLocaleString('ru-RU', { 
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>
        {getMonthName(currentMonth)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  titleDark: {
    color: '#fff',
  },
}); 