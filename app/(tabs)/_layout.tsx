import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import React from 'react';
import { ViewStyle } from 'react-native';

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
        tabBarShowIcon: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          width: 'auto',
          minWidth: 80,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        } as ViewStyle,
      }}>
      <MaterialTopTabs.Screen
        name="index"
        options={{
          title: 'Статистика',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons 
              name={focused ? 'stats-chart' : 'stats-chart-outline'} 
              size={18} 
              color={color} 
            />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="calendar"
        options={{
          title: 'Календарь',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons 
              name={focused ? 'calendar' : 'calendar-outline'} 
              size={18} 
              color={color} 
            />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="settings"
        options={{
          title: 'Настройки',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons 
              name={focused ? 'settings' : 'settings-outline'} 
              size={18} 
              color={color} 
            />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="reports"
        options={{
          title: 'Отчеты',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons 
              name={focused ? 'document-text' : 'document-text-outline'} 
              size={18} 
              color={color} 
            />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="records"
        options={{
          title: 'Записи',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons 
              name={focused ? 'list' : 'list-outline'} 
              size={18} 
              color={color} 
            />
          ),
        }}
      />
    </MaterialTopTabs>
  );
}
