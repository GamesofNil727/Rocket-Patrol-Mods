/* Ethan Chen
 * Rocket Patrol Mods
 * 4/19/21
 * Completion time: ~12 hours
 */

class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.image('starfield', 'assets/starfield.png');

        // load audio
        this.load.audio('sfx_select', 'assets/blip_select6.wav');
        this.load.audio('sfx_explosion', 'assets/explosion18.wav');
        this.load.audio('sfx_rocket', 'assets/rocket_shot.wav');
        this.load.audio('sfx_speedup', 'assets/speedup.wav');
    }

    create() {
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // menu text configuration
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#8C7AE6',
            color: '#5E0DB5',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // show menu text
        this.add.text(game.config.width / 2, (game.config.height / 2) - (borderUISize * 2) - (borderPadding * 2), 'ROCKET PATROL++', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, (game.config.height / 2) - borderUISize - borderPadding, 'Use ←→ arrows to move & (F) to blast', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#ED973B';
        menuConfig.color = '#692A03';
        this.add.text(game.config.width / 2, game.config.height / 2, 'Earn points and time for hits', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, (game.config.height / 2) + borderUISize + borderPadding, 'Difficulty scales the longer you go', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#FF4400';
        menuConfig.color = '#570C00';
        this.add.text(game.config.width / 2, (game.config.height / 2) + (borderUISize * 2) + (borderPadding * 2), 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        this.starfield.tilePositionX += 1;

        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                spaceshipSpeed: 3,
                droneshipSpeed: 7,
                gameTimer: 60000
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
                spaceshipSpeed: 4,
                droneshipSpeed: 9,
                gameTimer: 45000
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
    }
}