import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useApp } from '../context/AppContext';

const { Navigator } = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  const { isDark } = useApp();

  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarActiveTintColor: '#2089dc',
        tabBarInactiveTintColor: isDark ? '#999' : '#666',
        tabBarStyle: {
          backgroundColor: isDark ? '#1a1a1a' : '#fff',
          paddingTop: 50,
          height: 90,
        },

        swipeEnabled: true,
        animationEnabled: true,
        tabBarScrollEnabled: true,
        tabBarShowIcon: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          width: 'auto',
          minWidth: 80,
        },
      }}>
      <MaterialTopTabs.Screen
        name="index"
        options={{
          title: 'Статистика',
        }}
      />
      <MaterialTopTabs.Screen
        name="calendar"
        options={{
          title: 'Календарь',
        }}
      />
      <MaterialTopTabs.Screen
        name="settings"
        options={{
          title: 'Настройки',
        }}
      />
      <MaterialTopTabs.Screen
        name="records"
        options={{
          title: 'Записи',
        }}
      />
      <MaterialTopTabs.Screen
        name="reports"
        options={{
          title: 'Отчеты',
        }}
      />
    </MaterialTopTabs>
  );
}