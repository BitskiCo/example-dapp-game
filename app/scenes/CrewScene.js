import TokenService from '../services/TokenService.js';
import { Scene } from 'phaser';
import styles from '../utils/styles';

const characterPositions = [
    [200, 340],
    [520, 300],
    [840, 380],
    [360, 620],
    [680, 620],
];

export default class CrewScene extends Scene {
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
        TokenService.currentNetwork().then(tokenService => {
            game.scene.start('transaction', {
                method: tokenService.mintNewToken(),
                completion: function(receipt) {
                    tokenService.list().then(function(tokens){
                        game.scene.stop('transaction');
                        game.scene.start('crew', { tokens: tokens });
                    });
                }
            });
        });
    }

    create(config) {
        let game = this;

        this.make.text({
            x: 0,
            y: 1200,
            origin: { x: 0, y: 1 },
            padding: 20,
            text: "These are the crypto characters you own from our smart contract. Each character is represented by a unique ERC-721 token which determines its appearance.\n\nWe allow you to \"mint\" up to five characters via our smart contract.",
            style: styles.explanation
        });

        let totalTokens = config.tokens.length;

        for (var i = 0; i < totalTokens; i++) {
            let token = config.tokens[i];
            let tokenNumber = token.id;
            let character = token.imageId;
            let characterPosition = characterPositions[i];
            let characterImage = this.physics.add.image(characterPosition[0], characterPosition[1], `character-${character}`);
            characterImage.setScale(1.2);
            characterImage.setOrigin(0,0);
            let velocityX = Math.random() * (100 - (-100)) + (-100);
            let velocityY = Math.random() * (300 - (-300)) + (-300);
            characterImage.setVelocity(velocityX, velocityY);
            characterImage.setBounce(1, 1);
            characterImage.setGravityY(200);
            characterImage.setCollideWorldBounds(true);

            characterImage.setInteractive({ useHandCursor: true });
            characterImage.on('pointerup', function(pointer) {
                game.scene.start('unit', { token: token, tokenService: config.tokenService });
            });
        }

        this.physics.world.setBounds(0, 168, 1100, 500);

        let title = '...'

        if (totalTokens === 1) {
            title = 'You have 1 guy!';
        } else if (totalTokens < 5) {
            title = 'You have ' + totalTokens + ' guys!';
        } else {
            title = 'You have a complete crew!';
        }

        this.sys.make.text({
            x: 600,
            y: 0,
            origin: { x: 0.5, y: 0 },
            padding: 20,
            text: title,
            style: styles.title
        });

        this.logOutButton = this.sys.make.text({
            x: 1180,
            y: 20,
            padding: 20,
            origin: { x: 1, y: 0 },
            style: styles.secondaryButton,
            text: 'Sign Out'
        });
        this.logOutButton.setInteractive({ useHandCursor: true });
        this.logOutButton.on('pointerup', () => {
           window.signOut();
        });

        if (totalTokens < 5) {
            let button = this.sys.make.text({
                x: 600,
                y: 950,
                padding: 20,
                origin: { x: 0.5, y: 1 },
                style: styles.primaryButton,
                text: 'Get Another Character'
            });
            button.setInteractive({ useHandCursor: true });
            button.on('pointerup', this.mintToken, this);
        }
    }
};
