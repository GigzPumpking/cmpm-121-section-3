import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  spinner?: Phaser.GameObjects.Shape;

  rotationSpeed = Phaser.Math.PI2 / 1000; // radians per millisecond

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("starfield", starfieldUrl);
  }

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    const width = this.game.config.width as number;
    const height = this.game.config.height as number;

    this.fire = this.#addKey("F");
    this.left = this.#addKey("LEFT");
    this.right = this.#addKey("RIGHT");

    this.starfield = this.add
      .tileSprite(0, 0, width, height, "starfield")
      .setOrigin(0, 0);

    this.spinner = this.add.rectangle(
      width / 2,
      height / 1.1,
      50,
      50,
      0xff0000,
    );
    this.physics.world.setBounds(0, 0, width, height);
    this.spinner.body = new Phaser.Physics.Arcade.Body(
      this.physics.world,
      this.spinner,
    );
    this.spinner.body.setCollideWorldBounds(true);
  }

  update(_timeMs: number, delta: number) {
    this.starfield!.tilePositionX -= 4;

    if (this.left!.isDown) {
      this.spinner!.rotation -= delta * this.rotationSpeed;
      this.spinner!.x -= 4;
    }
    if (this.right!.isDown) {
      this.spinner!.rotation += delta * this.rotationSpeed;
      this.spinner!.x += 4;
    }

    if (this.fire!.isDown) {
      this.tweens.add({
        targets: this.spinner,
        scale: { from: 1.5, to: 1 },
        duration: 300,
        ease: Phaser.Math.Easing.Sine.Out,
      });
    }
  }
}
