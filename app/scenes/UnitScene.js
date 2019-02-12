import { Scene } from 'phaser';
import TokenService from '../services/TokenService.js';

const buttonStyle = {
    fontSize: '64px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center',
    backgroundColor: '#2B67AB'
};

const deleteStyle = {
    fontSize: '64px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center',
    backgroundColor: '#E95C3B'
};

const whatsHappeningStyle = {
    backgroundColor: '#333333',
    font: '32px Arial',
    fill: 'white',
    wordWrap: { width: 1200 }
}

export default class UnitScene extends Scene {
    constructor() {
        super({ key: 'unit', active: false });
    }

    preload() {
        this.load.image('character-1', 'assets/character-1.png');
        this.load.image('character-2', 'assets/character-2.png');
        this.load.image('character-3', 'assets/character-3.png');
        this.load.image('character-4', 'assets/character-4.png');
        this.load.image('character-5', 'assets/character-5.png');
    }

    create(config) {
        this.make.text({
            x: 0,
            y: 1200,
            origin: { x: 0, y: 1 },
            padding: 20,
            text: "Whats Happening?\n\nThis is one of the ERC721 tokens you own!\n\nAnyone can verity that you are the owner of this token. You can send it to someone else.\n\nWe also let you 'delete' tokens (by sending them back to the contract) in case you don't like the token you got.",
            style: whatsHappeningStyle
        });

        const token = config.token;
        const character = token.imageId;
        const characterImageString = `character-${character}`;
        const characterImage = this.sys.add.image(600, 600, characterImageString);
        characterImage.setScale(1.5);

        characterImage.setInteractive();
        characterImage.on('pointerup', () => {
            window.open(`https://rinkeby.opensea.io/assets/${config.tokenService.address}/${token.id}`, '_blank');
        });

        let backButtonConfig = {
            x: 0,
            y: 0,
            origin: { x: 0, y: 0 },
            padding: 20,
            text: 'Back',
            style: buttonStyle
        };

        let backButton = this.sys.make.text(backButtonConfig);

        backButton.setInteractive();
        backButton.on('pointerup', this.back, this);

        let deleteButtonConfig = {
            x: 1200,
            y: 0,
            padding: 20,
            origin: { x: 1, y: 0 },
            text: 'Delete',
            style: deleteStyle
        };

        let deleteButton = this.sys.make.text(deleteButtonConfig);

        deleteButton.setInteractive();
        deleteButton.on('pointerup', (event) => {
            this.deleteToken.call(this, event, token);
        });
    }

    back() {
        this.scene.stop('unit');
        this.scene.start('boot');
    }

    deleteToken(event, token) {
        let game = this;
        TokenService.currentNetwork().then(tokenService => {
            game.scene.start('transaction', {
                method: tokenService.delete(token.id),
                completion: function(receipt) {
                    tokenService.list().then(function(tokens){
                        game.scene.stop('transaction');
                        game.scene.start('crew', { tokens: tokens });
                    });
                }
            });
        });
    }
};
