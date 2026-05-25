const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Watch the parent workspace so we can import from ../src/app/data/* directly.
// This lets the mobile app share the same content database as the web app —
// one source of truth for stories, music, queries, types.
config.watchFolders = [workspaceRoot];

// Tell Metro to resolve node_modules from BOTH the mobile project and the
// workspace root (otherwise imports from ../src might try to resolve packages
// from the wrong node_modules).
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver.disableHierarchicalLookup = true;

// Don't watch platform-managed transient dirs (workflow logs rotate frequently
// and trigger ENOENT in Metro's file watcher under Nix).
config.resolver.blockList = [
  /\/\.local\/state\/.*/,
  /\/\.cache\/.*/,
];

module.exports = config;
