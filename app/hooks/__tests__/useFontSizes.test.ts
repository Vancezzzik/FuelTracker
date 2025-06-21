/**
 * Тесты для хука useFontSizes
 * Проверяют корректность работы с размерами шрифтов
 */

import { renderHook } from '@testing-library/react-native';
import { useFontSizes } from '../useFontSizes';

// Используем глобальный мок для useApp
const mockUseApp = global.mockUseApp as jest.MockedFunction<any>;

describe('useFontSizes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен возвращать размеры шрифтов для нормального размера', () => {
    mockUseApp.mockReturnValue({
      settings: { fontSize: 'normal' },
    });

    const { result } = renderHook(() => useFontSizes());

    expect(result.current).toEqual({
      small: 12,
      medium: 14,
      large: 16,
      xlarge: 18,
      xxlarge: 20,
      title: 24,
      header: 28,
    });
  });

  it('должен возвращать размеры шрифтов для среднего размера', () => {
    mockUseApp.mockReturnValue({
      settings: { fontSize: 'medium' },
    });

    const { result } = renderHook(() => useFontSizes());

    expect(result.current).toEqual({
      small: 14,
      medium: 16,
      large: 18,
      xlarge: 20,
      xxlarge: 22,
      title: 26,
      header: 30,
    });
  });

  it('должен возвращать размеры шрифтов для большого размера', () => {
    mockUseApp.mockReturnValue({
      settings: { fontSize: 'large' },
    });

    const { result } = renderHook(() => useFontSizes());

    expect(result.current).toEqual({
      small: 16,
      medium: 18,
      large: 20,
      xlarge: 22,
      xxlarge: 24,
      title: 28,
      header: 32,
    });
  });

  it('должен использовать нормальный размер по умолчанию при неизвестном значении', () => {
    mockUseApp.mockReturnValue({
      settings: { fontSize: 'unknown' as any },
    });

    const { result } = renderHook(() => useFontSizes());

    expect(result.current).toEqual({
      small: 12,
      medium: 14,
      large: 16,
      xlarge: 18,
      xxlarge: 20,
      title: 24,
      header: 28,
    });
  });

  it('должен использовать нормальный размер при отсутствии настроек', () => {
    mockUseApp.mockReturnValue({
      settings: {},
    });

    const { result } = renderHook(() => useFontSizes());

    expect(result.current).toEqual({
      small: 12,
      medium: 14,
      large: 16,
      xlarge: 18,
      xxlarge: 20,
      title: 24,
      header: 28,
    });
  });

  it('должен обновляться при изменении настроек размера шрифта', () => {
    mockUseApp.mockReturnValue({ settings: { fontSize: 'normal' } });

    const { result, rerender } = renderHook(() => useFontSizes());

    // Проверяем начальное состояние
    expect(result.current.medium).toBe(14);

    // Изменяем настройки
    mockUseApp.mockReturnValue({ settings: { fontSize: 'large' } });
    rerender();

    // Проверяем обновленное состояние
    expect(result.current.medium).toBe(18);
  });

  describe('структура возвращаемого объекта', () => {
    beforeEach(() => {
      mockUseApp.mockReturnValue({
        settings: { fontSize: 'normal' },
      });
    });

    it('должен содержать все необходимые ключи', () => {
      const { result } = renderHook(() => useFontSizes());
      const fontSizes = result.current;

      expect(fontSizes).toHaveProperty('small');
      expect(fontSizes).toHaveProperty('medium');
      expect(fontSizes).toHaveProperty('large');
      expect(fontSizes).toHaveProperty('xlarge');
      expect(fontSizes).toHaveProperty('xxlarge');
      expect(fontSizes).toHaveProperty('title');
      expect(fontSizes).toHaveProperty('header');
    });

    it('все значения должны быть числами', () => {
      const { result } = renderHook(() => useFontSizes());
      const fontSizes = result.current;

      Object.values(fontSizes).forEach(size => {
        expect(typeof size).toBe('number');
        expect(size).toBeGreaterThan(0);
      });
    });

    it('размеры должны быть упорядочены по возрастанию', () => {
      const { result } = renderHook(() => useFontSizes());
      const fontSizes = result.current;

      expect(fontSizes.small).toBeLessThan(fontSizes.medium);
      expect(fontSizes.medium).toBeLessThan(fontSizes.large);
      expect(fontSizes.large).toBeLessThan(fontSizes.xlarge);
      expect(fontSizes.xlarge).toBeLessThan(fontSizes.xxlarge);
      expect(fontSizes.xxlarge).toBeLessThan(fontSizes.title);
      expect(fontSizes.title).toBeLessThan(fontSizes.header);
    });
  });

  describe('сравнение размеров между категориями', () => {
    it('большие размеры должны быть больше соответствующих нормальных', () => {
      // Нормальные размеры
      mockUseApp.mockReturnValue({
        settings: { fontSize: 'normal' },
      });
      const { result: normalResult } = renderHook(() => useFontSizes());
      const normalSizes = normalResult.current;

      // Большие размеры
      mockUseApp.mockReturnValue({
        settings: { fontSize: 'large' },
      });
      const { result: largeResult } = renderHook(() => useFontSizes());
      const largeSizes = largeResult.current;

      // Сравниваем каждый размер
      expect(largeSizes.small).toBeGreaterThan(normalSizes.small);
      expect(largeSizes.medium).toBeGreaterThan(normalSizes.medium);
      expect(largeSizes.large).toBeGreaterThan(normalSizes.large);
      expect(largeSizes.xlarge).toBeGreaterThan(normalSizes.xlarge);
      expect(largeSizes.xxlarge).toBeGreaterThan(normalSizes.xxlarge);
      expect(largeSizes.title).toBeGreaterThan(normalSizes.title);
      expect(largeSizes.header).toBeGreaterThan(normalSizes.header);
    });

    it('средние размеры должны быть между нормальными и большими', () => {
      // Получаем все три набора размеров
      mockUseApp.mockReturnValue({ settings: { fontSize: 'normal' } });
      const { result: normalResult } = renderHook(() => useFontSizes());
      const normalSizes = normalResult.current;

      mockUseApp.mockReturnValue({ settings: { fontSize: 'medium' } });
      const { result: mediumResult } = renderHook(() => useFontSizes());
      const mediumSizes = mediumResult.current;

      mockUseApp.mockReturnValue({ settings: { fontSize: 'large' } });
      const { result: largeResult } = renderHook(() => useFontSizes());
      const largeSizes = largeResult.current;

      // Проверяем, что средние размеры находятся между нормальными и большими
      Object.keys(normalSizes).forEach(key => {
        const sizeKey = key as keyof typeof normalSizes;
        expect(mediumSizes[sizeKey]).toBeGreaterThan(normalSizes[sizeKey]);
        expect(mediumSizes[sizeKey]).toBeLessThan(largeSizes[sizeKey]);
      });
    });
  });
});