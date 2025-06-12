import { CurrentDate } from '@app/components/CurrentDate';
import { DailyStats } from '@app/components/DailyStats';
import { MonthlyStats } from '@app/components/MonthlyStats';
import { MonthTitle } from '@app/components/MonthTitle';
import { TotalMileageCard } from '@app/components/TotalMileageCard';
import { StyleSheet, View } from 'react-native';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
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
  },
});
