/**
 * Тесты для функций работы с размерами шрифтов
 * Проверяют корректность возвращаемых размеров для разных настроек
 */

import { getFontSizes, FontSizeKey } from '../fontSizes';

describe('fontSizes utils', () => {
  describe('getFontSizes', () => {
    it('должен возвращать корректные размеры для normal', () => {
      const sizes = getFontSizes('normal');
      
      expect(sizes.small).toBe(12);
      expect(sizes.medium).toBe(14);
      expect(sizes.large).toBe(16);
      expect(sizes.xlarge).toBe(18);
      expect(sizes.xxlarge).toBe(20);
      expect(sizes.title).toBe(24);
      expect(sizes.header).toBe(28);
    });

    it('должен возвращать корректные размеры для medium', () => {
      const sizes = getFontSizes('medium');
      
      expect(sizes.small).toBe(14);
      expect(sizes.medium).toBe(16);
      expect(sizes.large).toBe(18);
      expect(sizes.xlarge).toBe(20);
      expect(sizes.xxlarge).toBe(22);
      expect(sizes.title).toBe(26);
      expect(sizes.header).toBe(30);
    });

    it('должен возвращать корректные размеры для large', () => {
      const sizes = getFontSizes('large');
      
      expect(sizes.small).toBe(16);
      expect(sizes.medium).toBe(18);
      expect(sizes.large).toBe(20);
      expect(sizes.xlarge).toBe(22);
      expect(sizes.xxlarge).toBe(24);
      expect(sizes.title).toBe(28);
      expect(sizes.header).toBe(32);
    });

    it('должен возвращать объект с правильной структурой', () => {
      const sizes = getFontSizes('normal');
      
      expect(typeof sizes).toBe('object');
      expect(sizes).toHaveProperty('small');
      expect(sizes).toHaveProperty('medium');
      expect(sizes).toHaveProperty('large');
      expect(sizes).toHaveProperty('xlarge');
      expect(sizes).toHaveProperty('xxlarge');
      expect(sizes).toHaveProperty('title');
      expect(sizes).toHaveProperty('header');
    });

    it('должен возвращать числовые значения для всех размеров', () => {
      const sizes = getFontSizes('normal');
      
      Object.values(sizes).forEach(size => {
        expect(typeof size).toBe('number');
        expect(size).toBeGreaterThan(0);
      });
    });

    it('размеры должны увеличиваться от normal к medium к large', () => {
      const normalSizes = getFontSizes('normal');
      const mediumSizes = getFontSizes('medium');
      const largeSizes = getFontSizes('large');
      
      // Проверяем, что каждый размер увеличивается
      expect(mediumSizes.small).toBeGreaterThan(normalSizes.small);
      expect(largeSizes.small).toBeGreaterThan(mediumSizes.small);
      
      expect(mediumSizes.medium).toBeGreaterThan(normalSizes.medium);
      expect(largeSizes.medium).toBeGreaterThan(mediumSizes.medium);
      
      expect(mediumSizes.title).toBeGreaterThan(normalSizes.title);
      expect(largeSizes.title).toBeGreaterThan(mediumSizes.title);
      
      expect(mediumSizes.header).toBeGreaterThan(normalSizes.header);
      expect(largeSizes.header).toBeGreaterThan(mediumSizes.header);
    });

    it('размеры внутри одной категории должны быть упорядочены по возрастанию', () => {
      const sizes = getFontSizes('normal');
      
      expect(sizes.small).toBeLessThan(sizes.medium);
      expect(sizes.medium).toBeLessThan(sizes.large);
      expect(sizes.large).toBeLessThan(sizes.xlarge);
      expect(sizes.xlarge).toBeLessThan(sizes.xxlarge);
      expect(sizes.xxlarge).toBeLessThan(sizes.title);
      expect(sizes.title).toBeLessThan(sizes.header);
    });
  });

  describe('FontSizeKey type', () => {
    it('должен включать все ключи размеров шрифтов', () => {
      const sizes = getFontSizes('normal');
      const keys = Object.keys(sizes) as FontSizeKey[];
      
      expect(keys).toContain('small');
      expect(keys).toContain('medium');
      expect(keys).toContain('large');
      expect(keys).toContain('xlarge');
      expect(keys).toContain('xxlarge');
      expect(keys).toContain('title');
      expect(keys).toContain('header');
    });
  });
});