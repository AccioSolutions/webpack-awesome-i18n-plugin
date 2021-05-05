const fs = require('fs');
const path = require('path');

export function buildI18nLocales({
  outPath,
  resources,
  languages,
  keysType,
  keysTypesFile,
}) {
  const keys = new Set();
  const _resources = {};


  const setKeyInPath = (obj, path, value) => {
    if (path.length === 1) {
      obj[path[0]] = value;
      return;
    }
    const [current, ...next] = path;
    if (!(current in obj)) {
      obj[current] = {};
    }
    setKeyInPath(obj[current], next, value);
  };


  const addResources = (lang, key, text) => {
    if (!(lang in _resources)) {
      _resources[lang] = {};
    }
    setKeyInPath(_resources[lang], key.split('.'), text);
  };

  for (const [key, translations] of Object.entries(resources)) {
    keys.add(key);
    languages.forEach(lang => addResources(lang, key, translations[lang]));
  }

  return languages.reduce((files, lang) => {
    const file = path.join(outPath, `${lang}.json`);
    const content = JSON.stringify(_resources[lang], null, 4);
    files[file] = {
      source: () => new Buffer(content),
      size: () => new Buffer.byteLength(content),
    };
    return files;
  }, {});

  // languages.forEach((lang) => {
  //   const file = path.join(outPath, `${lang}.json`);
  //   const content = JSON.stringify(_resources[lang], null, 4);
  //   fs.writeFileSync(file, content, { flag: 'w', encoding: 'utf8' });
  // });

  if (keysType) {
    const keysTypeTs = /* language=TS */ `
type TranslationKeys = ${Array.from(keys.values())
    .map(key => `'${key}'`)
    .join('\n\t\t| ')};

 export default TranslationKeys
        `;

    fs.writeFileSync(keysTypesFile, keysTypeTs, {
      flag: 'w',
      encoding: 'utf8',
    });
  }
}
