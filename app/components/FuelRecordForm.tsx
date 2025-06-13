import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { useFontSizes } from '../hooks/useFontSizes';
import { FuelRecord } from '../types';
import DatePicker from './DatePicker';

interface FuelRecordFormProps {
  initialData?: FuelRecord;
  onSubmit: () => void;
}

const FuelRecordForm: React.FC<FuelRecordFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const { addRecord, updateRecord, settings } = useApp();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const fontSizes = useFontSizes();
  const { date: selectedDate } = useLocalSearchParams<{ date: string }>();

  const [date, setDate] = useState(initialData?.date || selectedDate || new Date().toISOString().split('T')[0]);
  const [totalMileage, setTotalMileage] = useState(
    initialData?.totalMileage?.toString() || ''
  );
  const [fuelAmount, setFuelAmount] = useState(
    initialData?.fuelAmount?.toString() || ''
  );
  const [fuelPrice, setFuelPrice] = useState(
    initialData?.fuelPrice?.toString() || (settings.defaultFuelPrice ?? 0).toString() || ''
  );
  
  // Расчет общей стоимости
  const totalCost = !isNaN(parseFloat(fuelAmount)) && !isNaN(parseFloat(fuelPrice))
    ? parseFloat(fuelAmount) * parseFloat(fuelPrice)
    : 0;

  const handleSubmit = async () => {
    const record = {
      date,
      totalMileage: parseFloat(totalMileage),
      fuelAmount: parseFloat(fuelAmount),
      fuelPrice: parseFloat(fuelPrice),
      totalCost: totalCost,
    };

    if (initialData) {
      await updateRecord({ ...record, id: initialData.id });
    } else {
      await addRecord(record);
    }

    onSubmit();
  };

  const isValid =
    date &&
    totalMileage &&
    fuelAmount &&
    fuelPrice &&
    !isNaN(parseFloat(totalMileage)) &&
    !isNaN(parseFloat(fuelAmount)) &&
    !isNaN(parseFloat(fuelPrice));

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.label, isDark && styles.labelDark, { fontSize: fontSizes.medium }]}>Дата</Text>
      <DatePicker value={date} onChange={setDate} />
      
      <Text style={[styles.label, isDark && styles.labelDark, { fontSize: fontSizes.medium }]}>Общий пробег (км)</Text>
      <TextInput
        style={[styles.input, isDark && styles.inputDark]}
        value={totalMileage}
        onChangeText={setTotalMileage}
        keyboardType="numeric"
        placeholder="0.0"
        placeholderTextColor={isDark ? '#666' : '#999'}
      />

      <Text style={[styles.label, isDark && styles.labelDark, { fontSize: fontSizes.medium }]}>Количество топлива (л)</Text>
      <TextInput
        style={[styles.input, isDark && styles.inputDark]}
        value={fuelAmount}
        onChangeText={setFuelAmount}
        keyboardType="numeric"
        placeholder="0.0"
        placeholderTextColor={isDark ? '#666' : '#999'}
      />

      <Text style={[styles.label, isDark && styles.labelDark, { fontSize: fontSizes.medium }]}>Цена за литр (₽)</Text>
      <TextInput
        style={[styles.input, isDark && styles.inputDark]}
        value={fuelPrice}
        onChangeText={setFuelPrice}
        keyboardType="numeric"
        placeholder="0.0"
        placeholderTextColor={isDark ? '#666' : '#999'}
      />

      <Text style={[styles.label, isDark && styles.labelDark, { fontSize: fontSizes.medium }]}>Общая стоимость:</Text>
      <Text style={[styles.totalCost, isDark && styles.totalCostDark, { fontSize: fontSizes.large }]}>
        {totalCost.toFixed(2)} ₽
      </Text>

      <Button
        title={initialData ? 'Обновить' : 'Добавить'}
        onPress={handleSubmit}
        disabled={!isValid}
      />
    </View>
  );
};

export default FuelRecordForm;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  containerDark: {
    backgroundColor: '#2a2a2a',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: '#666',
    marginBottom: 8,
  },
  labelDark: {
    color: '#999',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  inputDark: {
    borderColor: '#444',
    color: '#fff',
    backgroundColor: '#1a1a1a',
  },
  totalCost: {
    fontWeight: 'bold',
    color: '#333',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
    marginBottom: 16,
  },
  totalCostDark: {
    color: '#fff',
    borderColor: '#444',
    backgroundColor: '#333',
  },
});