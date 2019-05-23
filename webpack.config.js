require('dotenv').config();
const webpack = require('webpack');
const path = require('path');
const BitskiConfig = require('./bitski.config.js');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = env => {
  // Configuration options
  const envName = process.env.NODE_ENV || 'development';
  const environment = BitskiConfig.environments[envName];
  const rpcUrl = environment.network.rpcUrl;
  const chainId = environment.network.chainId;
  const networkName = environment.network.name;
  const bitskiClientId = process.env.BITSKI_CLIENT_ID;
  const bitskiRedirectURL = environment.redirectURL;
  const contractAddress = process.env.CONTRACT_ADDRESS || false;
  const sentryDSN = envName == 'production' && process.env.SENTRY_DSN || false;
  const devtool = envName == 'development' ? 'source-map' : false;

  const tokenURIBaseURL = 'https://example-dapp-1-api.bitski.com/tokens/'; //Change this to your backend. Token id will be appended.

  return {
    devtool: devtool,
    entry: './app/index.js',

    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [{
          test: [/\.vert$/, /\.frag$/],
          use: 'raw-loader'
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader'
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
        'PROVIDER_CHAIN_ID': JSON.stringify(chainId),
        'PROVIDER_RPC_URL': JSON.stringify(rpcUrl),
        'EXPECTED_NETWORK_NAME': JSON.stringify(networkName),
        'BITSKI_CLIENT_ID': JSON.stringify(bitskiClientId),
        'BITSKI_REDIRECT_URL': JSON.stringify(bitskiRedirectURL),
        'TOKEN_URI_BASE_URL': JSON.stringify(tokenURIBaseURL),
        'CONTRACT_ADDRESS': JSON.stringify(contractAddress),
        'SENTRY_DSN': JSON.stringify(sentryDSN)
      })
    ]
  }
};
