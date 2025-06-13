import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { useFontSizes } from '../hooks/useFontSizes';

interface AnalyticsItemProps {
  label: string;
  value: string;
  isDark: boolean;
  isHighlight?: boolean;
  fontSizes: ReturnType<typeof useFontSizes>;
}

const AnalyticsItem: React.FC<AnalyticsItemProps> = ({ label, value, isDark, isHighlight = false, fontSizes }) => (
  <View style={[styles.analyticsItem, isHighlight && (isDark ? styles.highlightItemDark : styles.highlightItem)]}>
    <Text style={[styles.label, isDark && styles.labelDark, { fontSize: fontSizes.medium }]}>{label}</Text>
    <Text style={[
      styles.value, 
      isDark && styles.valueDark,
      isHighlight && (isDark ? styles.highlightValueDark : styles.highlightValue),
      { fontSize: fontSizes.large }
    ]}>
      {value}
    </Text>
  </View>
);

const formatNumber = (num: number | undefined): string => {
  if (num === undefined || isNaN(num)) return "0.00";
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const formatFuel = (fuel: number | undefined): string => {
  if (fuel === undefined || isNaN(fuel)) return "0.0";
  return fuel.toFixed(1);
};

export default function Analytics() {
  const { monthlyStats, currentMonth, settings, isDark } = useApp();
  const fontSizes = useFontSizes();

  if (!settings.showAnalytics) {
    return null;
  }

  // Получаем статистику для текущего месяца
  const currentMonthStats = monthlyStats[currentMonth];
  
  const totalCost = currentMonthStats?.totalCost || 0;
  const budgetRemaining = settings.monthlyBudget - totalCost;
  const budgetUsedPercent = settings.monthlyBudget > 0 
    ? (totalCost / settings.monthlyBudget * 100)
    : 0;

  const totalMileage = currentMonthStats?.totalMileage || 0;
  const totalFuel = currentMonthStats?.totalFuel || 0;
  const averageFuelPrice = currentMonthStats?.averageFuelPrice || 0;
  const costPer100km = currentMonthStats?.costPer100km || 0;
  
  const fuelEfficiency = totalMileage > 0 && totalFuel > 0
    ? (totalMileage / totalFuel)
    : 0;

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.titleDark, { fontSize: fontSizes.title }]}>Аналитика расходов</Text>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark, { fontSize: fontSizes.large }]}>Финансы</Text>
        
        <AnalyticsItem
          label="Общие расходы за месяц"
          value={`${formatNumber(totalCost)} ₽`}
          isDark={isDark}
          fontSizes={fontSizes}
        />
        
        <AnalyticsItem
          label="Средняя цена за литр"
          value={`${formatFuel(averageFuelPrice)} ₽`}
          isDark={isDark}
          fontSizes={fontSizes}
        />
        
        <AnalyticsItem
          label="Стоимость 100 км"
          value={`${formatNumber(costPer100km)} ₽`}
          isDark={isDark}
          fontSizes={fontSizes}
        />
        
        {settings.monthlyBudget > 0 && (
          <>
            <AnalyticsItem
              label="Остаток бюджета"
              value={`${formatNumber(budgetRemaining)} ₽`}
              isDark={isDark}
              isHighlight={budgetRemaining < 0}
              fontSizes={fontSizes}
            />
            
            <AnalyticsItem
              label="Использовано бюджета"
              value={`${formatNumber(budgetUsedPercent)}%`}
              isDark={isDark}
              isHighlight={budgetUsedPercent > 100}
              fontSizes={fontSizes}
            />
          </>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark, { fontSize: fontSizes.large }]}>Эффективность</Text>
        
        <AnalyticsItem
          label="Километров на литр"
          value={`${formatFuel(fuelEfficiency)} км/л`}
          isDark={isDark}
          fontSizes={fontSizes}
        />
        
        <AnalyticsItem
          label="Заправлено топлива"
          value={`${formatFuel(totalFuel)} л`}
          isDark={isDark}
          fontSizes={fontSizes}
        />
        
        <AnalyticsItem
          label="Пройдено километров"
          value={`${formatNumber(Math.max(0, totalMileage))} км`}
          isDark={isDark}
          fontSizes={fontSizes}
        />
      </View>
    </View>
  );
}

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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  titleDark: {
    color: '#fff',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 4,
  },
  sectionTitleDark: {
    color: '#ccc',
    borderBottomColor: '#555',
  },
  analyticsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginVertical: 2,
    borderRadius: 4,
  },
  highlightItem: {
    backgroundColor: '#e3f2fd',
  },
  highlightItemDark: {
    backgroundColor: '#1565c0',
  },
  label: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  labelDark: {
    color: '#999',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  valueDark: {
    color: '#fff',
  },
  highlightValue: {
    color: '#d32f2f',
  },
  highlightValueDark: {
    color: '#fff',
  },
});