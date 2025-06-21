export const validateNumericInput = (value: string, min = 0) => {
  if (!value || value.trim() === '') return false;
  
  const cleanValue = value.replace(',', '.');
  
  // Проверяем, что строка является валидным числом
  const numericRegex = /^-?\d*\.?\d+$/;
  if (!numericRegex.test(cleanValue)) return false;
  
  const numValue = parseFloat(cleanValue);
  return !isNaN(numValue) && numValue >= min;
};

export const formatNumericInput = (text: string) => {
  return text.replace(',', '.');
};