import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import Toast from 'react-native-toast-message';
import { AppProvider } from './context/AppContext';

export default function AppLayout() {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';

  return (
    <AppProvider>
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
    </AppProvider>
  );
}
