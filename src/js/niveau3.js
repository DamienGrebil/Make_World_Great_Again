import * as fct from "/src/js/fonctions.js";

var groupe_plateforme_bunker;
var boss;
var bossHealth = 100;
var bossHealthBar;
var bossHealthText;
var groupeBullets;
var bossBullets;
var playerHealth = 3; // Changed to 5 (Fixed)
var playerHealthText;
var bossHealthBarBackground;
var bossHealthBarTimer;
var boutonFeu; // New: Variable for the fire button
var groupe_bombes; //New : groupe for the bombe
var initialBossX = 700; // Stocker la position initial du boss
var initialBossY = 300;

export default class niveau3 extends Phaser.Scene {
  constructor() {
    super({ key: "niveau3" });
    this.gameOver = false; // initialize the variable
  }

  preload() {
    this.load.image("img_bunker", "src/assets/bunker.png");
    this.load.image("img_plateforme_bunker", "src/assets/platform_bunker.png");
    this.load.image("img_plateforme_bunker_mini", "src/assets/platform_bunker_mini.png");
    this.load.image("img_perso", "src/assets/perso.png");
    this.load.image("bullet", "src/assets/sombrero.png");
    this.load.image("Manu_macron", "src/assets/MAnu.png");
    this.load.image("bossBullet", "src/assets/baguette.png");
    this.load.image("croissant", "src/assets/croissant.png"); //New : load the croissant
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
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.direction = "right";
    this.clavier = this.input.keyboard.createCursorKeys();
    boutonFeu = this.input.keyboard.addKey('A'); // New: Bind the A key to boutonFeu
    this.physics.add.collider(this.player, this.groupe_plateformes_bunker);

    // Boss creation
    boss = this.physics.add.sprite(initialBossX, initialBossY, "Manu_macron"); // Création du boss et position initial
    boss.setImmovable(true);
    boss.setCollideWorldBounds(true);
    boss.setBounce(0.3);
    boss.body.setAllowGravity(false);
    this.physics.add.collider(boss, this.groupe_plateformes_bunker);
    boss.health = bossHealth;
    boss.isDead = false;
    boss.direction = "left";

    // Boss health bar
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

    bossHealthText = this.add.text(healthBarX, healthBarY, "Boss Health: " + boss.health, {
      fontSize: "20px",
      fill: "#ffffff",
      fontFamily: "Arial",
      backgroundColor: "#000000",
      padding: { x: 10, y: 5 },
    });
    bossHealthText.setOrigin(0.5, 0.5);
    bossHealthText.setScrollFactor(0);
    bossHealthText.setVisible(false);

    // Player health text
    playerHealthText = this.add.text(16, 40, "Player Health: " + playerHealth, { //use the new playerHealth (Fixed)
      fontSize: "20px",
      fill: "#ffffff",
      fontFamily: "Arial",
      backgroundColor: "#000000",
      padding: { x: 10, y: 5 },
    });
    playerHealthText.setScrollFactor(0);

    // Bullets
    groupeBullets = this.physics.add.group();
    bossBullets = this.physics.add.group();
    this.physics.add.overlap(groupeBullets, boss, this.hitBoss, null, this);
    this.physics.add.overlap(this.player, bossBullets, this.playerHitByBossBullet, null, this);

     // Creation des bombes
    groupe_bombes = this.physics.add.group();//create the group
    this.physics.add.collider(groupe_bombes, this.groupe_plateformes_bunker); //add the collision between the bomb and the plateforme
       this.resetBombs();
    //gestion de la collision entre les bombes et le joueur
      this.physics.add.collider(this.player, groupe_bombes, this.chocAvecBombe, null, this);

    this.bossPattern(boss);//call the boss pattern
  }
   chocAvecBombe(un_player, une_bombe) { // function call when the player hit a bomb
        //check if the player is not invincible
      playerHealth -=1; //remove 1hp at the player
      playerHealthText.setText("Player Health: " + playerHealth);//update the text of the player health
      if(playerHealth <= 0){ //if the player have 0 hp or less
          this.killPlayer();//Call the function killPlayer in this file
      }
      une_bombe.destroy();//destoy the bomb
  }
   //fonction pour reset les bombes
   resetBombs(){
     if (groupe_bombes) {
         groupe_bombes.clear(true, true); // détruit les bombes existantes
     }

        for (let i = 0; i < 4; i++) { //create 5 bomb
          let x = Phaser.Math.Between(100, 800); // Random X position
          let y = Phaser.Math.Between(100, 400); // random Y position

          let une_bombe = groupe_bombes.create(x, y, "croissant"); //create the bomb with the croissant image
          une_bombe.setBounce(Phaser.Math.FloatBetween(0.8, 1)); // Add a random bounce
          une_bombe.setCollideWorldBounds(true); // set the collision with the edge

          //Add random velocity
          let vitesseX = Phaser.Math.Between(-200, 200);
          let vitesseY = Phaser.Math.Between(100, 130);
          une_bombe.setVelocity(vitesseX, vitesseY);
          une_bombe.allowGravity = false; // No gravity
    }
   }
   //Fonction pour reset le boss
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
        boss.health = bossHealth; // Réinitialiser la santé du boss
        boss.isDead = false; // Réinitialiser l'état de mort
        boss.direction = "left";
       // Réinitialiser la barre de vie du boss
        bossHealthBar.width = 300;
        bossHealthText.setText("Boss Health: " + boss.health);
    }
  hitBoss(boss, bullet) {
    bullet.destroy();
    boss.health -= 5; // Changed to 5 (Fixed)
    // show the health bar
    if (!bossHealthBarBackground.visible) { 
         bossHealthBarBackground.setVisible(true); //make visible the healthBar (fix)
        bossHealthBar.setVisible(true);//make visible the healthBar (fix)
        bossHealthText.setVisible(true);//make visible the healthBar (fix)
    }

    let healthPercentage = boss.health / bossHealth;
    bossHealthBar.width = 300 * healthPercentage;
    bossHealthText.setText("Boss Health: " + boss.health);
    if (boss.health <= 0) this.bossDeath(boss);

  // Remove the timer logic
        if (bossHealthBarTimer) {
            bossHealthBarTimer.remove();
             bossHealthBarTimer=null;
        }
  }
