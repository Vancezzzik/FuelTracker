import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { FuelRecord } from '../types';

interface FuelRecordItemProps {
  record: FuelRecord;
  onPress: (record: FuelRecord) => void;
}

const formatDisplayDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');
  return `${day}.${month}.${year}`;
};

const FuelRecordItem: React.FC<FuelRecordItemProps> = ({ record, onPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.recordItem,
        isDark && styles.recordItemDark,
        pressed && styles.recordItemPressed,
      ]}
      onPress={() => onPress(record)}
    >
      <View style={styles.recordHeader}>
        <Text style={[styles.date, isDark && styles.dateDark]}>
          {formatDisplayDate(record.date)}
        </Text>
        <Text style={[styles.mileage, isDark && styles.mileageDark]}>
          {record.totalMileage} км
        </Text>
      </View>
      <Text style={[styles.fuelAmount, isDark && styles.fuelAmountDark]}>
        {record.fuelAmount} л
      </Text>
    </Pressable>
  );
};

interface FuelRecordsListProps {
  onRecordPress: (record: FuelRecord) => void;
}

export const FuelRecordsList: React.FC<FuelRecordsListProps> = ({
  onRecordPress,
}) => {
  const { records, currentMonth } = useApp();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const filteredRecords = records
    .filter((record) => record.date.startsWith(currentMonth))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <FlatList
        data={filteredRecords}
        renderItem={({ item }) => (
          <FuelRecordItem record={item} onPress={onRecordPress} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
  },
  listContent: {
    padding: 16,
  },
  recordItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recordItemDark: {
    backgroundColor: '#2a2a2a',
    shadowColor: '#fff',
  },
  recordItemPressed: {
    opacity: 0.7,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dateDark: {
    color: '#fff',
  },
  mileage: {
    fontSize: 16,
    color: '#666',
  },
  mileageDark: {
    color: '#999',
  },
  fuelAmount: {
    fontSize: 14,
    color: '#666',
  },
  fuelAmountDark: {
    color: '#999',
  },
}); 