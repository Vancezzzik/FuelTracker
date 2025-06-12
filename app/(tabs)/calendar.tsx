import { AddRecordButton } from '@app/components/AddRecordButton';
import { FuelCalendar } from '@app/components/FuelCalendar';
import { StyleSheet, View } from 'react-native';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <FuelCalendar />
      <AddRecordButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 