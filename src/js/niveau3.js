import * as fct from "/src/js/fonctions.js";

var groupe_plateforme_bunker;
var boss;
var bossHealth = 100;
var bossHealthBar; // New: Boss health bar
var bossHealthText;
var groupeBullets;
var bossBullets; // New: Boss's bullets
var gameOver = false;
var playerHealth = 3; // New: Player health
var playerHealthText; // New: Text to display player health

export default class niveau3 extends Phaser.Scene {
  constructor() {
    super({
      key: "niveau3",
    });
  }

  preload() {
    this.load.image("img_bunker", "src/assets/bunker.png");
    this.load.image("img_plateforme_bunker", "src/assets/platform_bunker.png");
    this.load.image("img_plateforme_bunker_mini", "src/assets/platform_bunker_mini.png");
    this.load.image("img_perso", "src/assets/perso.png");
    this.load.image("bullet", "src/assets/sombrero.png");
    this.load.image("img_agent_d", "src/assets/agent_d.png");
    this.load.image("bossBullet", "src/assets/agentBullet.png"); // New: Boss bullet image
  }

  create() {
    this.add.image(500, 400, "img_bunker");
    this.groupe_plateformes_bunker = this.physics.add.staticGroup();
    this.groupe_plateformes_bunker.create(200, 450, "img_plateforme_bunker");
    this.groupe_plateformes_bunker.create(600, 450, "img_plateforme_bunker");
    this.groupe_plateformes_bunker.create(270, 260, "img_plateforme_bunker");
    this.groupe_plateformes_bunker.create(500, 260, "img_plateforme_bunker");
    this.groupe_plateformes_bunker.create(50, 334, "img_plateforme_bunker_mini");
    this.groupe_plateformes_bunker.create(150, 334, "img_plateforme_bunker_mini");
    this.groupe_plateformes_bunker.create(170, 334, "img_plateforme_bunker_mini");
    this.groupe_plateformes_bunker.create(800, 310, "img_plateforme_bunker_mini");

    this.add.text(400, 100, "Vous êtes dans le Bunker", {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt",
    });

    this.porte_retour = this.physics.add.staticSprite(100, 409, "img_porte3");

    this.player = this.physics.add.sprite(100, 409, "img_perso");
    this.player.body.setSize(20, 30, 6, 18);
    this.player.body.setOffset(6, 18);
    this.player.refreshBody();
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.direction = "right"; // Set initial direction
    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, this.groupe_plateformes_bunker);

    // Boss creation
    boss = this.physics.add.sprite(700, 300, "img_agent_d");
    boss.setImmovable(true); // Make the boss movable
    boss.setCollideWorldBounds(true);
    boss.setBounce(0.3);
    //Add the collider between the boss and the platforme
    this.physics.add.collider(boss, this.groupe_plateformes_bunker);
    boss.health = bossHealth; // Assign health property
    boss.isDead = false; // New: Track if the boss is dead
    boss.direction = "left"; // new attribut to track the direction

    // Boss health bar (a red rectangle)
    let healthBarWidth = 100;
    let healthBarHeight = 10;
    let healthBarX = boss.x - healthBarWidth / 2;
    let healthBarY = boss.y - boss.height / 2 - 20;
    bossHealthBar = this.add.rectangle(healthBarX, healthBarY, healthBarWidth, healthBarHeight, 0xff0000);
    bossHealthBar.setOrigin(0, 0);
    bossHealthBar.setScrollFactor(0);
    bossHealthText = this.add.text(16, 16, "Boss Health: " + boss.health, {
      fontSize: "20px",
      fill: "#ffffff",
      fontFamily: "Arial",
      backgroundColor: "#000000",
      padding: { x: 10, y: 5 },
    });
    bossHealthText.setScrollFactor(0);
    // Player health text
    playerHealthText = this.add.text(16, 40, "Player Health: " + playerHealth, {
      fontSize: "20px",
      fill: "#ffffff",
      fontFamily: "Arial",
      backgroundColor: "#000000",
      padding: { x: 10, y: 5 },
    });
    playerHealthText.setScrollFactor(0);

    // Player bullets
    groupeBullets = this.physics.add.group();
    this.physics.add.overlap(groupeBullets, boss, this.hitBoss, null, this);

    // Boss bullets
    bossBullets = this.physics.add.group();
    this.physics.add.overlap(this.player, bossBullets, this.playerHitByBossBullet, null, this);

