import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { useApp } from '../context/AppContext';

export default function RecordScreen() {
  const { date } = useLocalSearchParams();
  const router = useRouter();
  const { records, addRecord, updateRecord, deleteRecord } = useApp();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const existingRecord = records.find((r) => r.date === date);
  const [dailyMileage, setDailyMileage] = React.useState(
    existingRecord?.dailyMileage.toString() || ''
  );
  const [fuelAmount, setFuelAmount] = React.useState(
    existingRecord?.fuelAmount.toString() || ''
  );

  const handleSave = async () => {
    const recordData = {
      date: date as string,
      dailyMileage: parseFloat(dailyMileage) || 0,
      fuelAmount: parseFloat(fuelAmount) || 0,
    };

    if (existingRecord) {
      await updateRecord({ 
        ...recordData, 
        id: existingRecord.id, 
        totalMileage: existingRecord.totalMileage 
      });
    } else {
      await addRecord({ 
        ...recordData, 
        totalMileage: 0 // Будет пересчитано в контексте
      });
    }
    router.back();
  };

  const handleDelete = async () => {
    try {
      if (existingRecord) {
        await deleteRecord(existingRecord.id);
      }
      router.back();
    } catch (error) {
      console.error('Error deleting record:', error);
      // Здесь можно добавить отображение ошибки пользователю
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.card, isDark && styles.cardDark]}>
        <Text style={[styles.date, isDark && styles.textLight]}>
          {new Date(date as string).toLocaleDateString('ru-RU')}
        </Text>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, isDark && styles.textLight]}>
            Пробег за сутки (км)
          </Text>
          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            value={dailyMileage}
            onChangeText={setDailyMileage}
            keyboardType="numeric"
            placeholder="Введите пробег за сутки"
            placeholderTextColor={isDark ? '#666' : '#999'}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, isDark && styles.textLight]}>
            Заправлено топлива (л)
          </Text>
          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            value={fuelAmount}
            onChangeText={setFuelAmount}
            keyboardType="numeric"
            placeholder="Введите количество топлива"
            placeholderTextColor={isDark ? '#666' : '#999'}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}>
            <Text style={styles.buttonText}>Сохранить</Text>
          </TouchableOpacity>

          {existingRecord && (
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}>
              <Text style={styles.buttonText}>Удалить</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardDark: {
    backgroundColor: '#2a2a2a',
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    color: '#333',
  },
  inputDark: {
    borderColor: '#444',
    color: '#fff',
    backgroundColor: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#2089dc',
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textLight: {
    color: '#fff',
  },
}); 