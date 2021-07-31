import { readFileSync } from 'fs';
import { buildI18nLocales } from './build';
const path = require('path');


export default class AwesomeI18NPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const pluginName = AwesomeI18NPlugin.name;
    
    compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) => {
      compilation.fileDependencies = [...(compilation.fileDependencies || []), this.options.file]
      const changedTimes = (compiler.watchFileSystem.wfs || compiler.watchFileSystem).watcher.mtimes;
      const { startTime = 0 } = compiler.watchFileSystem.watcher;

      if (!changedTimes[this.options.file] || !!path.extname(this.options.file) && changedTimes[this.options.file] > startTime) {
        Object.entries(this.buildLocales()).forEach(([path, content]) => {
          compilation.assets[path] = content;
        });
      }

      callback()
    });
  }


  buildLocales(file = this.options.file, outPath = this.options.localesDir) {
    try {
      const content = readFileSync(file, { encoding: 'utf-8' });
      const { languages, resources } = JSON.parse(content);
      return buildI18nLocales({
        outPath,
        languages,
        resources,
        keysType: this.options.genKeysTypes,
        keysTypesFile: this.options.keysTypesFile,
      });
    } catch (e) {
      console.error(e);
    }
  }
}
