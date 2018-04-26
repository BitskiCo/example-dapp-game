import Game from './Game.js';

import { Bitski } from 'bitski';

import Web3 from 'web3';

window.addEventListener('load', function () {
  let url = new URL(window.location.href);
  let redirectURL = url.origin + "/callback.html";
  let bitski = new Bitski('F3YKmUz8wJPevbjd0LJOfSTkg4IiwWlcypE6AdBXweui1lhjC1kcGDgBCub35QkO', redirectURL);
  configureMetamaskButton();

  if (window.location.pathname === '/callback.html') {
    bitski.signInCallback();
    return;
  }

  bitski.getUser().then(function (user) {
    if (user) {
      showApp(bitski.getWeb3('kovan'));
    } else {
      showLoginButton(bitski);
    }
  }).catch(function (error) {
    showLoginButton(bitski);
  });
})

function showApp(web3) {
  window.web3 = web3;

  document.getElementById('signed-out').style.display = 'none';
  document.getElementById('signed-in').style.display = 'block';
  window.game = new Game(document.getElementById('game'), web3);

  web3.eth.getAccounts().then((accounts) => {
    document.getElementById('wallet-address').innerText = accounts[0] || "locked";
  });
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
      showApp(bitski.getWeb3('kovan'));
    }
  }


}

function configureMetamaskButton() {
  var metamaskButton = document.getElementById('metamask-button');

  metamaskButton.style.fontFamily = '-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, \'Helvetica Neue\', sans-serif';
  metamaskButton.style.fontWeight = 'bold';
  metamaskButton.style.backgroundColor = '#F79220';
  metamaskButton.style.backgroundRepeat = 'no-repeat';
  metamaskButton.style.backgroundPositionY = '50%';
  metamaskButton.style.color = '#fff';
  metamaskButton.style.border = 'none';
  metamaskButton.style.margin = '0';
  metamaskButton.style.padding = '0';
  metamaskButton.style.cursor = 'pointer';
  metamaskButton.style.borderRadius = '6px';
  metamaskButton.style.fontSize = '12px';
  metamaskButton.style.height = '28px';
  metamaskButton.style.lineHeight = '28px';
  metamaskButton.style.paddingLeft = '14px';
  metamaskButton.style.paddingRight = '14px';

  metamaskButton.onclick = function() {
    web3 = new Web3(web3.currentProvider)
    showApp(web3);
  };

  if (typeof(web3) !== 'undefined') {
    metamaskButton.style.display = 'block';
  } else {
    metamaskButton.style.display = 'none';
  }
}