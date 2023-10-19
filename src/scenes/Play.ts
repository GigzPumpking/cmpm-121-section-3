import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  spinner?: Phaser.GameObjects.Shape;
  enemy1?: Phaser.GameObjects.Shape;
  enemy2?: Phaser.GameObjects.Shape;
  enemy3?: Phaser.GameObjects.Shape;
  enemies?: Phaser.GameObjects.Shape[];
  width?: number;
  height?: number;

  rotationSpeed = Phaser.Math.PI2 / 1000; // radians per millisecond
  isFiring?: boolean;

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
    this.width = this.game.config.width as number;
    this.height = this.game.config.height as number;
    this.fire = this.#addKey("F");
    this.left = this.#addKey("LEFT");
    this.right = this.#addKey("RIGHT");

    this.starfield = this.add
      .tileSprite(0, 0, this.width, this.height, "starfield")
      .setOrigin(0, 0);

    this.spinner = this.add.rectangle(
      this.width / 2,
      this.height / 1.1,
      50,
      50,
      0xff0000,
    );
    this.physics.world.setBounds(0, 0, this.width, this.height);

    this.spinner.body = new Phaser.Physics.Arcade.Body(
      this.physics.world,
      this.spinner,
    );
    this.spinner.body.collideWorldBounds = true;
    this.physics.world.enable(this.spinner);

    this.enemy1 = this.createEnemy(
      this.enemy1,
      100,
      this.width / 5,
      this.height / 5,
    );
    this.enemy2 = this.createEnemy(
      this.enemy2,
      200,
      this.width / 3,
      this.height / 10,
    );
    this.enemy3 = this.createEnemy(
      this.enemy3,
      300,
      this.width / 1.5,
      this.height / 2,
    );

    this.enemies = [this.enemy1!, this.enemy2!, this.enemy3!];

    this.isFiring = false;
  }

  createEnemy(enemy: any, speed: number, width?: number, height?: number) {
    enemy = this.add.rectangle(width, height, 50, 50, 0x00ff00);
    enemy.body = new Phaser.Physics.Arcade.Body(this.physics.world, enemy);
    this.physics.world.enable(enemy);
    enemy.body.setVelocity(speed, 0);

    this.enemies?.push(enemy);

    return enemy;
  }

  update(_timeMs: number, delta: number) {
    this.enemies?.forEach((enemy) => {
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          this.spinner!.getBounds(),
          enemy.getBounds(),
        )
      ) {
        enemy.x = -50;
      }
      if (enemy.x > this.width!) {
        console.log("reset");
        enemy.x = 0;
      }
    });

    this.starfield!.tilePositionX -= 4;

    if (this.left!.isDown && !this.isFiring) {
      this.spinner!.rotation -= delta * this.rotationSpeed;
      this.spinner!.x -= 4;
    }
    if (this.right!.isDown && !this.isFiring) {
      this.spinner!.rotation += delta * this.rotationSpeed;
      this.spinner!.x += 4;
    }

    if (this.fire!.isDown && !this.isFiring) {
      this.isFiring = true;
      this.tweens.add({
        targets: this.spinner,
        scale: { from: 1.5, to: 1 },
        duration: 300,
        ease: Phaser.Math.Easing.Sine.Out,
      });

      this.tweens.add({
        targets: this.spinner,
        y: 0,
        duration: 300,
        ease: Phaser.Math.Easing.Sine.Out,
        onComplete: () => {
          this.isFiring = false;
          this.spinner!.y = (this.game.config.height as number) / 1.1;
        },
      });
    }
  }
}
