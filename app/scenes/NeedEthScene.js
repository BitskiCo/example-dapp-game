import { Scene } from 'phaser';
import styles from '../utils/styles';

export default class NeedEthScene extends Scene {
    constructor() {
        super({key: 'need-eth', active: false});
    }

    create(config) {

        this.make.text({
            x: 0,
            y: 1200,
            origin: { x: 0, y: 1 },
            padding: 20,
            text: "Whats Happening?\n\nYou don't have any ETH in your current account. We need a small amount of eth to create new tokens on the network. You will need to fund your account before you can continue.\nOnce you have some ETH you can hit refresh to use this app.",
            style: styles.explanation
        });

        this.make.text({
            x: 600,
            y: 0,
            origin: { x: 0.5, y: 0 },
            padding: 20,
            text: 'Your Wallet Is Empty',
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

        const ethButton = document.getElementById("get-eth");
        ethButton.style.display = 'block';
    }

    shutdown() {
        super.shutdown();
        document.getElementById("eth-button").style.display = 'none';
    }
}
