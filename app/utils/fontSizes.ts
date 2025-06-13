export const getFontSizes = (fontSize: 'normal' | 'medium' | 'large') => {
  const baseSizes = {
    normal: {
      small: 12,
      medium: 14,
      large: 16,
      xlarge: 18,
      xxlarge: 20,
      title: 24,
      header: 28,
    },
    medium: {
      small: 14,
      medium: 16,
      large: 18,
      xlarge: 20,
      xxlarge: 22,
      title: 26,
      header: 30,
    },
    large: {
      small: 16,
      medium: 18,
      large: 20,
      xlarge: 22,
      xxlarge: 24,
      title: 28,
      header: 32,
    },
  };

  return baseSizes[fontSize];
};

export type FontSizeKey = keyof ReturnType<typeof getFontSizes>;