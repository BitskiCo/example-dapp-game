const webpack = require('webpack');
const path = require('path');
const truffleConfig = require('./truffle.js');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


const BITSKI_CLIENT_ID = 'F3YKmUz8wJPevbjd0LJOfSTkg4IiwWlcypE6AdBXweui1lhjC1kcGDgBCub35QkO';

module.exports = env => {
  let providerID;

  switch (env.network) {
  case undefined:
  case 'development':
    providerID = `http://${truffleConfig.networks.development.host}:${truffleConfig.networks.development.port}`;
    break;
  default:
    providerID = env.network;
  }

  return {
    devtool: 'source-map',
    entry: './app/index.js',

    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [{
          test: [/\.vert$/, /\.frag$/],
          use: 'raw-loader'
        }, {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',

          options: {
            presets: ['env']
          }
        }
      ]
    },

    plugins: [
      new HTMLWebpackPlugin({
        title: 'Example Dapp',
        template: './app/index.html',
        hash: true
      }),
      new HTMLWebpackPlugin({
        title: 'Example Dapp',
        filename: 'callback.html',
        template: './app/callback.html',
        hash: true
      }),
      new CopyWebpackPlugin([
        {
          from: 'assets',
          to: 'assets'
        }, {
        from: 'public',
          to: 'public'
        }
      ]),
      new webpack.DefinePlugin({
        'CANVAS_RENDERER': JSON.stringify(true),
        'WEBGL_RENDERER': JSON.stringify(true),
        'BITSKI_PROVIDER_ID': JSON.stringify(providerID),
        'BITSKI_CLIENT_ID': JSON.stringify(BITSKI_CLIENT_ID),
        'SENTRY_DSN': JSON.stringify(env.sentryDSN || false)
      })
    ]
  }
};
