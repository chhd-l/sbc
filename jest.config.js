const config = {
  verbose: true,
  testPathIgnorePatterns: ["/node_modules", "/scripts", "/(test|spec)\.[jt]sx?$"],
  transformIgnorePatterns: ["/node_modules/(?!(antd|css-animation|rc.*)/)"],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
  },
  transform: {
    "\\.[jt]sx?$": "babel-jest",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/fileTransformer.js",
  },
};

module.exports = config;
