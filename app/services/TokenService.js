import BigNumber from 'bignumber.js'

const lmnft_artifacts = require('../../build/contracts/LimitedMintableNonFungibleToken.json');

export default class TokenService {
    static currentNetwork() {
        return web3.eth.net.getId().then(function(networkID){
            return web3.eth.getAccounts().then(function(accounts){
                return new TokenService(networkID, accounts[0]);
            });
        });
    }

    constructor(networkID, defaultAccount) {
        this.contract = new web3.eth.Contract(lmnft_artifacts.abi, lmnft_artifacts.networks[networkID].address);
        this.contract.setProvider(window.web3.currentProvider);
        if (defaultAccount) {
            this.contract.defaultAccount = defaultAccount;
            this.contract.options.from = defaultAccount;
        }
    }

    mintNewToken() {
        let randomTokenID = web3.utils.randomHex(256);
        return this.contract.methods.mint(randomTokenID).send({gas: 7000000});
    }

    deleteToken(token) {
        return this.contract.methods.transfer(this.contract._address, token).send({gas: 7000000});
    }

    listTokens() {
        return this.contract.methods.getOwnerTokens(this.contract.defaultAccount).call();
    }

    getBalance() {
        return this.contract.methods.balanceOf(this.contract.defaultAccount).call();
    }
}