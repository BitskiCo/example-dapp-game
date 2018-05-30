import BaseScene from './BaseScene.js';
import TokenService from '../services/TokenService.js';

const buttonStyle = {
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center',
    backgroundColor: '#2B67AB'
};

const deleteStyle = {
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center',
    backgroundColor: '#E95C3B'
};

const whatsHappeningStyle = {
    backgroundColor: '#333333',
    font: '16px Arial',
    fill: 'white',
    wordWrap: { width: 600 }
}

export default class UnitScene extends BaseScene {
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
        super.create(config);

        this.make.text({
            x: 0,
            y: 600,
            origin: { x: 0, y: 1 },
            padding: 10,
            text: "Whats Happening?\n\nThis is one of the ERC721 tokens you own!\n\nAnyone can verity that you are the owner of this token. You can send it to someone else.\n\nWe also let you 'delete' tokens (by sending them back to the contract) in case you don't like the token you got.",
            style: whatsHappeningStyle
        });

        let token = config.token;
        let tokenNumber = web3.utils.toBN(token);
        let numCharacters = web3.utils.toBN(5);
        let characterIndex = tokenNumber.mod(numCharacters).toNumber();
        let character = characterIndex + 1;
        this.sys.add.image(300, 300, 'character-' + character);

        let backButtonConfig = {
            x: 0,
            y: 0,
            origin: { x: 0, y: 0 },
            padding: 10,
            text: 'Back',
            style: buttonStyle
        };

        let backButton = this.sys.make.text(backButtonConfig);

        backButton.setInteractive();
        backButton.on('pointerdown', this.back, this);

        let deleteButtonConfig = {
            x: 600,
            y: 0,
            padding: 10,
            origin: { x: 1, y: 0 },
            text: 'Delete',
            style: deleteStyle
        };

        let deleteButton = this.sys.make.text(deleteButtonConfig);

        deleteButton.setInteractive();
        deleteButton.on('pointerdown', (event) => {
            this.deleteToken.call(this, event, token);
        });
    }

    back() {
        this.scene.stop('unit');
        this.scene.start('boot');
    }

    deleteToken(event, token) {
        let game = this;
        let tokenService = new TokenService("42"); // Kovan
        game.scene.start('transaction', {
            method: tokenService.delete(token),
            completion: function(receipt) {
                tokenService.list().then(function(tokens){
                    game.scene.stop('transaction');
                    game.scene.start('crew', { tokens: tokens });
                });
            }
        });
    }
};
