import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { AppSettings } from '../types';

export const useSettings = () => {
  const { settings, updateSettings } = useApp();
  
  const updateSetting = useCallback(async (key: keyof AppSettings, value: any) => {
    try {
      await updateSettings({ ...settings, [key]: value });
      // показать toast
    } catch (error) {
      // показать ошибку
    }
  }, [updateSettings]);
  
  return { settings, updateSetting };
};