import { useApp } from '../context/AppContext';
import { getFontSizes } from '../utils/fontSizes';

export const useFontSizes = () => {
  const { settings } = useApp();
  return getFontSizes(settings.fontSize || 'normal');
};