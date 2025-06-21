import { useCallback } from 'react';
import Toast from 'react-native-toast-message';

export const useToast = () => {
  const showSuccess = useCallback((message: string, title?: string) => {
    Toast.show({
      type: 'success',
      text1: title || message,
      text2: title ? message : undefined,
      position: 'bottom',
      visibilityTime: 3000,
    });
  }, []);
  
  const showError = useCallback((message: string, title?: string) => {
    Toast.show({
      type: 'error',
      text1: title || message,
      text2: title ? message : undefined,
      position: 'bottom',
      visibilityTime: 4000,
    });
  }, []);
  
  const showInfo = useCallback((message: string, title?: string) => {
    Toast.show({
      type: 'info',
      text1: title || message,
      text2: title ? message : undefined,
      position: 'bottom',
      visibilityTime: 3000,
    });
  }, []);
  
  return { showSuccess, showError, showInfo };
};