import { readFileSync } from 'fs';
import { buildI18nLocales } from './build';
const path = require('path');


export default class AwesomeI18NPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const isWebpack5 = compiler.webpack ? parseInt(compiler.webpack.version, 10) === 5 : false;
    this.buildLocales();
    compiler.hooks.done.tap('AwesomeI18NPlugin', ({ compilation }) => {
      compilation.fileDependencies.add(this.options.file);
    });

    compiler.hooks.watchRun.tap('WatchRun', (comp) => {
      const changedTimes = isWebpack5
        ? compiler.watchFileSystem.watcher.getTimes()
        : (compiler.watchFileSystem.wfs || compiler.watchFileSystem).watcher.mtimes;

      const { startTime = 0 } = compiler.watchFileSystem.watcher;

      const files = Object.keys(changedTimes).filter((file) => {
        const fileExt = path.extname(file);

        return (
          file.includes(this.options.file) && !!fileExt && changedTimes[file] > startTime
        );
      });

      if (!files.length) {
        return;
      }

      this.buildLocales();
    });
  }


  buildLocales(file = this.options.file, outPath = this.options.localesDir) {
    try {
      const content = readFileSync(file, { encoding: 'utf-8' });
      const { languages, resources } = JSON.parse(content);
      buildI18nLocales({ 
        outPath, 
        languages, 
        resources, 
        keysType: this.options.genKeysTypes,
        keysTypesFile: this.options.keysTypesFile
       });
    } catch (e) {
      console.error(e);
    }
  }
}