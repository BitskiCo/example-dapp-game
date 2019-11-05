import Game from './Game.js';
import ClipboardJS from 'clipboard';
import { Bitski, AuthenticationStatus, AuthenticationError, AuthenticationErrorCode, OAuthSignInMethod } from 'bitski';
import Raven from 'raven-js';
import Web3 from 'web3';
import '@babel/polyfill';

if (SENTRY_DSN) {
  Raven.config(SENTRY_DSN).install();
}

const redirectUrl = window.matchMedia('(display-mode: standalone)').matches ? window.location.href : BITSKI_REDIRECT_URL;
let bitski = new Bitski(BITSKI_CLIENT_ID, redirectUrl);

// Load webfonts before rendering app
WebFont.load({
  google: {
    families: ['Acme']
  },
  active: () => {
    if (window.location.href.includes("code") || window.location.href.includes("error")) {
      bitski.redirectCallback().catch((error) => {
        document.getElementById('error').innerText = (error && error.message) || error;
        console.error(JSON.stringify(error));
      }).finally(() => {
        start();
      });
    } else {
      start();
    }
  }
});


window.signOut = function() {
  bitski.signOut().then(() => {
    window.game.gameEngine.destroy(true);
    document.getElementById('signed-out').style.display = 'block';
    document.getElementById('signed-in').style.display = 'none';
  }).catch((error) => {
    console.error(error);
    window.game.gameEngine.destroy(true);
    document.getElementById('signed-out').style.display = 'block';
    document.getElementById('signed-in').style.display = 'none';
  });
};

function start() {
    // Setup ClipboardJS
    let clipboard = new ClipboardJS('#copy-address');

    // Setup Metamask Button
    configureMetamaskButton();

    // Define a bitski network to use, from env variables
    const network = {
      rpcUrl: PROVIDER_RPC_URL,
      chainId: PROVIDER_CHAIN_ID,
    };


    let authMethod = OAuthSignInMethod.Popup;

    if (window.matchMedia('(display-mode: standalone)').matches) {
      authMethod = OAuthSignInMethod.Redirect;
    }

    // Configure bitski connect button (whether we use it or not)
    bitski.getConnectButton({ authMethod: authMethod, container: document.getElementById('connect-button') }, (error, user) => {
      // Check for errors
      if (error) {
        // Check to see if the user cancelled the request
        if (error instanceof AuthenticationError && error.code === AuthenticationErrorCode.UserCancelled) {
          // Just log for informational purposes
          console.log('Debug: User Cancelled');
        } else {
          // Regular error
          document.getElementById('error').innerText = (error && error.message) || error;
          console.error(error);
        }
      }
      // Check for user (successfully logged in)
      if (user) {
        showApp(bitski.getProvider({ network }));
      }
    });

    // Determine logged in state to configure the UI for the current state
    if (bitski.authStatus === AuthenticationStatus.NotConnected) {
      // Handle logged out state: show log in
      showLoginButton();
    } else {
      // Handle logged in / expired state: continue to app
      // Get a provider, passing the network configuration
      const provider = bitski.getProvider({ network });
      // Show the app UI
      showApp(provider);
    }
}

// Initialize a web3 instance with the given provider,
// and show the app UI
function showApp(provider) {
  window.web3 = new Web3(provider);
  web3.eth.net.getId().then(netId => {
    if (netId !== PROVIDER_CHAIN_ID) {
      alert(`Please set your network to ${EXPECTED_NETWORK_NAME}`);
    } else {
      document.getElementById('signed-out').style.display = 'none';
      document.getElementById('signed-in').style.display = 'block';
      window.game = new Game(document.getElementById('game'), web3);

      web3.eth.getAccounts().then((accounts) => {
        if (accounts[0]) {
          document.getElementById('your-address').innerText = accounts[0];
          document.getElementById('copy-address').dataset.clipboardText = accounts[0];
        }
      });
    }
  });
}

// Hide the app UI, and show the log in UI
function showLoginButton() {
  document.getElementById('signed-out').style.display = 'block';
  document.getElementById('signed-in').style.display = 'none';
}

// Configures a button for using an in-page provider (metamask)
function configureMetamaskButton() {
  var metamaskButton = document.getElementById('metamask-button');
  if (metamaskButton) {
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
      window.ethereum.enable().then(() => {
        showApp(window.ethereum);
      });
    };

    // Only show the button if window.ethereum is defined
    if (window.ethereum) {
      metamaskButton.style.display = 'block';
    } else {
      metamaskButton.style.display = 'none';
    }
  }
}
