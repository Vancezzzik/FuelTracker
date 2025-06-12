import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';

interface MonthHeaderProps {
  date: Date;
}

const MonthHeader: React.FC<MonthHeaderProps> = ({ date }) => {
  const { isDark } = useApp();

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.text, isDark && styles.textLight]}>
        {format(date, 'LLLL yyyy', { locale: ru })}
      </Text>
    </View>
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
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  textLight: {
    color: '#fff',
  },
}); 