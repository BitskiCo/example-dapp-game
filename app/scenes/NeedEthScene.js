import TokenService from '../services/TokenService.js';

const labelStyle = {
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center',
    backgroundColor: '#2DAA58'
};

const labelConfig = {
    x: 300,
    y: 100,
    origin: { x: 0.5, y: 0.5 },
    padding: 10,
    text: 'Your Wallet Is Empty',
    style: labelStyle
};

const whatsHappeningStyle = {
    backgroundColor: '#333333',
    font: '18px Arial',
    fill: 'white',
    wordWrap: { width: 200 }
}

function create(config) {
    let game = this;

    this.make.text({
        x: 580,
        y: 0,
        padding: 10,
        text: "Whats Happening?\n\nYou don't have any ETH in your current account. We need a small amount of eth to create new tokens on the network. You will need to fund your account before you can continue.\nOnce you have some ETH you can hit refresh to use this app.",
        style: whatsHappeningStyle
    });

    this.make.text(labelConfig);
}

const needEthScene = {
    key: 'need-eth',
    active: false,
    init: (config) => {
        console.log('[NEEDETH] init', config);
    },
    preload: () => {
        console.log('[NEEDETH] preload');
    },
    create: create,
    update: () => {
        // console.log('[NEEDETH] update');
    }
};

export default needEthScene;