/* Ethan Chen
 * Rocket Patrol Mods
 * 4/19/21
 * Completion time: ~12 hours
 */

// Droneship prefab
class Droneship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.droneshipSpeed;
    }

    update() {
        // move droneship right
        this.x += this.moveSpeed;
        // wrap around from right edge to left edge
        if (this.x >= game.config.width + this.width) {
            this.reset();
        }
    }

    // position reset
    reset() {
        this.x = 0;
    }
}