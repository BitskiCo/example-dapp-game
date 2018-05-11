import BaseScene from './BaseScene.js';
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
    y: 0,
    origin: { x: 0.5, y: 0 },
    padding: 10,
    text: 'Your Wallet Is Empty',
    style: labelStyle
};

const whatsHappeningStyle = {
    backgroundColor: '#333333',
    font: '18px Arial',
    fill: 'white',
    wordWrap: { width: 600 }
}

export default class NeedEthScene extends BaseScene {
    constructor() {
        super({key: 'need-eth', active: false});
    }

    create(config) {
        super.create(config);

        this.make.text({
            x: 0,
            y: 600,
            origin: { x: 0, y: 1 },
            padding: 10,
            text: "Whats Happening?\n\nYou don't have any ETH in your current account. We need a small amount of eth to create new tokens on the network. You will need to fund your account before you can continue.\nOnce you have some ETH you can hit refresh to use this app.",
            style: whatsHappeningStyle
        });

        this.make.text(labelConfig);

        const ethButton = document.getElementById("get-eth");
        ethButton.style.display = 'block';
    }

    shutdown() {
        super.shutdown();
        document.getElementById("eth-button").style.display = 'none';
    }
}
