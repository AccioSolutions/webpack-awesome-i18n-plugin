import { watch } from 'webpack-test-utils';
import AwesomeI18NPlugin from '.';

describe('AwesomeI18NPlugin', () => {

  it('shoud', async () => {
    const volume = {
      '/src/index.js': 'export default "12345"',
      '/src/locales/i18n.json': `{
        "languages": ["pt-BR", "en-US"],
        "resources": {
          "header": {
            "pt-BR": "Inicio",
            "en-US": "Home"
          }
        }
      }`,
    };

    const watching = watch(volume, config => {
      config.plugins.push(
        new AwesomeI18NPlugin({
          file: '/src/locales/i18n.json',
          localesDir: 'locales',
          genKeysTypes: false,
        })
      )
    });
    const stats = await watching.build();
    expect(stats.hasWarnings()).toBe(false);
    expect(watching.require('/demo/dist/locales/en-US.json')).toBe('');

    await watching.close();
  });
});
