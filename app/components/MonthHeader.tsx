import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';

interface MonthHeaderProps {
  date: Date;
  isExpanded: boolean;
  onToggle: () => void;
}

const MonthHeader: React.FC<MonthHeaderProps> = ({ date, isExpanded, onToggle }) => {
  const { isDark } = useApp();

  return (
    <TouchableOpacity 
      style={[styles.container, isDark && styles.containerDark]} 
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={styles.headerContent}>
        <Text style={[styles.text, isDark && styles.textLight]}>
          {format(date, 'LLLL yyyy', { locale: ru })}
        </Text>
        <Text style={[styles.arrow, isDark && styles.textLight]}>
          {isExpanded ? '▼' : '▶'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MonthHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  containerDark: {
    backgroundColor: '#2a2a2a',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  textLight: {
    color: '#fff',
  },
  arrow: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
});