    // Boss movement and attack pattern
    this.bossPattern(boss);
  }

  hitBoss(boss, bullet) {
    bullet.destroy();
    boss.health -= 10;

    // Update the boss health bar
    let healthPercentage = (boss.health / bossHealth); // calculate the percentage
    bossHealthBar.width = 100 * healthPercentage; // Update the width of the health bar
    bossHealthText.setText("Boss Health: " + boss.health);

    if (boss.health <= 0) {
      this.bossDeath(boss);
    }
  }
  // New Function for player hit by boss
  playerHitByBossBullet(player, bullet) {
    bullet.destroy(); // Destroy the bullet
    playerHealth--; // Decrement the player's health
    playerHealthText.setText("Player Health: " + playerHealth); // Update player health text

    if (playerHealth <= 0) {
      fct.killPlayer(this); // Call the killPlayer function in fonctions.js
      gameOver = true;
    }
  }

  // New: Boss's bullet attack
  bossShoot(boss) {
    if (!boss.isDead) {
      let bossBullet = bossBullets.create(boss.x, boss.y, "bossBullet");
      bossBullet.setVelocityX(boss.direction === "left" ? -200 : 200);
      bossBullet.body.allowGravity = false;
      bossBullet.setCollideWorldBounds(false);
      bossBullet.body.onWorldBounds = true;
    }
  }

  // New: More complex boss pattern
  bossPattern(boss) {
    let bossPhase = 1; // start with phase 1
    // Boss Movement
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        if (!boss.isDead) {
          if (bossPhase === 1) {
            // Phase 1: Left/Right Movement
            boss.setImmovable(true); // set the boss to immovable BEFORE changing direction
            if (boss.body.velocity.x > 0) {
              boss.setVelocityX(-100);
              boss.flipX = true; // flip the sprite
              boss.direction = "left";
            } else {
              boss.setVelocityX(100);
              boss.flipX = false;
              boss.direction = "right";
            }
           
          } else if (bossPhase === 2) {
            // Phase 2: Jumping and shooting
             boss.setImmovable(false); // set the boss to movable BEFORE jumping

            boss.setVelocityY(-200); // Make the boss jump
            //Check the previous velocity
            if (boss.body.velocity.x > 0) {
              boss.direction = "right"
              boss.flipX = false;
            } else {
              boss.direction = "left"
              boss.flipX = true;
            }
            //Shoot
            this.bossShoot(boss);
          }
        }
      },
      loop: true,
    });
    // Phase change
    this.time.addEvent({
      delay: 5000, // Change phase every 5 seconds
      callback: () => {
        if (!boss.isDead) {
           if (boss.x < 200 || boss.x > 800) { // if boss on the side of the map, the phase change
              bossPhase = 2;
          }else{
            bossPhase = bossPhase === 1 ? 2 : 1; // Switch between phase 1 and phase 2
          }
        }
      },
      loop: true,
    });
    //shoot
    this.time.addEvent({
      delay: Phaser.Math.Between(1000, 2000), // Random delay between 1 and 2 seconds
      callback: () => {
        this.bossShoot(boss);
      },
      callbackScope: this,
      loop: true
    });
  }
  // New: Boss death logic
  bossDeath(boss) {
    boss.isDead = true; // Set the boss to dead
    boss.setVelocity(0, 0); // Stop the boss
    boss.destroy();
    bossHealthBar.destroy(); // Destroy the boss health bar
    bossHealthText.destroy(); // Destroy the text
    this.add.text(300, 200, "Vous avez vaincu le Boss", { // You win message
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "30pt",
      fill: "#ffffff"
    });
    this.cameras.main.shake(500, 0.05); // Screen shake
  }
  update() {
    if (this.clavier.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("anim_tourne_gauche", true);
      this.player.direction = "left";
    } else if (this.clavier.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("anim_tourne_droite", true);
      this.player.direction = "right";
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("anim_face");
    }
    if (this.clavier.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
    if (this.clavier.down.isDown) {
      this.player.setVelocityY(260);
      this.player.anims.play("anim_face");
    }

    if (Phaser.Input.Keyboard.JustDown(this.clavier.space)) {
      if (this.physics.overlap(this.player, this.porte_retour)) {
        console.log("niveau 3 : retour vers selection");
        this.scene.switch("niveau2");
      }
      this.tirer(this.player);
    }
  }
  // Fonction pour le tir du joueur
  tirer(player) {
    var coefDir; // Variable pour la direction du tir
    if (player.direction == "left") { coefDir = -1; } else { coefDir = 1 } // Si la direction du joueur est gauche, alors coefDir = -1, sinon coefDir = 1
    // Création de la balle a coté du joueur
    var bullet = groupeBullets.create(player.x + (25 * coefDir), player.y - 4, 'bullet');
    // Paramètres physiques de la balle
    bullet.setCollideWorldBounds(false); // La balle ne peut pas sortir des limites du monde
    bullet.body.allowGravity = false; // La balle n'est pas affectée par la gravité
    bullet.setVelocity(1000 * coefDir, 0); // Vitesse de la balle (vers la gauche ou la droite)
  }
}
