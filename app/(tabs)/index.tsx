import Analytics from '@app/components/Analytics';
import CurrentDate from '@app/components/CurrentDate';
import DailyStats from '@app/components/DailyStats';
import MonthlyStats from '@app/components/MonthlyStats';
import MonthTitle from '@app/components/MonthTitle';
import TotalMileageCard from '@app/components/TotalMileageCard';
import { StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';

export default function TabOneScreen() {
  const { isDark } = useApp();

  return (
    <ScrollView 
      style={[styles.container, isDark && styles.containerDark]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <TotalMileageCard />
      <MonthTitle />
      <MonthlyStats />
      <Analytics />
      <CurrentDate />
      <DailyStats />
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
});
