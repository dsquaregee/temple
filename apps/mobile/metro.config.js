// Metro config for the pnpm monorepo: watch the workspace root so changes in
// packages/core and packages/content are picked up, and resolve modules from
// both the app and the hoisted root. Symlink support (pnpm) is on by default
// in the Metro shipped with Expo SDK 51.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.disableHierarchicalLookup = false;

module.exports = config;
