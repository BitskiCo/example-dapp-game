import TokenService from '../services/TokenService.js';

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
    return TokenService.currentNetwork().then(function(tokenService){
        tokenService.deleteToken(token)
        .on('transactionHash', function(transactionHash) {
            console.log("Need to display status for " + transactionHash);
        })
        .on('receipt', function (receipt) {
            console.log("Need to display status for " + receipt);
        }).on('confirmation', function (confirmationNumber, receipt) {
            game.gameEngine.scene.start('crew', { tokens: tokens });
        }).on('error', console.error);
    });
}

function create(config) {
    let scene = this;

    let token = config.token;
    let character = (token % 5) + 1;
    this.sys.add.image(420, 440, 'character-' + character);

    var backButton = this.sys.add.text(20, 200, "Back");

    backButton.setInteractive();
    backButton.on('pointerdown', back, this);

    var deleteButton = this.sys.add.text(580, 200, "Delete");

    deleteButton.setInteractive();
    deleteButton.on('pointerdown', function(event){
        deleteToken(event, token);
    }, this);
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