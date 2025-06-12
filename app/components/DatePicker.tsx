import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleDayPress = (day: any) => {
    onChange(day.dateString);
    setIsVisible(false);
  };

  // Форматируем дату для отображения
  const formatDisplayDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.button, isDark && styles.buttonDark]}
        onPress={() => setIsVisible(true)}
      >
        <Text style={[styles.buttonText, isDark && styles.buttonTextDark]}>
          {formatDisplayDate(value)}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={{
                [value]: { selected: true, selectedColor: '#2089dc' },
              }}
              theme={{
                calendarBackground: isDark ? '#2a2a2a' : '#fff',
                textSectionTitleColor: isDark ? '#fff' : '#333',
                selectedDayBackgroundColor: '#2089dc',
                selectedDayTextColor: '#fff',
                todayTextColor: '#2089dc',
                dayTextColor: isDark ? '#fff' : '#333',
                textDisabledColor: isDark ? '#666' : '#999',
                monthTextColor: isDark ? '#fff' : '#333',
              }}
            />
            <TouchableOpacity
              style={[styles.closeButton, isDark && styles.closeButtonDark]}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#fff',
  },
  buttonDark: {
    borderColor: '#444',
    backgroundColor: '#1a1a1a',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  buttonTextDark: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 8,
    padding: 16,
  },
  modalContentDark: {
    backgroundColor: '#2a2a2a',
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#2089dc',
    borderRadius: 4,
    alignItems: 'center',
  },
  closeButtonDark: {
    backgroundColor: '#1a6cbb',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 