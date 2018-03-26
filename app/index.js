import Game from './Game.js';

window.addEventListener('load', function () {
  var web3 = window.web3;

  if (web3) {
    web3 = new Web3(web3.currentProvider)
    loadData(web3);
  } else {
    var bitskiInstance = new bitski.Bitski('F3YKmUz8wJPevbjd0LJOfSTkg4IiwWlcypE6AdBXweui1lhjC1kcGDgBCub35QkO', 'kovan')
    web3 = bitskiInstance.getWeb3();
    window.web3 = web3;
    
    if (bitskiInstance.provider.userManager) {
      bitskiInstance.provider.userManager.getUser().then(function(user){
        if (user.expired) {
          throw "Expired";
        }
        
        document.getElementById('signed-out').style.display = 'none';
        document.getElementById('signed-in').style.display = 'block';
        loadData(web3);
      }).catch(function(error){
        showLoginButton(bitskiInstance);
      });
    } else {
      showLoginButton(bitskiInstance);
    }
  }

  window.game = new Game(document.getElementById('game'), web3);
})

function showLoginButton(bitskiInstance) {
  document.getElementById('signed-out').style.display = 'block';
  document.getElementById('signed-in').style.display = 'none';

  var connectButton = bitskiInstance.getConnectButton(document.getElementById('connect-button'));
  connectButton.callback = function (error, user) {
    document.getElementById('signed-out').style.display = 'none';
    document.getElementById('signed-in').style.display = 'block';
    loadData(web3);
  }
}

function loadData(web3) {
  web3.eth.getAccounts(function (error, accounts) {
    if (error) {
      document.getElementById('coinbase').innerText = 'Error: ' + error
      document.getElementById('balance').innerText = ''
    } else if (accounts.length == 0) {
      document.getElementById('coinbase').innerText = 'Error: no accounts'
      document.getElementById('balance').innerText = ''
    } else {
      web3.eth.getBalance(accounts[0], function (error, result) {
        if (error) {
          document.getElementById('coinbase').innerText = 'Error: ' + error
          document.getElementById('balance').innerText = ''
        } else {
          document.getElementById('coinbase').innerText = 'Wallet: ' + accounts[0]
          document.getElementById('balance').innerText = 'Balance: ' + result
        }
      })
    }
  })
}
