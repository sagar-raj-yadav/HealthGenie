// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for web by enabling .web.js files
config.resolver.sourceExts = process.env.RN_SRC_EXT 
  ? [...process.env.RN_SRC_EXT.split(','), ...config.resolver.sourceExts] 
  : [...config.resolver.sourceExts, 'web.tsx', 'web.ts', 'web.jsx', 'web.js'];

module.exports = config;
