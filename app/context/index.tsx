// Композиция всех провайдеров
export const AppProviders = ({ children }) => (
  <SettingsProvider>
    <RecordsProvider>
      {children}
    </RecordsProvider>
  </SettingsProvider>
);