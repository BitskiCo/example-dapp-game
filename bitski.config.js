const { Mainnet, Rinkeby, Kovan } = require('bitski');

const Local = {
  rpcUrl: 'http://localhost:9545',
  chainId: 5777,
  name: 'local'
};

module.exports = {
  environments: {
    development: {
      redirectURL: 'http://localhost:3000/public/callback.html', //url the popup will redirect to when logged in
      network: Rinkeby, // change this to Local to use with truffle develop
    },
    production: {
      network: Rinkeby, // ethereum network to use for production
      redirectURL: 'https://example-dapp-1.bitski.com/public/callback.html', // url the popup will redirect to when logged in
    }
  }
};
