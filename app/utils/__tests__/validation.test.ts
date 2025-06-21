/**
 * Тесты для функций валидации
 * Проверяют корректность валидации и форматирования пользовательского ввода
 */

import { validateNumericInput, formatNumericInput } from '../validation';

describe('validation utils', () => {
  describe('validateNumericInput', () => {
    it('должен возвращать true для корректных числовых значений', () => {
      expect(validateNumericInput('10')).toBe(true);
      expect(validateNumericInput('10.5')).toBe(true);
      expect(validateNumericInput('0')).toBe(true);
      expect(validateNumericInput('100')).toBe(true);
    });

    it('должен корректно обрабатывать запятую как разделитель', () => {
      expect(validateNumericInput('10,5')).toBe(true);
      expect(validateNumericInput('0,1')).toBe(true);
      expect(validateNumericInput('99,99')).toBe(true);
    });

    it('должен возвращать false для некорректных значений', () => {
      expect(validateNumericInput('')).toBe(false);
      expect(validateNumericInput('abc')).toBe(false);
      expect(validateNumericInput('10abc')).toBe(false);
      expect(validateNumericInput('--10')).toBe(false);
    });

    it('должен проверять минимальное значение', () => {
      expect(validateNumericInput('5', 10)).toBe(false);
      expect(validateNumericInput('10', 10)).toBe(true);
      expect(validateNumericInput('15', 10)).toBe(true);
      expect(validateNumericInput('-5', 0)).toBe(false);
    });

    it('должен использовать минимальное значение по умолчанию равное 0', () => {
      expect(validateNumericInput('-1')).toBe(false);
      expect(validateNumericInput('0')).toBe(true);
      expect(validateNumericInput('1')).toBe(true);
    });

    it('должен обрабатывать граничные случаи', () => {
      expect(validateNumericInput('0.0')).toBe(true);
      expect(validateNumericInput('0,0')).toBe(true);
      expect(validateNumericInput('.')).toBe(false);
      expect(validateNumericInput(',')).toBe(false);
      expect(validateNumericInput(' ')).toBe(false);
    });
  });

  describe('formatNumericInput', () => {
    it('должен заменять запятую на точку', () => {
      expect(formatNumericInput('10,5')).toBe('10.5');
      expect(formatNumericInput('0,1')).toBe('0.1');
      expect(formatNumericInput('99,99')).toBe('99.99');
    });

    it('должен оставлять точку без изменений', () => {
      expect(formatNumericInput('10.5')).toBe('10.5');
      expect(formatNumericInput('0.1')).toBe('0.1');
      expect(formatNumericInput('99.99')).toBe('99.99');
    });

    it('должен обрабатывать строки без разделителей', () => {
      expect(formatNumericInput('10')).toBe('10');
      expect(formatNumericInput('0')).toBe('0');
      expect(formatNumericInput('abc')).toBe('abc');
    });

    it('должен обрабатывать пустые строки', () => {
      expect(formatNumericInput('')).toBe('');
    });

    it('должен заменять только первую запятую', () => {
      expect(formatNumericInput('10,5,3')).toBe('10.5,3');
    });
  });
});