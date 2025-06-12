import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FuelRecordsList } from '../components/FuelRecordsList';
import { FuelRecord } from '../types';

export default function RecordsScreen() {
  const router = useRouter();

  const handleRecordPress = (record: FuelRecord) => {
    router.push({
      pathname: '/record/[date]',
      params: { date: record.date }
    } as any);
  };

  return (
    <View style={styles.container}>
      <FuelRecordsList onRecordPress={handleRecordPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
}); 