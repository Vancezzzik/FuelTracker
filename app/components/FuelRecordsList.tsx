import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
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
  const { isDark } = useApp();

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
      <View style={styles.recordDetails}>
        <Text style={[styles.fuelAmount, isDark && styles.fuelAmountDark]}>
          {record.fuelAmount} л
        </Text>
        {record.fuelPrice && (
          <Text style={[styles.fuelPrice, isDark && styles.fuelPriceDark]}>
            {record.fuelPrice} ₽/л
          </Text>
        )}
        {record.totalCost && (
          <Text style={[styles.totalCost, isDark && styles.totalCostDark]}>
            {record.totalCost.toFixed(2)} ₽
          </Text>
        )}
      </View>
    </Pressable>
  );
};

interface FuelRecordsListProps {
  onRecordPress: (record: FuelRecord) => void;
}

const FuelRecordsList: React.FC<FuelRecordsListProps> = ({
  onRecordPress,
}) => {
  const { records, currentMonth, isDark } = useApp();

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

export default FuelRecordsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#1A1A1A',
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
    backgroundColor: '#222222',
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
  recordDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  fuelPrice: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  fuelPriceDark: {
    color: '#999',
  },
  totalCost: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0a7ea4',
    marginLeft: 'auto',
  },
  totalCostDark: {
    color: '#fff',
  },
});