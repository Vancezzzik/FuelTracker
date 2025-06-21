import React, { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { DailyStatsRecord } from '../types';
import { useFontSizes } from '../hooks/useFontSizes';

interface DailyStatsModalProps {
  visible: boolean;
  date: string;
  onClose: () => void;
}

interface StatsItemProps {
  label: string;
  value: string;
  isDark: boolean;
  fontSizes: ReturnType<typeof useFontSizes>;
}

const StatsItem: React.FC<StatsItemProps> = ({ label, value, isDark, fontSizes }) => {
  return (
    <View style={styles.statsItem}>
      <Text style={[styles.label, isDark && styles.labelDark, { fontSize: fontSizes.medium }]}>
        {label}
      </Text>
      <Text style={[styles.value, isDark && styles.valueDark, { fontSize: fontSizes.large }]}>
        {value}
      </Text>
    </View>
  );
};

const DailyStatsModal: React.FC<DailyStatsModalProps> = ({ visible, date, onClose }) => {
  const { calculateDailyStats, getDailyStats, isDark } = useApp();
  const fontSizes = useFontSizes();
  const [stats, setStats] = useState<DailyStatsRecord | null>(null);

  useEffect(() => {
    if (visible && date) {
      // Рассчитываем статистику для указанной даты
      calculateDailyStats(date);
      // Получаем рассчитанную статистику
      const dailyStats = getDailyStats(date);
      setStats(dailyStats);
    }
  }, [visible, date]);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const formatFuel = (liters: number) => {
    return liters.toFixed(3);
  };

  const formatDisplayDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  if (!stats) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
            <Text style={[styles.title, isDark && styles.titleDark, { fontSize: fontSizes.xlarge }]}>
              Загрузка...
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
          <Text style={[styles.title, isDark && styles.titleDark, { fontSize: fontSizes.xlarge }]}>
            Статистика за {formatDisplayDate(date)}
          </Text>
          
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <StatsItem
              label="Пробег на начало дня"
              value={`${formatNumber(stats.startMileage)} км`}
              isDark={isDark}
              fontSizes={fontSizes}
            />
            <StatsItem
              label="Заправлено бензина сегодня"
              value={`${formatFuel(stats.fuelAdded)} л`}
              isDark={isDark}
              fontSizes={fontSizes}
            />
            <StatsItem
              label="Остаток бензина на начало дня"
              value={`${formatFuel(stats.startFuel)} л`}
              isDark={isDark}
              fontSizes={fontSizes}
            />
            <StatsItem
              label="Остаток бензина на конец дня"
              value={`${formatFuel(stats.endFuel)} л`}
              isDark={isDark}
              fontSizes={fontSizes}
            />
            <StatsItem
              label="Расход бензина за сегодня"
              value={`${formatFuel(stats.fuelUsed)} л`}
              isDark={isDark}
              fontSizes={fontSizes}
            />
            <StatsItem
              label="Пробег на конец дня"
              value={`${formatNumber(stats.endMileage)} км`}
              isDark={isDark}
              fontSizes={fontSizes}
            />
            <StatsItem
              label="Пробег за сегодня"
              value={`${formatNumber(stats.dailyMileage)} км`}
              isDark={isDark}
              fontSizes={fontSizes}
            />
          </ScrollView>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Закрыть</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DailyStatsModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalContentDark: {
    backgroundColor: '#2a2a2a',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  titleDark: {
    color: '#fff',
  },
  scrollView: {
    maxHeight: 400,
  },
  statsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  labelDark: {
    color: '#999',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  valueDark: {
    color: '#fff',
  },
  closeButton: {
    backgroundColor: '#2089dc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});