// New Function for player hit by boss
  playerHitByBossBullet(player, bullet) {
    bullet.destroy(); // Destroy the bullet
    playerHealth--; // Decrement the player's health
    playerHealthText.setText("Player Health: " + playerHealth); // Update player health text

    if (playerHealth <= 0) {
      this.killPlayer();// Call the killPlayer function in this file 
      this.gameOver = true;//set gameOver 
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
  bossDeath(boss) {
    boss.isDead = true;
    boss.setVelocity(0, 0);
    boss.destroy();
    bossHealthBar.destroy();
    bossHealthBarBackground.destroy();
    bossHealthText.destroy();
    this.add.text(300, 200, "Vous avez vaincu le Boss", {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "30pt",
      fill: "#ffffff",
    });
    this.cameras.main.shake(500, 0.05);
  }
  bossPattern(boss) {
    let bossPhase = 1; // start with phase 1
    // Boss Movement
    this.time.addEvent({
      delay: 2000, // how often the boss check the position of the player
      callback: () => {
        if (!boss.isDead) {
          //Calculate the dist between the boss and the player
            let distance = Phaser.Math.Distance.Between(boss.x, boss.y, this.player.x, this.player.y);
          //Move to the player
            if (distance > 100) { // check the distance between the player and the boss
              if (this.player.x < boss.x) {
                boss.direction = "left"
                boss.setVelocityX(-100);
                boss.flipX = true; // flip the sprite
              } else {
                 boss.direction = "right"
                boss.setVelocityX(100);
                boss.flipX = false;
              }
              boss.setImmovable(true); // set the boss to immovable when it move
           }
           if (bossPhase === 2) {
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
           }
           if(distance < 100){
             boss.setVelocityX(0);
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
    // Fonction appelée lorsqu'un joueur doit mourir
    killPlayer() {
      console.log("Le joueur est mort !"); // Affichage dans la console
      if (this.player) { // Vérifie si le joueur existe
        this.player.setTint(0xff0000); // Met une teinte rouge sur le joueur
        this.player.setVelocity(0, 0); // Arrête la vitesse du joueur
        this.player.anims.stop(); // Arrête l'animation du joueur
      }
      playerHealth = 5;//reset the player health
      playerHealthText.setText("Player Health: " + playerHealth);
      this.physics.pause(); // Met la physique du jeu en pause (pour éviter d'autres collisions)
      this.time.delayedCall(3000, () => { // Attend 3 secondes (3000 millisecondes) avant de relancer le jeu
        this.resetBoss();//reset the boss
        this.resetBombs();//reset the bombs
          this.scene.start("niveau2"); // Redémarre la scène 2
        this.physics.resume(); // Relance la physique du jeu
        this.gameOver = false;//reset gameOver
      });
    }
  update() {
     if (Phaser.Input.Keyboard.JustDown(boutonFeu)) { // Changed to boutonFeu
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
        if(this.gameOver){
            return;
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
