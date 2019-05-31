require('dotenv').config();
const { ProviderManager } = require('bitski-node');

const manager = new ProviderManager(process.env.BITSKI_CREDENTIAL_ID, process.env.BITSKI_CREDENTIAL_SECRET);

const appWallet = {
  client: {
    id: process.env.BITSKI_CREDENTIAL_ID,
    secret: process.env.BITSKI_CREDENTIAL_SECRET
  },
  auth: {
    tokenHost: 'https://account.bitski.com',
    tokenPath: '/oauth2/token'
  }
};

module.exports = {
  compilers: {
    solc: {
      version: "^0.4.24"
    }
  },
  networks: {
    development: {
      host: "localhost",
      port: 9545,
      network_id: "*",
    },
    live: {
      network_id: '1',
      provider: () => {
        return manager.getProvider('mainnet');
      }
    },
    kovan: {
      network_id: '42',
      provider: () => {
        return manager.getProvider('kovan');
      }
    },
    rinkeby: {
      network_id: '4',
      provider: () => {
        return manager.getProvider('rinkeby');
      }
    }
  }
};
