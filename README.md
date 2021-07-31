
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


#### webpack config

```js
const AwesomeI18NPlugin = require('@acciosolutions/webpack-awesome-i18n-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    path: path.resolve("dist/")
  },
  plugins: [
    new AwesomeI18NPlugin({
        // path to your translate tokens file
        file: path.resolve('./i18n/i18n.json'),
        // output dir of languages json
        localesDir: 'locales',

        // optionally you can create an typescript enum with each transkation key for type assistence
        genKeysTypes: true,
        keysTypesFile: path.resolve('./i18n/keys.ts')
    }),
  ],
};
```

#### i18next config example

```ts
import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: 'pt-BR',
    fallbackLng: 'en-US',

    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
  });
```

#### Single token file
```json
// i18n/i18n.json
{
  {
    "languages": ["pt-BR", "en-US"],
    "resources": {
      "app.header.home": {
        "pt-BR": "Inicio",
        "en-US": "Home"
      },
      "app.header.search": {
        "pt-BR": "Buscar",
        "en-US": "Search"
      },
    }
  }
}
```

will result in two jsons:
```json
// ./dist/locales/pt-BR.json
{
    "app": {
        "header": {
            "home": "Inicio",
            "search": "Buscar",
            "add-post": "Nova publicao",
            "save-post": "Nova publicao"
        }
    }
}
// ./dist/locales/en-US.json
{
    "app": {
        "header": {
            "home": "Home",
            "search": "Search",
            "add-post": "New Post",
            "save-post": "New Post"
        }
    }
}
```