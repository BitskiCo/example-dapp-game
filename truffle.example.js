// Example Truffle Config using a Bitski app wallet

const BitskiTruffleProvider = require('bitski-truffle-provider');

const bitskiCredentials = {
  client: {
    id: '<YOUR CLIENT ID>',
    secret: '<YOUR CLIENT SECRET>'
  },
  auth: {
    tokenHost: "https://account.bitski.com/",
    tokenPath: "/oauth2/token"
  }
};

module.exports = {
  networks: {
    live: {
      network_id: '1',
      provider: BitskiTruffleProvider("mainnet", bitskiCredentials),
    },
    kovan: {
      network_id: '42',
      provider: BitskiTruffleProvider("kovan", bitskiCredentials),
    },
    rinkeby: {
      network_id: '4',
      provider: BitskiTruffleProvider("rinkeby", bitskiCredentials),
    },
    development: {
      host: "localhost",
      port: 9545,
      network_id: "*",
    }
  }
};
