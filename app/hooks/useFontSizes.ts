import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getFontSizes } from '../utils/fontSizes';

export const useFontSizes = () => {
  const { settings } = useApp();
  
  return useMemo(() => {
    return getFontSizes(settings.fontSize || 'normal');
  }, [settings.fontSize]);
};