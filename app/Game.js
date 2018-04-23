import 'phaser';

import CrewScene from './scenes/CrewScene.js';
import BootScene from './scenes/BootScene.js';
import NeedEthScene from './scenes/NeedEthScene.js';
import UnitScene from './scenes/UnitScene.js';
import TransactionScene from './scenes/TransactionScene.js';

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
            scene: [BootScene, CrewScene, UnitScene, TransactionScene, NeedEthScene]
        };

        this.gameEngine = new Phaser.Game(gameConfig);
    }
}