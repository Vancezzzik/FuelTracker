export const useToast = () => {
  const showSuccess = useCallback((message: string) => {
    Toast.show({
      type: 'success',
      text1: 'Сохранено',
      text2: message,
      position: 'bottom',
      visibilityTime: 2000,
    });
  }, []);
  
  const showError = useCallback((message: string) => {
    Toast.show({
      type: 'error',
      text1: 'Ошибка',
      text2: message,
      position: 'bottom',
    });
  }, []);
  
  return { showSuccess, showError };
};