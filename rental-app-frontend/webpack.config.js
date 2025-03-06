// webpack.config.js
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add basic alias for react-native
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native': 'react-native-web'
  };
  
  return config;
};
