import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';

const TotalMileageCard: React.FC = () => {
  const { settings, monthlyStats, currentMonth, isDark } = useApp();

  const formatNumber = (num: number, withDecimals: boolean = false) => {
    // Округляем число до нужной точности
    const roundedNum = withDecimals ? num : Math.round(num);
    // Преобразуем в строку с фиксированным количеством десятичных знаков
    const numStr = withDecimals ? roundedNum.toFixed(2) : roundedNum.toString();
    // Разделяем на целую и дробную части
    const [wholePart, decimalPart] = numStr.split('.');
    // Форматируем целую часть с разделителями тысяч
    const formattedWholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    // Возвращаем отформатированное число
    return decimalPart ? `${formattedWholePart}.${decimalPart}` : formattedWholePart;
  };

  const currentMonthStats = monthlyStats[currentMonth];
  const remainingLimit = currentMonthStats?.remainingFuelLimit ?? settings.monthlyFuelLimit;

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={[styles.label, isDark && styles.labelDark]}>Общий пробег</Text>
          <Text style={[styles.value, isDark && styles.valueDark]}>
            {formatNumber(settings.totalMileage)} км
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.column}>
          <Text style={[styles.label, isDark && styles.labelDark]}>
            Остаток лимита
          </Text>
          <Text style={[
            styles.value,
            isDark && styles.valueDark,
            remainingLimit === 0 && styles.limitExceeded,
            remainingLimit < settings.monthlyFuelLimit * 0.2 && styles.limitWarning
          ]}>
            {formatNumber(remainingLimit, true)} л
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TotalMileageCard;

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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#ddd',
    marginHorizontal: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  labelDark: {
    color: '#999',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  valueDark: {
    color: '#fff',
  },
  limitWarning: {
    color: '#ffc107',
  },
  limitExceeded: {
    color: '#dc3545',
  },
}); 