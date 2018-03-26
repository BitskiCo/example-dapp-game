import TokenService from '../services/TokenService.js';

const characterPositions = [
    [100, 420],
    [260, 400],
    [580, 400],
    [740, 420],
    [420, 440]
]

function preload() {
    console.log('[CREW] preload');
    this.load.image('character-1', 'assets/character-1.png');
    this.load.image('character-2', 'assets/character-2.png');
    this.load.image('character-3', 'assets/character-3.png');
    this.load.image('character-4', 'assets/character-4.png');
    this.load.image('character-5', 'assets/character-5.png');
}

function over() {
    console.log('button over');
}

function mintToken(pointer) {
    let game = this.game;
    let tokenService = new TokenService("42"); // Kovan

    tokenService.mintNewToken()
    .on('transactionHash', function (hash) {
        console.log("Need to display status for " + receipt);
    }).on('receipt', function (receipt) {
        console.log("Need to display status for " + receipt);
    }).on('confirmation', function (confirmationNumber, receipt) {
        game.gameEngine.scene.start('crew', { tokens: tokens });
    }).on('error', console.error);
}

function create(config) {
    let game = this;
    
    let totalTokens = config.tokens.length;
    for (var i = 0; i < totalTokens; i++) {
        let token = config.tokens[i];
        let character = (token % 5) + 1;
        let characterPosition = characterPositions[i];
        let characterImage = this.add.image(characterPosition[0], characterPosition[1], 'character-' + character);

        characterImage.setInteractive();
        characterImage.on('pointerdown', function(pointer){
            game.scene.stop('crew');
            game.scene.start('unit', { token: token });
        });
    }

    var buttonTitle = '...'

    if (totalTokens === 1) {
        buttonTitle = 'You have 1 guy!\nTap to get more.';
    } else if (totalTokens < 5) {
        buttonTitle = 'You have ' + totalTokens + ' guys!\nTap to get more.';
    } else {
        buttonTitle = 'You have a complete crew!';
    }

    // TODO: Show $/Ξ price

    var button = this.add.text(380, 200, buttonTitle);

    if (totalTokens < 5) {
        button.setInteractive();
        button.on('pointerdown', mintToken);
    }
}

const crewScene = {
    key: 'crew',
    active: false,
    tokens: [],
    init: (config) => {
        console.log('[CREW] init', config);
    },
    preload: preload,
    create: create,
    update: () => {

    }
};

export default crewScene;