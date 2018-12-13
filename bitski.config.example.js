module.exports = {
  app: {
    id: 'YOUR-CLIENT-ID', //change this to your app's client id
  },
  appWallet: {
    client: {
      //if you have an app wallet, add your client id and secret here
      id: 'YOUR-APP-WALLET-CLIENT-ID',
      secret: 'YOUR-APP-WALLET-SECRET'
    },
    auth: {
      tokenHost: 'https://account.bitski.com',
      tokenPath: '/oauth2/token'
    }
  },
  environments: {
    development: {
      network: 'development', //ethereum network to use for local dev
      redirectURL: 'http://localhost:3000/public/callback.html', //url the popup will redirect to when logged in
      netId: 4447
    },
    production: {
      network: 'rinkeby', //ethereum network to use for production
      redirectURL: 'https://mydomain.com/public/callback.html', //url the popup will redirect to when logged in
      netId: 4
    }
  },
  networkIds: {
    kovan: 'kovan',
    rinkeby: 'rinkeby',
    live: 'mainnet',
    development: 'http://localhost:9545' //Update this if you use Ganache or another local blockchain
  }
};
