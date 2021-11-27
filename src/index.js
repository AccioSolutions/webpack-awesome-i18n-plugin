import { readFileSync } from 'fs';
import { buildI18nLocales } from './build';
const path = require('path');


export default class AwesomeI18NPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const pluginName = AwesomeI18NPlugin.name;
    const { webpack } = compiler;
    const { Compilation } = webpack;
    console.log(compiler.options);

    const isWebpack5 = compiler.webpack ? parseInt(compiler.webpack.version, 10) === 5 : false;

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.fileDependencies.add(this.options.file);

      const changedTimes = isWebpack5 ? compiler.watchFileSystem.watcher.getTimes() : (compiler.watchFileSystem.wfs || compiler.watchFileSystem).watcher.mtimes;
        
      const { startTime = 0 } = compiler.watchFileSystem.watcher;
      if (!changedTimes[this.options.file] || (!!path.extname(this.options.file) && changedTimes[this.options.file] > startTime)) {

        compilation.hooks.processAssets.tap({ name: pluginName, stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS }, (assets) => {
          Object.entries(this.buildLocales()).forEach(([path, content]) => {
            compilation.emitAsset(path, content)
          })
        })
      }
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
