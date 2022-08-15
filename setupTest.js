import '@testing-library/jest-dom';
import { RCi18n } from 'qmkit';

const localStorageMock = (function () {
  let store = {}

  return {
    getItem: function (key) {
      return store[key] || null
    },
    setItem: function (key, value) {
      store[key] = value.toString()
    },
    removeItem: function (key) {
      delete store[key]
    },
    clear: function () {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock
})

Object.defineProperty(window, '__DEV__', {
  value: true
})

Object.defineProperty(window, 'RCi18n', {
  value: RCi18n
})
