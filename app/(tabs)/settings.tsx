import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, SafeAreaView } from 'react-native';
import Toast from 'react-native-toast-message';
import { useApp } from '../context/AppContext';

export default function SettingsScreen() {
  const { settings, updateSettings, isDark } = useApp();

  const [consumption, setConsumption] = useState(
    (settings.fuelConsumptionPer100km ?? 0).toString()
  );
  const [totalMileage, setTotalMileage] = useState(
    (settings.totalMileage ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  );
  const [currentFuel, setCurrentFuel] = useState(
    (settings.currentFuelAmount ?? 0).toString()
  );
  const [monthlyFuelLimit, setMonthlyFuelLimit] = useState(
    (settings.monthlyFuelLimit ?? 0).toString()
  );
  const [defaultFuelPrice, setDefaultFuelPrice] = useState(
    (settings.defaultFuelPrice ?? 0).toString()
  );
  const [monthlyBudget, setMonthlyBudget] = useState(
    (settings.monthlyBudget ?? 0).toString()
  );

  const showSuccessToast = (message: string) => {
    Toast.show({
      type: 'success',
      text1: 'Сохранено',
      text2: message,
      position: 'bottom',
      visibilityTime: 2000,
    });
  };

  const handleSaveConsumption = async () => {
    try {
      Keyboard.dismiss();
      await updateSettings({
        ...settings,
        fuelConsumptionPer100km: parseFloat(consumption) || 0,
      });
      showSuccessToast('Средний расход успешно обновлен');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'Не удалось сохранить средний расход',
        position: 'bottom',
      });
    }
  };

  const handleSaveTotalMileage = async () => {
    try {
      Keyboard.dismiss();
      const cleanedTotalMileage = totalMileage.replace(/\s/g, '');
      await updateSettings({
        ...settings,
        totalMileage: parseFloat(cleanedTotalMileage) || 0,
      });
      showSuccessToast('Общий пробег успешно обновлен');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'Не удалось сохранить общий пробег',
        position: 'bottom',
      });
    }
  };

  const handleSaveCurrentFuel = async () => {
    try {
      Keyboard.dismiss();
      await updateSettings({
        ...settings,
        currentFuelAmount: parseFloat(currentFuel) || 0,
      });
      showSuccessToast('Текущий остаток топлива успешно обновлен');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'Не удалось сохранить текущий остаток топлива',
        position: 'bottom',
      });
    }
  };

  const handleSaveMonthlyLimit = async () => {
    try {
      Keyboard.dismiss();
      await updateSettings({
        ...settings,
        monthlyFuelLimit: parseFloat(monthlyFuelLimit) || 0,
      });
      showSuccessToast('Месячный лимит топлива успешно обновлен');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'Не удалось сохранить месячный лимит топлива',
        position: 'bottom',
      });
    }
  };

  const handleSaveDefaultFuelPrice = async () => {
    try {
      Keyboard.dismiss();
      await updateSettings({
        ...settings,
        defaultFuelPrice: parseFloat(defaultFuelPrice) || 0,
      });
      showSuccessToast('Цена топлива по умолчанию успешно обновлена');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'Не удалось сохранить цену топлива по умолчанию',
        position: 'bottom',
      });
    }
  };

  const handleSaveMonthlyBudget = async () => {
    try {
      Keyboard.dismiss();
      await updateSettings({
        ...settings,
        monthlyBudget: parseFloat(monthlyBudget) || 0,
      });
      showSuccessToast('Месячный бюджет успешно обновлен');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'Не удалось сохранить месячный бюджет',
        position: 'bottom',
      });
    }
  };

  const handleToggleAnalytics = async () => {
    try {
      await updateSettings({
        ...settings,
        showAnalytics: !settings.showAnalytics,
      });
      showSuccessToast(
        `Аналитика ${!settings.showAnalytics ? 'включена' : 'отключена'}`
      );
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'Не удалось изменить настройку аналитики',
        position: 'bottom',
        visibilityTime: 3000,
      });
    }
  };

  const handleFontSizeChange = async (fontSize: 'normal' | 'medium' | 'large') => {
    try {
      await updateSettings({
        ...settings,
        fontSize,
      });
      const sizeNames = {
        normal: 'обычный',
        medium: 'средний',
        large: 'крупный'
      };
      showSuccessToast(`Размер шрифта изменен на ${sizeNames[fontSize]}`);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'Не удалось изменить размер шрифта',
        position: 'bottom',
        visibilityTime: 3000,
      });
    }
  };

  const handleThemeChange = async (theme: 'system' | 'light' | 'dark') => {
    try {
      await updateSettings({
        ...settings,
        theme,
      });
      showSuccessToast('Тема оформления успешно обновлена');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'Не удалось изменить тему оформления',
        position: 'bottom',
      });
    }
  };

  const handleTotalMileageChange = (text: string) => {
    const cleanNum = text.replace(/[^\d]/g, '');
    
    if (!cleanNum) {
      setTotalMileage('');
      return;
    }

    const formatted = cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    setTotalMileage(formatted);
  };

  const handleCurrentFuelChange = (text: string) => {
    const value = text.replace(',', '.');
    if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
      setCurrentFuel(value);
    }
  };

  const handleDefaultFuelPriceChange = (text: string) => {
    const value = text.replace(',', '.');
    if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
      setDefaultFuelPrice(value);
    }
  };

  const handleMonthlyBudgetChange = (text: string) => {
    const value = text.replace(',', '.');
    if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
      setMonthlyBudget(value);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, isDark && styles.textLight]}>
            Средний расход на 100 км
          </Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={consumption}
              onChangeText={setConsumption}
              keyboardType="numeric"
              placeholder="Введите средний расход"
              placeholderTextColor={isDark ? '#666' : '#999'}
            />
            <TouchableOpacity
              style={[styles.saveButton, styles.smallButton]}
              onPress={handleSaveConsumption}
            >
              <Text style={styles.buttonText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, isDark && styles.textLight]}>
            Общий пробег (км)
          </Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={totalMileage}
              onChangeText={handleTotalMileageChange}
              keyboardType="numeric"
              placeholder="Введите общий пробег"
              placeholderTextColor={isDark ? '#666' : '#999'}
            />
            <TouchableOpacity
              style={[styles.saveButton, styles.smallButton]}
              onPress={handleSaveTotalMileage}
            >
              <Text style={styles.buttonText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, isDark && styles.textLight]}>
            Текущий остаток топлива (л)
          </Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={currentFuel}
              onChangeText={handleCurrentFuelChange}
              keyboardType="numeric"
              placeholder="Введите текущий остаток топлива"
              placeholderTextColor={isDark ? '#666' : '#999'}
            />
            <TouchableOpacity
              style={[styles.saveButton, styles.smallButton]}
              onPress={handleSaveCurrentFuel}
            >
              <Text style={styles.buttonText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, isDark && styles.textLight]}>
            Месячный лимит топлива (л)
          </Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={monthlyFuelLimit}
              onChangeText={setMonthlyFuelLimit}
              keyboardType="numeric"
              placeholder="Введите месячный лимит топлива"
              placeholderTextColor={isDark ? '#666' : '#999'}
            />
            <TouchableOpacity
              style={[styles.saveButton, styles.smallButton]}
              onPress={handleSaveMonthlyLimit}
            >
              <Text style={styles.buttonText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, isDark && styles.textLight]}>
            Цена топлива по умолчанию (руб/л)
          </Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={defaultFuelPrice}
              onChangeText={handleDefaultFuelPriceChange}
              keyboardType="numeric"
              placeholder="Введите цену топлива по умолчанию"
              placeholderTextColor={isDark ? '#666' : '#999'}
            />
            <TouchableOpacity
              style={[styles.saveButton, styles.smallButton]}
              onPress={handleSaveDefaultFuelPrice}
            >
              <Text style={styles.buttonText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, isDark && styles.textLight]}>
            Месячный бюджет (руб)
          </Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={monthlyBudget}
              onChangeText={handleMonthlyBudgetChange}
              keyboardType="numeric"
              placeholder="Введите месячный бюджет"
              placeholderTextColor={isDark ? '#666' : '#999'}
            />
            <TouchableOpacity
              style={[styles.saveButton, styles.smallButton]}
              onPress={handleSaveMonthlyBudget}
            >
              <Text style={styles.buttonText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, isDark && styles.textLight]}>
            Показывать аналитику
          </Text>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              settings.showAnalytics && styles.toggleButtonActive,
            ]}
            onPress={handleToggleAnalytics}
          >
            <Text
              style={[
                styles.toggleButtonText,
                settings.showAnalytics && styles.toggleButtonTextActive,
              ]}
            >
              {settings.showAnalytics ? 'Включена' : 'Отключена'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.themeContainer}>
          <Text style={[styles.label, isDark && styles.textLight]}>
            Размер шрифта
          </Text>
          <View style={styles.themeButtons}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                settings.fontSize === 'normal' && styles.activeThemeButton,
              ]}
              onPress={() => handleFontSizeChange('normal')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  settings.fontSize === 'normal' && styles.activeThemeButtonText,
                ]}
              >
                Обычный
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                settings.fontSize === 'medium' && styles.activeThemeButton,
              ]}
              onPress={() => handleFontSizeChange('medium')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  settings.fontSize === 'medium' && styles.activeThemeButtonText,
                ]}
              >
                Средний
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                settings.fontSize === 'large' && styles.activeThemeButton,
              ]}
              onPress={() => handleFontSizeChange('large')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  settings.fontSize === 'large' && styles.activeThemeButtonText,
                ]}
              >
                Крупный
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.themeContainer}>
          <Text style={[styles.label, isDark && styles.textLight]}>
            Тема оформления
          </Text>
          <View style={styles.themeButtons}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                settings.theme === 'system' && styles.activeThemeButton,
              ]}
              onPress={() => handleThemeChange('system')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  settings.theme === 'system' && styles.activeThemeButtonText,
                ]}
              >
                Системная
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                settings.theme === 'light' && styles.activeThemeButton,
              ]}
              onPress={() => handleThemeChange('light')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  settings.theme === 'light' && styles.activeThemeButtonText,
                ]}
              >
                Светлая
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                settings.theme === 'dark' && styles.activeThemeButton,
              ]}
              onPress={() => handleThemeChange('dark')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  settings.theme === 'dark' && styles.activeThemeButtonText,
                ]}
              >
                Тёмная
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#f5f5f5',
  },
  toggleButtonActive: {
    backgroundColor: '#2089dc',
    borderColor: '#2089dc',
  },
  toggleButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  toggleButtonTextActive: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardDark: {
    backgroundColor: '#222222',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  textLight: {
    color: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  inputDark: {
    borderColor: '#444',
    backgroundColor: '#333',
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#2089dc',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
  },
  smallButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  themeContainer: {
    marginTop: 16,
  },
  themeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  themeButton: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeThemeButton: {
    backgroundColor: '#2089dc',
    borderColor: '#2089dc',
  },
  themeButtonText: {
    color: '#333',
  },
  activeThemeButtonText: {
    color: '#fff',
  },
});