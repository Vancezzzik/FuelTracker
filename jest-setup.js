// Mock AsyncStorage

// Mock React
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: jest.fn((fn) => fn),
  useContext: jest.fn(() => ({})),
  useState: jest.fn((initial) => [initial, jest.fn()]),
  useEffect: jest.fn(),
  useMemo: jest.fn((fn) => fn()),
  createContext: jest.fn(() => ({
    Provider: ({ children }) => children,
    Consumer: ({ children }) => children({}),
  })),
}));

// Mock react-test-renderer
jest.mock('react-test-renderer', () => ({
  create: jest.fn(() => ({
    toJSON: jest.fn(),
    getInstance: jest.fn(),
    update: jest.fn(),
    unmount: jest.fn(),
  })),
  act: jest.fn((callback) => callback()),
}));

// Mock AppContext
const mockUseApp = jest.fn(() => ({
  settings: { fontSize: 'normal' },
}));

jest.mock('./app/context/AppContext', () => ({
  useApp: mockUseApp,
}));

// Экспортируем мок для использования в тестах
global.mockUseApp = mockUseApp;

// Mock @testing-library/react-native
jest.mock('@testing-library/react-native', () => ({
  render: jest.fn(),
  renderHook: jest.fn((hook) => {
    const result = { current: hook() };
    return {
      result,
      rerender: jest.fn(() => {
        result.current = hook();
      }),
      unmount: jest.fn(),
    };
  }),
  act: jest.fn((callback) => callback()),
  fireEvent: {
    press: jest.fn(),
    changeText: jest.fn(),
  },
  waitFor: jest.fn((callback) => Promise.resolve(callback())),
  screen: {
    getByText: jest.fn(),
    getByTestId: jest.fn(),
    queryByText: jest.fn(),
    queryByTestId: jest.fn(),
  },
}));

// Mock react-native
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios || obj.default),
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 667 })),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  StyleSheet: {
    create: jest.fn((styles) => styles),
    flatten: jest.fn((style) => style),
  },
  View: 'View',
  Text: 'Text',
  ScrollView: 'ScrollView',
  TouchableOpacity: 'TouchableOpacity',
  TouchableHighlight: 'TouchableHighlight',
  TouchableWithoutFeedback: 'TouchableWithoutFeedback',
  TextInput: 'TextInput',
  Button: 'Button',
  Image: 'Image',
  FlatList: 'FlatList',
  SectionList: 'SectionList',
  Alert: {
    alert: jest.fn(),
  },
  Animated: {
    View: 'Animated.View',
    Text: 'Animated.Text',
    Value: jest.fn(() => ({
      setValue: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
    timing: jest.fn(() => ({
      start: jest.fn(),
    })),
  },
  Easing: {
    linear: jest.fn(),
    ease: jest.fn(),
  },
  NativeModules: {},
  findNodeHandle: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock react-native-toast-message
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

// Mock useColorScheme
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: jest.fn(() => 'light'),
}));

// Global test setup
global.__DEV__ = true;