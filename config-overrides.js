const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = function override(config, env) {
  // Ensure the entry is correctly set (if you need to override it)
  config.entry = './src/index.js';

  // Set fallbacks for Node.js core modules for compatibility in the browser
  config.resolve.fallback = {
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    zlib: require.resolve('browserify-zlib'),
    querystring: require.resolve('querystring-es3'),
    path: require.resolve('path-browserify'),
    crypto: require.resolve('crypto-browserify'),
    fs: require.resolve('browserify-fs'),
    stream: require.resolve('stream-browserify'),
    net: require.resolve('net-browserify'),
    tls: require.resolve('tls-browserify'),
    buffer: require.resolve('buffer/'),
    url: require.resolve('url/')
  };

  // Configure plugins
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /express/
    }),
    new BundleAnalyzerPlugin()

  );

  return config;
};
