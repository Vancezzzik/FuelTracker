export const useSettings = () => {
  const { settings, updateSettings } = useApp();
  
  const updateSetting = useCallback(async (key: keyof AppSettings, value: any) => {
    try {
      await updateSettings({ ...settings, [key]: value });
      // показать toast
    } catch (error) {
      // показать ошибку
    }
  }, [settings, updateSettings]);
  
  return { settings, updateSetting };
};