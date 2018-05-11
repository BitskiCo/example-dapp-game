import TokenService from '../services/TokenService.js';
import BaseScene from './BaseScene.js';
import Phaser from 'phaser';

const labelStyle = {
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center',
    backgroundColor: '#2DAA58'
};

const buttonStyle = {
    fontSize: '32px',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#ffffff',
    align: 'center',
    backgroundColor: '#2B67AB'
};

const whatsHappeningStyle = {
    backgroundColor: '#333333',
    font: '16px Arial',
    fill: 'white',
    wordWrap: { width: 580 }
}

const characterPositions = [
    [100, 170],
    [260, 150],
    [420, 190],
    [180, 310],
    [340, 310],
];

export default class CrewScene extends BaseScene {
    constructor() {
        super({ key: 'crew', active: false });
        this.tokens = [];
    }

    preload() {
        console.log('[CREW] preload');
        this.load.image('character-1', 'assets/character-1.png');
        this.load.image('character-2', 'assets/character-2.png');
        this.load.image('character-3', 'assets/character-3.png');
        this.load.image('character-4', 'assets/character-4.png');
        this.load.image('character-5', 'assets/character-5.png');
    }

    mintToken(pointer) {
        let game = this;
        let tokenService = new TokenService("42"); // Kovan

        game.scene.start('transaction', {
            method: tokenService.mintNewToken(),
            completion: function(receipt) {
                tokenService.list().then(function(tokens){
                    game.scene.stop('transaction');
                    game.scene.start('crew', { tokens: tokens });
                });
            }
        });
    }

    create(config) {
        super.create(config);
        let game = this;

        this.make.text({
            x: 0,
            y: 600,
            origin: { x: 0, y: 1 },
            padding: 10,
            text: "Whats Happening?\n\nWe've queried the ethereum network for any ERC721 tokens that are available from our contract. For each token we calculate an appearance and show that here.\n\nIf you don't have any tokens we let you 'mint' up to five tokens.\n\nIf you do have a token you should see it here. That means our contract worked!",
            style: whatsHappeningStyle
        });

        let totalTokens = config.tokens.length;

        for (var i = 0; i < totalTokens; i++) {
            let token = config.tokens[i];
            let character = (token % 5) + 1;
            let characterPosition = characterPositions[i];
            let characterImage = this.physics.add.image(characterPosition[0], characterPosition[1], 'character-' + character);
            characterImage.setScale(0.7);
            characterImage.setOrigin(0,0);
            let velocityX = Math.random() * (100 - (-100)) + (-100);
            let velocityY = Math.random() * (300 - (-300)) + (-300);
            characterImage.setVelocity(velocityX, velocityY);
            characterImage.setBounce(1, 1);
            characterImage.setGravityY(200);
            characterImage.setCollideWorldBounds(true);

            characterImage.setInteractive();
            characterImage.on('pointerdown', function(pointer) {
                game.scene.stop('crew');
                game.scene.start('unit', { token: token });
            });
        }

        this.physics.world.setBounds(0, 84, 500, 250);

        var buttonTitle = '...'

        if (totalTokens === 1) {
            buttonTitle = 'You have 1 guy!';
        } else if (totalTokens < 5) {
            buttonTitle = 'You have ' + totalTokens + ' guys!';
        } else {
            buttonTitle = 'You have a complete crew!';
        }

        // TODO: Show $/Ξ price

        let labelConfig = {
            x: 300,
            y: 0,
            origin: { x: 0.5, y: 0 },
            padding: 10,
            text: buttonTitle,
            style: labelStyle
        };

        let label = this.sys.make.text(labelConfig);

        if (totalTokens < 5) {
            let buttonConfig = {
                x: 600,
                y: 0,
                padding: 10,
                origin: { x: 1, y: 0 },
                text: "Get More",
                style: buttonStyle
            };

            let button = this.sys.make.text(buttonConfig);
            button.setInteractive();
            button.on('pointerdown', this.mintToken, this);
        }
    }
};
