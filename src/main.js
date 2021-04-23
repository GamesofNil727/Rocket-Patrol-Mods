/* Ethan Chen
 * Rocket Patrol Mods
 * 4/19/21
 * Completion time: ~12 hours
 *
 * Points breakdown:
 * Create a new scrolling tile sprite for the background (5)
 * Implement parallax scrolling (10)
 * Create a new ANIMATED sprite for the Spaceship enemies (10)
 * Create new artwork for all of the in-game assets (rocket, spaceships, explosion) (20)
 * Implement the speed increase that happens after 30 seconds in the original game (5)
 * Allow the player to control the Rocket after it's fired (5)
 * Display the time remaining (in seconds) on the screen (10)
 * Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (20)
 * Implement a new timing/scoring mechanism that adds time to the clock for successful hits (20)
 * Total: 5+10+10?+20+5+5+10+20+20 = 105
 * 
 * Sources:
 * Phaser post (for help with displaying timer): https://phaser.discourse.group/t/countdown-timer/2471
 * Phaser documentation (further timer help, including adding time): https://photonstorm.github.io/phaser3-docs/Phaser.Time.TimerEvent.html
 * Stack overflow that introduced me to setInterval() https://stackoverflow.com/questions/62725455/how-to-run-a-function-each-minute-in-phaser-3
 */

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;