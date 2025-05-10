const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure the Metro bundler handles web properly by resolving for `react-native-web`
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
