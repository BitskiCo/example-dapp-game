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
                return new TokenService(networkID, accounts[0], TOKEN_URI_BASE_URL);
            });
        });
    }

    /**
     * Loads our contract from its ABI.
     *
     * @param {string} networkID The network ID of the network we are deployed on.
     * @param {string} defaultAccount The account we will be sending from.
     * @param {string} tokenURIBaseURL The base url to use for token URIs
     */
    constructor(networkID, defaultAccount, tokenURIBaseURL) {
        this.tokenURIBaseURL = tokenURIBaseURL;
        if (lmnftArtifacts && lmnftArtifacts.abi) {
            const abi = lmnftArtifacts.abi;
            if (CONTRACT_ADDRESS) {
                this.initContract(abi, CONTRACT_ADDRESS, defaultAccount);
            } else if (lmnftArtifacts.networks && lmnftArtifacts.networks[networkID] && lmnftArtifacts.networks[networkID].address) {
                const address = lmnftArtifacts.networks[networkID].address;
                this.initContract(abi, address, defaultAccount);
            } else {
                throw Error(`Contract not deployed on current network (${networkID}). Run truffle migrate first and try again.`);
            }
        } else {
            throw Error('Contract not compiled or not found');
        }

    }

    initContract(abi, address, defaultAccount) {
        this.address = address;
        this.contract = new web3.eth.Contract(abi, address);
        this.contract.setProvider(window.web3.currentProvider);
        let account = defaultAccount;
        if (account) {
            this.contract.defaultAccount = account;
            this.contract.options.from = account;
        }
    }

    /**
     * Creates a new token, as long as we are not over our limit.
     */
    mintNewToken() {
        let randomTokenID = web3.utils.randomHex(32);
        const tokenIdString = web3.utils.hexToNumberString(randomTokenID);
        return this.contract.methods.mintWithTokenURI(this.contract.defaultAccount, randomTokenID, `${this.tokenURIBaseURL}${tokenIdString}`);
    }

    /**
     * Deletes a token by transfering it to the contract address.
     *
     * @param {string} token the ID of the token we want to delete.
     */
    delete(token) {
        return this.contract.methods.burn(token);
    }

    /**
     * Gets a list of all tokens owned by us.
     */
    list() {
        return this.balance().then(balance => {
            var promises = [];
            for (var i=0; i < balance; i++) {
                promises.push(this.contract.methods.tokenOfOwnerByIndex(this.contract.defaultAccount, i).call().then(tokenId => {
                    return this.contract.methods.imageId(tokenId).call().then(imageId => {
                        return { id: tokenId, imageId: imageId };
                    });
                }));
            }
            return Promise.all(promises);
        });
    }

    /**
     * Gets a count of our tokens.
     */
    balance() {
        return this.contract.methods.balanceOf(this.contract.defaultAccount).call();
    }
}
