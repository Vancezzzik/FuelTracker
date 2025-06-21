/**
 * Тесты для хука useToast
 * Проверяют корректность отображения уведомлений
 */

import { renderHook, act } from '@testing-library/react-native';
import { useToast } from '../useToast';
import Toast from 'react-native-toast-message';

// Мокаем Toast
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

const mockToast = Toast as jest.Mocked<typeof Toast>;

describe('useToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен возвращать функции для показа уведомлений', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current).toHaveProperty('showSuccess');
    expect(result.current).toHaveProperty('showError');
    expect(result.current).toHaveProperty('showInfo');
    expect(typeof result.current.showSuccess).toBe('function');
    expect(typeof result.current.showError).toBe('function');
    expect(typeof result.current.showInfo).toBe('function');
  });

  describe('showSuccess', () => {
    it('должен показывать успешное уведомление', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showSuccess('Операция выполнена успешно');
      });

      expect(mockToast.show).toHaveBeenCalledWith({
        type: 'success',
        text1: 'Операция выполнена успешно',
        position: 'bottom',
        visibilityTime: 3000,
      });
    });

    it('должен показывать успешное уведомление с заголовком', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showSuccess('Данные сохранены', 'Успех');
      });

      expect(mockToast.show).toHaveBeenCalledWith({
        type: 'success',
        text1: 'Успех',
        text2: 'Данные сохранены',
        position: 'bottom',
        visibilityTime: 3000,
      });
    });
  });

  describe('showError', () => {
    it('должен показывать уведомление об ошибке', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showError('Произошла ошибка');
      });

      expect(mockToast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Произошла ошибка',
        position: 'bottom',
        visibilityTime: 4000,
      });
    });

    it('должен показывать уведомление об ошибке с заголовком', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showError('Не удалось сохранить данные', 'Ошибка');
      });

      expect(mockToast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Ошибка',
        text2: 'Не удалось сохранить данные',
        position: 'bottom',
        visibilityTime: 4000,
      });
    });
  });

  describe('showInfo', () => {
    it('должен показывать информационное уведомление', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showInfo('Информация обновлена');
      });

      expect(mockToast.show).toHaveBeenCalledWith({
        type: 'info',
        text1: 'Информация обновлена',
        position: 'bottom',
        visibilityTime: 3000,
      });
    });

    it('должен показывать информационное уведомление с заголовком', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showInfo('Данные синхронизированы', 'Информация');
      });

      expect(mockToast.show).toHaveBeenCalledWith({
        type: 'info',
        text1: 'Информация',
        text2: 'Данные синхронизированы',
        position: 'bottom',
        visibilityTime: 3000,
      });
    });
  });

  describe('множественные вызовы', () => {
    it('должен корректно обрабатывать несколько уведомлений подряд', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showSuccess('Первое сообщение');
        result.current.showError('Второе сообщение');
        result.current.showInfo('Третье сообщение');
      });

      expect(mockToast.show).toHaveBeenCalledTimes(3);
      expect(mockToast.show).toHaveBeenNthCalledWith(1, {
        type: 'success',
        text1: 'Первое сообщение',
        position: 'bottom',
        visibilityTime: 3000,
      });
      expect(mockToast.show).toHaveBeenNthCalledWith(2, {
        type: 'error',
        text1: 'Второе сообщение',
        position: 'bottom',
        visibilityTime: 4000,
      });
      expect(mockToast.show).toHaveBeenNthCalledWith(3, {
        type: 'info',
        text1: 'Третье сообщение',
        position: 'bottom',
        visibilityTime: 3000,
      });
    });
  });

  describe('граничные случаи', () => {
    it('должен обрабатывать пустые сообщения', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showSuccess('');
      });

      expect(mockToast.show).toHaveBeenCalledWith({
        type: 'success',
        text1: '',
        position: 'bottom',
        visibilityTime: 3000,
      });
    });

    it('должен обрабатывать очень длинные сообщения', () => {
      const { result } = renderHook(() => useToast());
      const longMessage = 'Очень длинное сообщение '.repeat(10);

      act(() => {
        result.current.showError(longMessage);
      });

      expect(mockToast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: longMessage,
        position: 'bottom',
        visibilityTime: 4000,
      });
    });

    it('должен обрабатывать специальные символы в сообщениях', () => {
      const { result } = renderHook(() => useToast());
      const specialMessage = 'Сообщение с символами: !@#$%^&*()_+-={}[]|\\:;"<>?,./';

      act(() => {
        result.current.showInfo(specialMessage);
      });

      expect(mockToast.show).toHaveBeenCalledWith({
        type: 'info',
        text1: specialMessage,
        position: 'bottom',
        visibilityTime: 3000,
      });
    });
  });
});