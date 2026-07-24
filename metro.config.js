const fs = require('fs');
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const defaultResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === '@/assets/corpus/chunks.json' ||
    moduleName.endsWith('/assets/corpus/chunks.json') ||
    moduleName === './assets/corpus/chunks.json' ||
    moduleName === '../assets/corpus/chunks.json' ||
    moduleName === '../../assets/corpus/chunks.json'
  ) {
    const chunksPath = path.join(__dirname, 'assets/corpus/chunks.json');
    const seedPath = path.join(__dirname, 'assets/corpus/seed.json');
    const target = fs.existsSync(chunksPath) ? chunksPath : seedPath;
    return {
      filePath: target,
      type: 'sourceFile',
    };
  }

  if (defaultResolve) {
    return defaultResolve(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
