import Game from './Game.js';

import { Bitski } from 'bitski';

import Web3 from 'web3';

window.addEventListener('load', function () {
  let url = new URL(window.location.href);
  let redirectURL = url.origin + "/callback.html";
  let bitski = new Bitski('F3YKmUz8wJPevbjd0LJOfSTkg4IiwWlcypE6AdBXweui1lhjC1kcGDgBCub35QkO', 'kovan', redirectURL);

  if (window.location.pathname === '/callback.html') {
    return;
  }

  var web3 = window.web3;

  if (web3) {
    web3 = new Web3(web3.currentProvider)
    window.web3 = web3;
    showApp(web3);
  } else {

    web3 = bitski.getWeb3();
    window.web3 = web3;

    bitski.getSignedInUser().then(function (user) {
      showApp(bitski.getWeb3());
    }).catch(function (error) {
      showLoginButton(bitski);
    });
  }
})

function showApp(web3) {
  document.getElementById('signed-out').style.display = 'none';
  document.getElementById('signed-in').style.display = 'block';
  window.game = new Game(document.getElementById('game'), web3);
}

function showLoginButton(bitski) {
  document.getElementById('signed-out').style.display = 'block';
  document.getElementById('signed-in').style.display = 'none';

  var connectButton = bitski.getConnectButton(document.getElementById('connect-button'));
  connectButton.callback = function (error, user) {
    if (error) {
      console.error(error);
    }

    if (user) {
      showApp(bitski.getWeb3());
    }
  }
}