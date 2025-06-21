/**
 * Тесты для функций форматирования
 * Проверяют корректность форматирования чисел, топлива и валюты
 */

import { formatNumber, formatFuel, formatCurrency } from '../formatters';

describe('formatters utils', () => {
  describe('formatNumber', () => {
    it('должен форматировать числа без десятичных знаков по умолчанию', () => {
      expect(formatNumber(1000)).toBe('1 000');
      expect(formatNumber(1234567)).toBe('1 234 567');
      expect(formatNumber(100)).toBe('100');
      expect(formatNumber(0)).toBe('0');
    });

    it('должен округлять числа до целых по умолчанию', () => {
      expect(formatNumber(1000.7)).toBe('1 001');
      expect(formatNumber(1000.3)).toBe('1 000');
      expect(formatNumber(999.9)).toBe('1 000');
    });

    it('должен форматировать числа с одним десятичным знаком при withDecimals=true', () => {
      expect(formatNumber(1000, true)).toBe('1 000.0');
      expect(formatNumber(1234.5, true)).toBe('1 234.5');
      expect(formatNumber(1234.56, true)).toBe('1 234.6');
      expect(formatNumber(0, true)).toBe('0.0');
    });

    it('должен обрабатывать отрицательные числа', () => {
      expect(formatNumber(-1000)).toBe('-1 000');
      expect(formatNumber(-1234.5, true)).toBe('-1 234.5');
    });

    it('должен обрабатывать малые числа', () => {
      expect(formatNumber(0.1)).toBe('0');
      expect(formatNumber(0.9)).toBe('1');
      expect(formatNumber(0.1, true)).toBe('0.1');
      expect(formatNumber(0.95, true)).toBe('0.9');
    });

    it('должен обрабатывать большие числа', () => {
      expect(formatNumber(1000000)).toBe('1 000 000');
      expect(formatNumber(1000000.123, true)).toBe('1 000 000.1');
    });
  });

  describe('formatFuel', () => {
    it('должен форматировать литры с одним десятичным знаком', () => {
      expect(formatFuel(50)).toBe('50.0 л');
      expect(formatFuel(25.5)).toBe('25.5 л');
      expect(formatFuel(0)).toBe('0.0 л');
    });

    it('должен округлять до одного десятичного знака', () => {
      expect(formatFuel(25.56)).toBe('25.6 л');
      expect(formatFuel(25.54)).toBe('25.5 л');
      expect(formatFuel(25.99)).toBe('26.0 л');
    });

    it('должен обрабатывать малые значения', () => {
      expect(formatFuel(0.1)).toBe('0.1 л');
      expect(formatFuel(0.05)).toBe('0.1 л');
      expect(formatFuel(0.04)).toBe('0.0 л');
    });

    it('должен обрабатывать большие значения', () => {
      expect(formatFuel(1000)).toBe('1000.0 л');
      expect(formatFuel(999.99)).toBe('1000.0 л');
    });
  });

  describe('formatCurrency', () => {
    it('должен форматировать валюту с символом рубля', () => {
      expect(formatCurrency(1000)).toBe('1 000 ₽');
      expect(formatCurrency(1234567)).toBe('1 234 567 ₽');
      expect(formatCurrency(0)).toBe('0 ₽');
    });

    it('должен округлять до целых рублей', () => {
      expect(formatCurrency(1000.7)).toBe('1 001 ₽');
      expect(formatCurrency(1000.3)).toBe('1 000 ₽');
      expect(formatCurrency(999.9)).toBe('1 000 ₽');
    });

    it('должен обрабатывать отрицательные суммы', () => {
      expect(formatCurrency(-1000)).toBe('-1 000 ₽');
      expect(formatCurrency(-500.5)).toBe('-500 ₽');
    });

    it('должен обрабатывать малые суммы', () => {
      expect(formatCurrency(0.1)).toBe('0 ₽');
      expect(formatCurrency(0.9)).toBe('1 ₽');
      expect(formatCurrency(1)).toBe('1 ₽');
    });

    it('должен обрабатывать большие суммы', () => {
      expect(formatCurrency(1000000)).toBe('1 000 000 ₽');
      expect(formatCurrency(9999999)).toBe('9 999 999 ₽');
    });
  });
});