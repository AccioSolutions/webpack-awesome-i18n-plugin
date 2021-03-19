
<div align="center">
  <!-- PR's Welcome -->
  <a href="http://makeapullrequest.com" style="width: 50%">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square"
      alt="PR's Welcome" />
  </a>
</div>

<h1 align="center">Webpack Awesome i18n Plugin</h1>

<div align="center">
  Write translations key in one single file and let us split it for you!
</div>



### Use

```js
const AwesomeI18NPlugin = require('@acciosolutions/webpack-awesome-i18n-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './demo/index.js',
  plugins: [
    new AwesomeI18NPlugin({
        file: path.resolve('./demo/i18n.json'),
        localesDir: path.resolve('./demo/locales'),
        genKeysTypes: true,
        keysTypesFile: path.resolve('./demo/keys.ts')
    }),
  ],
};
```
