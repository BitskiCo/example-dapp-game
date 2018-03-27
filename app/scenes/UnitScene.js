import TokenService from '../services/TokenService.js';

const buttonStyle = {
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center',
    backgroundColor: '#1166aa'
};

const deleteStyle = {
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center',
    backgroundColor: '#aa2222'
};


function preload() {
    console.log('[CREW] preload');
    this.load.image('character-1', 'assets/character-1.png');
    this.load.image('character-2', 'assets/character-2.png');
    this.load.image('character-3', 'assets/character-3.png');
    this.load.image('character-4', 'assets/character-4.png');
    this.load.image('character-5', 'assets/character-5.png');
}

function back() {
    this.scene.stop('unit');
    this.scene.start('boot');
}

function deleteToken(event, token) {
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

function create(config) {
    let scene = this;

    let token = config.token;
    let character = (token % 5) + 1;
    this.sys.add.image(420, 440, 'character-' + character);

    let backButtonConfig = {
        x: 100,
        y: 100,
        padding: 10,
        text: 'Back',
        style: buttonStyle
    };

    let backButton = this.sys.make.text(backButtonConfig);

    backButton.setInteractive();
    backButton.on('pointerdown', back, this);

    let deleteButtonConfig = {
        x: 600,
        y: 100,
        padding: 10,
        text: 'Delete',
        style: deleteStyle
    };

    var deleteButton = this.sys.make.text(deleteButtonConfig);

    deleteButton.setInteractive();
    deleteButton.on('pointerdown', function(event){
        deleteToken.call(scene, event, token);
    });
}

const unitScene = {
    key: 'unit',
    active: false,
    init: (config) => {
        console.log('[UNIT] init', config);
    },
    preload: preload,
    create: create,
    update: () => {

    }
};

export default unitScene;