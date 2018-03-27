import BigNumber from 'bignumber.js'

/**
 * This JSON file was created by Truffle and contains the ABI of our contract
 * as well as the address for any networks we have deployed it to.
 */
const lmnftArtifacts = require('../../build/contracts/LimitedMintableNonFungibleToken.json');

export default class TokenService {
    /**
     * Since our contract will have different addresses depending on which network
     * it is deployed on we need to load the network ID before we can initialize the
     * contract. This will happen async.
     */
    static currentNetwork() {
        return web3.eth.net.getId().then(function(networkID){
            return web3.eth.getAccounts().then(function(accounts){
                return new TokenService(networkID, accounts[0]);
            });
        });
    }

    /**
     * Loads our contract from its ABI. 
     * 
     * @param {string} networkID The network ID of the network we are deployed on.
     * @param {string} defaultAccount The account we will be sending from.
     */
    constructor(networkID, defaultAccount) {
        this.contract = new web3.eth.Contract(lmnftArtifacts.abi, lmnftArtifacts.networks[networkID].address);
        this.contract.setProvider(window.web3.currentProvider);
        let account = defaultAccount || window.web3.eth.defaultAccount;
        if (account) {
            this.contract.defaultAccount = account;
            this.contract.options.from = account;
        }
    }

    /**
     * Creates a new token, as long as we are not over our limit.
     */
    mintNewToken() {
        let randomTokenID = web3.utils.randomHex(256);
        return this.contract.methods.mint(randomTokenID);
    }

    /**
     * Deletes a token by transfering it to the contract address.
     * 
     * @param {string} token the ID of the token we want to delete.
     */
    delete(token) {
        return this.contract.methods.transfer(this.contract._address, token);
    }
    
    /**
     * Gets a list of all tokens owned by us.
     */
    list() {
        return this.contract.methods.getOwnerTokens(this.contract.defaultAccount).call();
    }

    /**
     * Gets a count of our tokens.
     */
    balance() {
        return this.contract.methods.balanceOf(this.contract.defaultAccount).call();
    }
}