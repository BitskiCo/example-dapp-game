module.exports = function(done) {
  // Change this to your account
  const bitskiAccount = '0xc20c5CCB44E6092C712A1B895DF6D72eA53B40F5';
  web3.eth.getAccounts().then((accounts) => {
    return web3.eth.sendTransaction({ from: accounts[0], to: bitskiAccount, value: 1000000000000000000 });
  }).then(() => {
    console.log(`Sent 1 ETH to ${bitskiAccount}`);
    done();
  }).catch(error => console.error(error));
};
