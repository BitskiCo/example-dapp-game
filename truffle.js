module.exports = {
  networks: {
    kovan:{
      gas: 100000000000,
      network_id: '*',
      host:'localhost',
      port:8545
    },
    development: {
      host: "localhost",
      port: 7545,
      network_id: "5777"
    }
  }
};
