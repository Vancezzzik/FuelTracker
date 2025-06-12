import CurrentDate from '@app/components/CurrentDate';
import DailyStats from '@app/components/DailyStats';
import MonthlyStats from '@app/components/MonthlyStats';
import MonthTitle from '@app/components/MonthTitle';
import TotalMileageCard from '@app/components/TotalMileageCard';
import { StyleSheet, View } from 'react-native';
import { useApp } from '../context/AppContext';

export default function TabOneScreen() {
  const { isDark } = useApp();

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <TotalMileageCard />
      <MonthTitle />
      <MonthlyStats />
      <CurrentDate />
      <DailyStats />
    </View>
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
});
