import { Stack } from 'expo-router';
import React from 'react';
import Toast from 'react-native-toast-message';
import AppProvider, { useApp } from './context/AppContext';

function RootLayout() {
  const { isDark } = useApp();

  return (
    <>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="record/[date]"
          options={{
            title: "Записи",
            headerStyle: {
              backgroundColor: isDark ? '#1a1a1a' : '#fff',
            },
            headerTintColor: isDark ? '#fff' : '#000',
          }}
        />
      </Stack>
      <Toast />
    </>
  );
}

export default function AppLayout() {
  return (
    <AppProvider>
      <RootLayout />
    </AppProvider>
  );
}
