const config = {
  verbose: true,
  collectCoverage: true,
  coverageProvider: 'babel',
  setupFilesAfterEnv: ['<rootDir>/setupTest.js'],
  collectCoverageFrom: [
    //"src/**/*.{js,jsx,ts,tsx}",
    "web_modules/qmkit/*.{js,jsx,ts,tsx}",
    // 'src/redirection/components/AddNewRedirectionModal.{js,jsx,ts,tsx}',
    // 'src/redirection-import/index.{js,jsx,ts,tsx}',
    // 'src/redirection/index.{js,jsx,ts,tsx}',
    // "!src/**/*.d.ts"
  ],
  "testMatch": [
    // "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    // "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}"
    "<rootDir>/web_modules/qmkit/__test__/**/*.{js,jsx,ts,tsx}"
    // "<rootDir>/src/redirection/__test__/**/*.{js,jsx,ts,tsx}"
    // "<rootDir>/src/redirection/components/__test__/AddNewRedirectionModal.test.{js,jsx,ts,tsx}"
    // "<rootDir>/src/redirection-import/__test__/index.test.{js,jsx,ts,tsx}"

  ],
  // collectCoverageFrom: ["src/customer-details/component/*.{js,jsx,ts,tsx}"],
  testPathIgnorePatterns: ['/node_modules', '/scripts', '/(test|spec).[jt]sx?$'],
  transformIgnorePatterns: ['/node_modules/(?!(antd|css-animation|rc.*)/)'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
    qmkit: '<rootDir>/web_modules/qmkit',
    '^biz/(.*)$': '<rootDir>/web_modules/biz/$1'
  },
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/fileTransformer.js'
  }
};

module.exports = config;
