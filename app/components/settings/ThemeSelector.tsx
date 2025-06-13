export const ThemeSelector: React.FC = () => {
  const { settings, updateSettings, isDark } = useApp();
  const fontSizes = useFontSizes();
  
  const handleThemeChange = async (theme: 'system' | 'light' | 'dark') => {
    // логика изменения темы
  };
  
  return (
    <View style={styles.themeContainer}>
      {/* UI для выбора темы */}
    </View>
  );
};