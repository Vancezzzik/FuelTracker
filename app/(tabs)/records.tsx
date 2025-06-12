import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import FuelRecordsList from '../components/FuelRecordsList';
import { FuelRecord } from '../types';
import { useApp } from '../context/AppContext';

export default function RecordsScreen() {
  const router = useRouter();
  const { isDark } = useApp();

  const handleRecordPress = (record: FuelRecord) => {
    router.push({
      pathname: '/record/[date]',
      params: { date: record.date }
    } as any);
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <FuelRecordsList onRecordPress={handleRecordPress} />
    </View>
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
});