import 'phaser';

import Contract from 'truffle-contract';
import CrewScene from './scenes/CrewScene.js';
import BootScene from './scenes/BootScene.js';
import UnitScene from './scenes/UnitScene.js';

/**
 * This will get loaded by WebPack as long as we have already run truffle compile
 */
const lmnft_artifacts = require('./../build/contracts/LimitedMintableNonFungibleToken.json');

export default class Game {
    constructor(parentElement, web3) {
        this.web3 = web3;
        this.loadGame();

        while (parentElement.firstChild) {
            parentElement.removeChild(parentElement.firstChild);
        }

        parentElement.appendChild(this.gameEngine.canvas);         
    }

    
    
    loadGame() {
        const gameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: {
                        y: 200
                    }
                }
            },
            scene: [BootScene, CrewScene, UnitScene]
        };
        
        this.gameEngine = new Phaser.Game(gameConfig);
    }

    loadAssets(web3) {
        var game = this;

        web3.eth.getCoinbase().then(function(coinbase){
            var LimitedMintableNonFungibleToken = Contract(lmnft_artifacts);
            LimitedMintableNonFungibleToken.setProvider(web3.currentProvider);
            LimitedMintableNonFungibleToken.deployed().then(function(instance){
                return instance.balanceOf.call(coinbase).then(function(balance){
                    if (balance) {
                        console.log("Balance is " + balance);
                    } else {
                        game.showEmptyScreen();
                    }
                });
            }).catch(function(error){
                console.log("Error getting balance: " + error);
            });
        });
    }


}