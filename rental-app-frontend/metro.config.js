// Learn more https://docs.expo.io/guides/customizing-metro
/**
 * @type {import('expo/metro-config').MetroConfig}
 */
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
})

defaultConfig.resolver.extraNodeModules = {
  'react-native-web': path.resolve(__dirname, 'node_modules/react-native-web'),
  '../../Utilities/Platform': path.resolve(__dirname, 'node_modules/react-native-web/dist/exports/Platform'),
};

defaultConfig.resolver.blacklistRE = [
  /.*\/node_modules\/react-native\/Libraries\/Components\/TextInput\/TextInputState.native.js$/,
];

defaultConfig.resolver.sourceExts = [
  'web.tsx', 'web.ts', 'web.jsx', 'web.js',
  ...defaultConfig.resolver.sourceExts,
];

// 4. Add specific platform implementation
defaultConfig.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
  resolver: {
    platforms: ['web', 'ios', 'android'],
  },
});

// Enable Tamagui and add nice web support with optimizing compiler + CSS extraction
const { withTamagui } = require('@tamagui/metro-plugin')
module.exports = withTamagui(config, {
  components: ['tamagui'],
  config: './tamagui.config.ts',
  outputCSS: './tamagui-web.css',
})

config.resolver.sourceExts.push('mjs')

module.exports = config

// REMOVE THIS (just for tamagui internal devs to work in monorepo):
// if (process.env.IS_TAMAGUI_DEV && __dirname.includes('tamagui')) {
//   const fs = require('fs')
//   const path = require('path')
//   const projectRoot = __dirname
//   const monorepoRoot = path.resolve(projectRoot, '../..')
//   config.watchFolders = [monorepoRoot]
//   config.resolver.nodeModulesPaths = [
//     path.resolve(projectRoot, 'node_modules'),
//     path.resolve(monorepoRoot, 'node_modules'),
//   ]
//   // have to manually de-deupe
//   try {
//     fs.rmSync(path.join(projectRoot, 'node_modules', '@tamagui'), {
//       recursive: true,
//       force: true,
//     })
//   } catch {}
//   try {
//     fs.rmSync(path.join(projectRoot, 'node_modules', 'tamagui'), {
//       recursive: true,
//       force: true,
//     })
//   } catch {}
//   try {
//     fs.rmSync(path.join(projectRoot, 'node_modules', 'react'), {
//       recursive: true,
//       force: true,
//     })
//   } catch {}
//   try {
//     fs.rmSync(path.join(projectRoot, 'node_modules', 'react-dom'), {
//       recursive: true,
//       force: true,
//     })
//   } catch {}
// }
