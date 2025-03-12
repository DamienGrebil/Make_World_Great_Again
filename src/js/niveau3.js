import * as fct from "/src/js/fonctions.js";

var groupe_plateforme_bunker;
var boss;
var bossHealth = 100;
var bossHealthBar;
var bossHealthText;
var groupeBullets;
var bossBullets;
var playerHealth = 5;
var playerHealthText;
var bossHealthBarBackground;
var bossHealthBarTimer;
var boutonFeu;
var groupe_bombes;
var initialBossX = 700;
var initialBossY = 300;
const bossLowerYLimit = 200;

export default class niveau3 extends Phaser.Scene {
  constructor() {
    super({ key: "niveau3" });
    this.gameOver = false;
  }

  preload() {
    this.load.image("img_bunker", "src/assets/bunker.png");
    this.load.image("img_plateforme_bunker", "src/assets/platform_bunker.png");
    this.load.image("img_plateforme_bunker_mini", "src/assets/platform_bunker_mini.png");
    this.load.image("img_perso", "src/assets/perso.png");
    this.load.image("bullet", "src/assets/sombrero.png");
    this.load.image("Manu_macron", "src/assets/MAnu.png");
    this.load.image("bossBullet", "src/assets/baguette.png");
    this.load.image("croissant", "src/assets/croissant.png");
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
    this.player = this.physics.add.sprite(100, 409, "img_perso");
    this.porte_retour = this.physics.add.staticSprite(100, 409, "img_porte3");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.direction = "right";
    this.clavier = this.input.keyboard.createCursorKeys();
    boutonFeu = this.input.keyboard.addKey('A');
    this.physics.add.collider(this.player, this.groupe_plateformes_bunker);
    boss = this.physics.add.sprite(initialBossX, initialBossY, "Manu_macron");
    boss.setImmovable(true);
    boss.setCollideWorldBounds(true);
    boss.setBounce(0.3);
    boss.body.setAllowGravity(false);
    this.physics.add.collider(boss, this.groupe_plateformes_bunker);
    boss.health = bossHealth;
    boss.isDead = false;
    boss.direction = "left";
    let healthBarWidth = 300;
    let healthBarHeight = 20;
    let healthBarX = 400;
    let healthBarY = 50;
    bossHealthBarBackground = this.add.rectangle(healthBarX, healthBarY, healthBarWidth, healthBarHeight, 0x000000);
    bossHealthBar = this.add.rectangle(healthBarX, healthBarY, healthBarWidth, healthBarHeight, 0xff0000);
    bossHealthBarBackground.setOrigin(0.5, 0.5);
    bossHealthBar.setOrigin(0.5, 0.5);
    bossHealthBarBackground.setScrollFactor(0);
    bossHealthBar.setScrollFactor(0);
    bossHealthBarBackground.setVisible(false);
    bossHealthBar.setVisible(false);
    bossHealthText = this.add.text(healthBarX, healthBarY, "Boss Health: " + boss.health, { fontSize: "20px", fill: "#ffffff", fontFamily: "Arial", backgroundColor: "#000000", padding: { x: 10, y: 5 }, });
    bossHealthText.setOrigin(0.5, 0.5);
    bossHealthText.setScrollFactor(0);
    bossHealthText.setVisible(false);
    playerHealthText = this.add.text(16, 40, "Player Health: " + playerHealth, { fontSize: "20px", fill: "#ffffff", fontFamily: "Arial", backgroundColor: "#000000", padding: { x: 10, y: 5 }, });
    playerHealthText.setScrollFactor(0);
    groupeBullets = this.physics.add.group();
    bossBullets = this.physics.add.group();
    this.physics.add.overlap(groupeBullets, boss, this.hitBoss, null, this);
    this.physics.add.overlap(this.player, bossBullets, this.playerHitByBossBullet, null, this);
    groupe_bombes = this.physics.add.group();
    this.physics.add.collider(groupe_bombes, this.groupe_plateformes_bunker);
    this.resetBombs();
    this.physics.add.collider(this.player, groupe_bombes, this.chocAvecBombe, null, this);
    this.bossPattern(boss);
    this.physics.add.collider(groupe_bombes, this.groupe_plateformes_bunker,this.bombPlatform,null,this);

  }
    bombPlatform(bomb){
        if(bomb.body.velocity.x > 300){
            bomb.setVelocityX(300);
        }else if(bomb.body.velocity.x < -300){
            bomb.setVelocityX(-300)
        }

         if(bomb.body.velocity.y > 300){
            bomb.setVelocityY(300);
        }else if(bomb.body.velocity.y < -300){
            bomb.setVelocityY(-300)
        }
    }
  chocAvecBombe(un_player, une_bombe) {
    playerHealth -= 1;
    playerHealthText.setText("Player Health: " + playerHealth);
    if (playerHealth <= 0) {
      this.killPlayer();
    }
    une_bombe.destroy();
  }
  resetBombs() {
    if (groupe_bombes) {
      groupe_bombes.clear(true, true);
    }
    for (let i = 0; i < 4; i++) {
      let x = Phaser.Math.Between(100, 800);
      let y = Phaser.Math.Between(100, 400);
      let une_bombe = groupe_bombes.create(x, y, "croissant");
      une_bombe.setBounce(1,1);
      une_bombe.setCollideWorldBounds(true);
      let vitesseX = Phaser.Math.Between(-200, 200);
      let vitesseY = Phaser.Math.Between(-200, 200);
      une_bombe.setVelocity(vitesseX, vitesseY);
      une_bombe.setDamping(true)
      une_bombe.setDrag(0.5);
      une_bombe.allowGravity = false;
    }
  }
  resetBoss() {
    if (boss) {
      boss.destroy();
    }
    boss = this.physics.add.sprite(initialBossX, initialBossY, "Manu_macron");
    boss.setImmovable(true);
    boss.setCollideWorldBounds(true);
    boss.setBounce(0.3);
    boss.body.setAllowGravity(false);
    this.physics.add.collider(boss, this.groupe_plateformes_bunker);
    boss.health = bossHealth;
    boss.isDead = false;
    boss.direction = "left";
    bossHealthBar.width = 300;
    bossHealthText.setText("Boss Health: " + boss.health);
  }
  hitBoss(boss, bullet) {
    bullet.destroy();
    boss.health -= 5;
    if (!bossHealthBarBackground.visible) {
      bossHealthBarBackground.setVisible(true);
      bossHealthBar.setVisible(true);
      bossHealthText.setVisible(true);
    }
    let healthPercentage = boss.health / bossHealth;
    bossHealthBar.width = 300 * healthPercentage;
    bossHealthText.setText("Boss Health: " + boss.health);
    if (boss.health <= 0) this.bossDeath(boss);
    if (bossHealthBarTimer) {
      bossHealthBarTimer.remove();
      bossHealthBarTimer = null;
    }
  }
  playerHitByBossBullet(player, bullet) {
    bullet.destroy();
    playerHealth--;
    playerHealthText.setText("Player Health: " + playerHealth);
    if (playerHealth <= 0) {
      this.killPlayer();
      this.gameOver = true;
    }
  }
  bossShoot(boss) {
    if (!boss.isDead) {
      let bossBullet = bossBullets.create(boss.x, boss.y, "bossBullet");
      bossBullet.setVelocityX(boss.direction === "left" ? -200 : 200);
      bossBullet.body.allowGravity = false;
      bossBullet.setCollideWorldBounds(false);
      bossBullet.body.onWorldBounds = true;
    }
  }
  bossDeath(boss) {
    boss.isDead = true;
    boss.setVelocity(0, 0);
    boss.destroy();
    bossHealthBar.destroy();
    bossHealthBarBackground.destroy();
    bossHealthText.destroy();
     this.scene.start("victoire");
  }
  bossPattern(boss) {
    let bossPhase = 1;
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        if (!boss.isDead) {
          let distance = Phaser.Math.Distance.Between(boss.x, boss.y, this.player.x, this.player.y);
          if (distance > 100) {
            if (this.player.x < boss.x) {
              boss.direction = "left"
              boss.setVelocityX(-100);
              boss.flipX = true;
            } else {
              boss.direction = "right"
              boss.setVelocityX(100);
              boss.flipX = false;
            }
            boss.setImmovable(true);
          }
          if (bossPhase === 2) {
            boss.setImmovable(false);
            boss.setVelocityY(-200);
            if (boss.body.velocity.x > 0) {
              boss.direction = "right"
              boss.flipX = false;
            } else {
              boss.direction = "left"
              boss.flipX = true;
            }
          }
          if (distance < 100) {
            boss.setVelocityX(0);
          }
          if (boss.y > bossLowerYLimit) {
            boss.setVelocityY(-100);
          }
        }
      },
      loop: true,
    });
    this.time.addEvent({
      delay: 5000,
      callback: () => {
        if (!boss.isDead) {
          if (boss.x < 200 || boss.x > 800) {
            bossPhase = 2;
          } else {
            bossPhase = bossPhase === 1 ? 2 : 1;
          }
        }
      },
      loop: true,
    });
    this.time.addEvent({
      delay: Phaser.Math.Between(1000, 2000),
      callback: () => {
        this.bossShoot(boss);
      },
      callbackScope: this,
      loop: true
    });
  }
  killPlayer() {
    if (this.player) {
      this.player.setTint(0xff0000);
      this.player.setVelocity(0, 0);
      this.player.anims.stop();
    }
    playerHealth = 5;
    playerHealthText.setText("Player Health: " + playerHealth);
    this.physics.pause();
    this.time.delayedCall(3000, () => {
      this.resetBoss();
      this.resetBombs();
      this.scene.start("niveau2");
      this.physics.resume();
      this.gameOver = false;
    });
  }
  update() {
    if (Phaser.Input.Keyboard.JustDown(boutonFeu)) {
      this.tirer(this.player);
    }
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
    if (this.gameOver) {
      return;
    }
  }
  tirer(player) {
    var coefDir;
    if (player.direction == "left") { coefDir = -1; } else { coefDir = 1 }
    var bullet = groupeBullets.create(player.x + (25 * coefDir), player.y - 4, 'bullet');
    bullet.setCollideWorldBounds(false);
    bullet.body.allowGravity = false;
    bullet.setVelocity(1000 * coefDir, 0);
  }
}
