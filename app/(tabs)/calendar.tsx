import AddRecordButton from '@app/components/AddRecordButton';
import FuelCalendar from '@app/components/FuelCalendar';
import { StyleSheet, View } from 'react-native';
import { useApp } from '../context/AppContext';

export default function CalendarScreen() {
  const { isDark } = useApp();

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <FuelCalendar />
      <AddRecordButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 16,
  },
  containerDark: {
    backgroundColor: '#1A1A1A',
  },
});