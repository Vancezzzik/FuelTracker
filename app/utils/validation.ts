export const validateNumericInput = (value: string, min = 0) => {
  const numValue = parseFloat(value.replace(',', '.'));
  return !isNaN(numValue) && numValue >= min;
};

export const formatNumericInput = (text: string) => {
  return text.replace(',', '.');
};