const path = require('path');
const AwesomeI18NPlugin = require('./dist/cjs');

module.exports = {
  mode: 'development',
  entry: './demo/index.js',
  plugins: [
    new AwesomeI18NPlugin({
      file: path.resolve('./demo/i18n.json'),
      localesDir: path.resolve('./demo/locales'),
      genKeysTypes: true,
      keysTypesFile: path.resolve('./demo/keys.ts'),
    }),
  ],
};
