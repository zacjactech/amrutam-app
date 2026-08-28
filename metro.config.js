// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add SVG transformer
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

// Exclude SVGs from asset handling
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');

// Add SVG to source extensions
config.resolver.sourceExts.push('svg');

module.exports = config;
