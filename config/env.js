'use strict';

const fs = require('fs');
const path = require('path');
const paths = require('./paths');

// Make sure that including paths.js after env.js will read .env variables.
delete require.cache[require.resolve('./paths')];

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
  throw new Error(
    'The NODE_ENV environment variable is required but was not specified.'
  );
}
;

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
var dotenvFiles = [
  `${paths.dotenv}.${NODE_ENV}.local`,
  `${paths.dotenv}.${NODE_ENV}`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && `${paths.dotenv}.local`,
  paths.dotenv,
].filter(Boolean);
dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      })
    );
  }
});

const appDirectory = fs.realpathSync(process.cwd());
process.env.NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(appDirectory, folder))
  .join(path.delimiter);

let evnMap = {
  dev: require('./env-config/dev.js'),
  stg: require('./env-config/stg.js'),
  prod_fa: require('./env-config/prod_fa.js'),
  prod_de: require('./env-config/prod_de.js'),
}

// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.
const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment(envCode) {

  let config = evnMap[envCode];

  const raw = Object.keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      Object.assign({}, {
        NODE_ENV: process.env.NODE_ENV || 'development',
      }, config)
    );
  const stringified = {
    '__ENVINFO__': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
    "__ApiMock__": JSON.stringify(envCode === 'prod' ? {} : require('../.moon.json').api.mock.mockApi)
  };

  return { raw, stringified };
}
module.exports = getClientEnvironment;
