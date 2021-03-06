/* Ethan Chen
 * Rocket Patrol Mods
 * 4/19/21
 * Completion time: ~12 hours
 */

class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', 'assets/rocket.png');
        this.load.image('starfield', 'assets/starfield.png');
        this.load.image('asteroids', 'assets/asteroids.png');

        // load spritesheet
        this.load.spritesheet('spaceship', 'assets/spaceship.png', {frameWidth: 63, frameHeight: 32, startFrame: 0, endFrame: 3});
        this.load.spritesheet('droneship', 'assets/droneship.png', {frameWidth: 31, frameHeight: 16, startFrame: 0, endFrame: 3});
        this.load.spritesheet('explosion', 'assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('dronesplosion', 'assets/dronesplosion.png', {frameWidth: 31, frameHeight: 16, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // place asteroid sprite (parallax)
        this.asteroids = this.add.tileSprite(0, 0, 640, 480, 'asteroids').setOrigin(0, 0);

        // more of a turquoise UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x30D5C8).setOrigin(0, 0);

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - 12, 'rocket').setOrigin(0.5, 0);

        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, (borderUISize * 4.5) + (borderPadding * 2), 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, (borderUISize * 5.5) + (borderPadding * 4), 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, (borderUISize * 6.5) + (borderPadding * 6), 'spaceship', 0, 10).setOrigin(0, 0);

        // add droneship
        this.drone = new Droneship(this, 0 - (borderUISize * 3), borderUISize * 4, 'droneship', 0, 60).setOrigin(0, 0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        this.anims.create({
            key: 'dronesplode',
            frames: this.anims.generateFrameNumbers('dronesplosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        this.anims.create({
            key: 'bigship',
            frames: this.anims.generateFrameNumbers('spaceship', { start: 0, end: 3, first: 0}),
            frameRate: 7,
            repeat: -1
        });
        this.anims.create({
            key: 'miniship',
            frames: this.anims.generateFrameNumbers('droneship', { start: 0, end: 3, first: 0}),
            frameRate: 7,
            repeat: -1
        });

        this.ship01.anims.play('bigship');
        this.ship02.anims.play('bigship');
        this.ship03.anims.play('bigship');
        this.drone.anims.play('miniship');

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#8C7AE6',
            color: '#5E0DB5',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + (borderPadding * 2), this.p1Score, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width / 2, game.config.height / 2, 'KICKED THE BUCKET', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, (game.config.height / 2) + 64, '(R)estart or ??? for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        // 30-second clock to increase speed
        if (!this.gameOver) {
            this.scaler = setInterval(() => {
                this.ship01.moveSpeed += 1;
                this.ship02.moveSpeed += 1;
                this.ship03.moveSpeed += 1;
                this.drone.moveSpeed += 2;
                this.sound.play('sfx_speedup');
            }, game.settings.gameTimer / 2);
        }

        // display timer
        let timerConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#ED973B',
            color: '#692A03',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.timerRight = this.add.text(game.config.width - (borderUISize + borderPadding + timerConfig.fixedWidth),
        borderUISize + (borderPadding * 2), Math.floor(this.clock.getRemainingSeconds()), timerConfig);
    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
            this.sound.play('sfx_select');
        }

        // check key input for menu return
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
            this.sound.play('sfx_select');
        }

        // turn off interval when game is over
        if (this.gameOver) {
            clearInterval(this.scaler);
        }

        this.starfield.tilePositionX -= 4;
        this.asteroids.tilePositionX -= 8;
        if (!this.gameOver) {
            this.p1Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.drone.update();
        }

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
            this.clock.elapsed -= 1000;
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
            this.clock.elapsed -= 2000;
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
            this.clock.elapsed -= 3000;
        }
        if (this.checkCollision(this.p1Rocket, this.drone)) {
            this.p1Rocket.reset();
            this.droneExplode(this.drone);
            this.clock.elapsed -= 6000;
        }

        // update timer
        this.timerRight.setText(Math.floor(this.clock.getRemainingSeconds()));
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        // explode sfx
        this.sound.play('sfx_explosion');
    }

    droneExplode(drone) {
        // temporarily hide drone
        drone.alpha = 0;
        // create explosion sprite at drone's position
        let boom2 = this.add.sprite(drone.x, drone.y, 'dronesplosion').setOrigin(0, 0);
        boom2.anims.play('dronesplode');
        boom2.on('animationcomplete', () => {
            drone.reset();
            drone.alpha = 1;
            boom2.destroy();
        });
        // score add and repaint
        this.p1Score += drone.points;
        this.scoreLeft.text = this.p1Score;
        // explode sfx
        this.sound.play('sfx_explosion');
    }
}