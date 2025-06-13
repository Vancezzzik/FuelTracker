interface SettingInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
  placeholder: string;
  keyboardType?: 'numeric' | 'default';
}

export const SettingInput: React.FC<SettingInputProps> = ({
  label, value, onChangeText, onSave, placeholder, keyboardType = 'default'
}) => {
  const { isDark } = useApp();
  const fontSizes = useFontSizes();
  
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, isDark && styles.textLight, { fontSize: fontSizes.medium }]}>
        {label}
      </Text>
      <View style={styles.inputWithButton}>
        <TextInput
          style={[styles.input, isDark && styles.inputDark, { fontSize: fontSizes.medium }]}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#666' : '#999'}
        />
        <TouchableOpacity
          style={[styles.saveButton, styles.smallButton]}
          onPress={onSave}
        >
          <Text style={[styles.buttonText, { fontSize: fontSizes.small }]}>Сохранить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};