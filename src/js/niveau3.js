import * as fct from "/src/js/fonctions.js";

// Déclaration des variables globales
var groupe_plateforme_bunker; // Groupe contenant les plateformes du bunker
var boss; // Sprite du boss
var bossHealth = 100; // Points de vie initiaux du boss
var bossHealthBar; // Barre de vie du boss (graphique)
var bossHealthText; // Texte affichant les points de vie du boss
var groupeBullets; // Groupe contenant les balles tirées par le joueur
var bossBullets; // Groupe contenant les balles tirées par le boss
var playerHealth = 5; // Points de vie du joueur, initialisé à 5
var playerHealthText; // Texte affichant les points de vie du joueur
var bossHealthBarBackground; // Fond de la barre de vie du boss
var bossHealthBarTimer; // Timer pour la barre de vie du boss (non utilisé actuellement)
var boutonFeu; // Variable pour la touche de tir du joueur
var groupe_bombes; // Groupe contenant les bombes présentes dans le niveau
var initialBossX = 700; // Position X initiale du boss
var initialBossY = 300; // Position Y initiale du boss
const bossLowerYLimit = 300; // Limite inférieure de déplacement du boss sur l'axe Y
const maxBombSpeed = 300; // Vitesse maximale des bombes (non utilisée actuellement)
var son_niveau3; // Variable pour le son du niveau 3

export default class niveau3 extends Phaser.Scene {
  /**
   * Constructeur de la classe niveau3.
   * Initialise la scène avec la clé "niveau3".
   */
  constructor() {
    super({ key: "niveau3" });
    this.gameOver = false; // Initialisation de la variable gameOver à false
  }

  /**
   * Fonction preload.
   * Charge les assets nécessaires pour le niveau 3.
   */
  preload() {
    this.load.audio("final", "src/assets/final.mp3"); // Charge le fichier audio "final.mp3"
    this.load.image("img_bunker", "src/assets/bunker.png"); // Charge l'image du bunker
    this.load.image("img_plateforme_bunker", "src/assets/platform_bunker.png"); // Charge l'image des plateformes du bunker
    this.load.image("img_plateforme_bunker_mini", "src/assets/platform_bunker_mini.png"); // Charge l'image des mini-plateformes du bunker
    this.load.image("img_perso", "src/assets/perso.png"); // Charge l'image du personnage
    this.load.image("bullet", "src/assets/sombrero.png"); // Charge l'image de la balle du joueur
    this.load.image("Manu_macron", "src/assets/MAnu.png"); // Charge l'image du boss (Manu Macron)
    this.load.image("bossBullet", "src/assets/baguette.png"); // Charge l'image de la balle du boss (baguette)
    this.load.image("croissant", "src/assets/croissant.png"); // Charge l'image du croissant (pour les bombes)
  }

  /**
   * Fonction create.
   * Crée les éléments du niveau 3 (arrière-plan, plateformes, joueur, boss, etc.).
   */
  create() {
    this.add.image(500, 400, "img_bunker"); // Ajoute l'image du bunker en arrière-plan
    this.groupe_plateformes_bunker = this.physics.add.staticGroup(); // Création d'un groupe statique pour les plateformes du bunker
    // Création et ajout des plateformes au groupe
    this.groupe_plateformes_bunker.create(200, 450, "img_plateforme_bunker");
    this.groupe_plateformes_bunker.create(600, 450, "img_plateforme_bunker");
    this.groupe_plateformes_bunker.create(270, 260, "img_plateforme_bunker");
    this.groupe_plateformes_bunker.create(500, 260, "img_plateforme_bunker");
    this.groupe_plateformes_bunker.create(50, 334, "img_plateforme_bunker_mini");
    this.groupe_plateformes_bunker.create(150, 334, "img_plateforme_bunker_mini");
    this.groupe_plateformes_bunker.create(170, 334, "img_plateforme_bunker_mini");
    this.groupe_plateformes_bunker.create(800, 310, "img_plateforme_bunker_mini");
    this.porte_retour = this.physics.add.staticSprite(100, 409, "img_porte3");// Ajout de la porte de retour
    this.player = this.physics.add.sprite(100, 409, "img_perso"); // Ajout du joueur
    this.player.setBounce(0.2); // Ajout d'un rebond au joueur
    this.player.setCollideWorldBounds(true); // Le joueur ne peut pas sortir des limites du monde
    this.player.direction = "right"; // Initialisation de la direction du joueur vers la droite
    this.clavier = this.input.keyboard.createCursorKeys(); // Création de l'objet pour les touches directionnelles
    boutonFeu = this.input.keyboard.addKey('A'); // Création de l'objet pour la touche 'A' (tir)
    this.physics.add.collider(this.player, this.groupe_plateformes_bunker); // Gestion de la collision entre le joueur et les plateformes du bunker
    boss = this.physics.add.sprite(initialBossX, initialBossY, "Manu_macron"); // Ajout du boss
    boss.setImmovable(true); // Le boss ne peut pas être déplacé par d'autres objets
    boss.setCollideWorldBounds(true); // Le boss ne peut pas sortir des limites du monde
    boss.setBounce(0.3); // Ajout d'un rebond au boss
    boss.body.setAllowGravity(false); // Le boss n'est pas affecté par la gravité
    this.physics.add.collider(boss, this.groupe_plateformes_bunker); // Gestion de la collision entre le boss et les plateformes du bunker
    boss.health = bossHealth; // Attribution des points de vie au boss
    boss.isDead = false; // Initialisation de l'état de mort du boss à false
    boss.direction = "left"; // Initialisation de la direction du boss vers la gauche
    // Création de la barre de vie du boss et de son fond
    let healthBarWidth = 300; // Largeur de la barre de vie
    let healthBarHeight = 20; // Hauteur de la barre de vie
    let healthBarX = 400; // Position X de la barre de vie
    let healthBarY = 50; // Position Y de la barre de vie
    bossHealthBarBackground = this.add.rectangle(healthBarX, healthBarY, healthBarWidth, healthBarHeight, 0x000000); // Création du fond de la barre de vie
    bossHealthBar = this.add.rectangle(healthBarX, healthBarY, healthBarWidth, healthBarHeight, 0xff0000); // Création de la barre de vie
    bossHealthBarBackground.setOrigin(0.5, 0.5); // Centrage du point d'origine
    bossHealthBar.setOrigin(0.5, 0.5); // Centrage du point d'origine
    bossHealthBarBackground.setScrollFactor(0); // La barre de vie ne bouge pas avec la caméra
    bossHealthBar.setScrollFactor(0); // La barre de vie ne bouge pas avec la caméra
    bossHealthBarBackground.setVisible(false); // Rend la barre de vie invisible au début
    bossHealthBar.setVisible(false); // Rend la barre de vie invisible au début
    bossHealthText = this.add.text(healthBarX, healthBarY, "Boss Health: " + boss.health, { fontSize: "20px", fill: "#ffffff", fontFamily: "Arial", backgroundColor: "#000000", padding: { x: 10, y: 5 }, }); // Ajout du texte de la barre de vie
    bossHealthText.setOrigin(0.5, 0.5); // Centrage du point d'origine du texte
    bossHealthText.setScrollFactor(0); // Le texte ne bouge pas avec la caméra
    bossHealthText.setVisible(false); // Rend le texte invisible au début
    playerHealthText = this.add.text(16, 40, "Player Health: " + playerHealth, { fontSize: "20px", fill: "#ffffff", fontFamily: "Arial", backgroundColor: "#000000", padding: { x: 10, y: 5 }, }); // Ajout du texte des PV du joueur
    playerHealthText.setScrollFactor(0); // Le texte ne bouge pas avec la caméra
    groupeBullets = this.physics.add.group(); // Création d'un groupe pour les balles du joueur
    bossBullets = this.physics.add.group(); // Création d'un groupe pour les balles du boss
    this.physics.add.overlap(groupeBullets, boss, this.hitBoss, null, this); // Gestion de la collision entre les balles du joueur et le boss (appel de la fonction this.hitBoss)
    this.physics.add.overlap(this.player, bossBullets, this.playerHitByBossBullet, null, this); // Gestion de la collision entre le joueur et les balles du boss (appel de la fonction this.playerHitByBossBullet)

    son_niveau3 = this.sound.add("final"); // Ajout du son au gestionnaire de son

    console.log(this.cache.audio.exists("final")); // Vérifie si le son est bien chargé
    if (this.cache.audio.exists("final")) {
      son_niveau3.play({ loop: true }); // On joue le son, en boucle
    } else {
      console.error("Le fichier audio ne s'est pas chargé correctement !"); //si le fichier n'est pas chargé, on l'affiche en console.
    }

    // Creation des bombes
    groupe_bombes = this.physics.add.group();//creation du groupe pour les bombes
    this.physics.add.collider(groupe_bombes, this.groupe_plateformes_bunker); //gestion de la collision entre les bombes et les plateforme
    this.resetBombs(); //appel la fonction resetBombs pour créer les bombes
    //gestion de la collision entre les bombes et le joueur
    this.physics.add.collider(this.player, groupe_bombes, this.chocAvecBombe, null, this); //si le joueur est touché, on appel la fonction chocAvecBombe

    this.bossPattern(boss);//on appel la fonction bossPattern qui va gerer le pattern du boss
  }
  /**
   * Fonction chocAvecBombe.
   * Gère la collision entre le joueur et une bombe.
   * @param {Phaser.GameObjects.Sprite} un_player - Le sprite du joueur.
   * @param {Phaser.GameObjects.Sprite} une_bombe - Le sprite de la bombe.
   */
  chocAvecBombe(un_player, une_bombe) { // function call when the player hit a bomb
    //check if the player is not invincible
    playerHealth -= 1; //remove 1hp at the player
    playerHealthText.setText("Player Health: " + playerHealth);//update the text of the player health
    if (playerHealth <= 0) { //if the player have 0 hp or less
      this.killPlayer();//Call the function killPlayer in this file
    }
    une_bombe.destroy();//destoy the bomb
  }
  /**
   * Fonction resetBombs.
   * Remet en place les bombes
   */
  resetBombs() {
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
  /**
   * Fonction resetBoss.
   * Remet en place le boss (lorsque le joueur meurt).
   */
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
  /**
   * Fonction hitBoss.
   * Gère la collision entre une balle du joueur et le boss.
   * @param {Phaser.GameObjects.Sprite} boss - Le sprite du boss.
   * @param {Phaser.GameObjects.Sprite} bullet - Le sprite de la balle.
   */
  hitBoss(boss, bullet) {
    bullet.destroy(); // Détruit la balle
    boss.health -= 5; // Changed to 5 (Fixed) // Enlève 5 points de vie au boss
    // show the health bar
    if (!bossHealthBarBackground.visible) { //si la barre de vie du boss n'est pas visible
      bossHealthBarBackground.setVisible(true); //make visible the healthBar (fix) //rendre la barre de vie visible
      bossHealthBar.setVisible(true);//make visible the healthBar (fix) //rendre la barre de vie visible
      bossHealthText.setVisible(true);//make visible the healthBar (fix) //rendre le texte de la barre de vie visible
    }
    let healthPercentage = boss.health / bossHealth; // Calcule le pourcentage de vie restante
    bossHealthBar.width = 300 * healthPercentage; // Met à jour la largeur de la barre de vie
    bossHealthText.setText("Boss Health: " + boss.health); // Met à jour le texte de la barre de vie
    if (boss.health <= 0) this.bossDeath(boss); // Si le boss n'a plus de vie, on appel la fonction bossDeath

    // Remove the timer logic (inutile)
    if (bossHealthBarTimer) {
      bossHealthBarTimer.remove();
      bossHealthBarTimer = null;
    }
  }
  /**
   * Fonction playerHitByBossBullet.
   * Gère la collision entre le joueur et une balle du boss.
   * @param {Phaser.GameObjects.Sprite} player - Le sprite du joueur.
   * @param {Phaser.GameObjects.Sprite} bullet - Le sprite de la balle du boss.
   */
  playerHitByBossBullet(player, bullet) {
    bullet.destroy(); // Détruit la balle
    playerHealth--; // Enlève un PV au joueur
    playerHealthText.setText("Player Health: " + playerHealth); //update le texte des PV du joueur
    if (playerHealth <= 0) { //si le joueur n'a plus de vie
      this.killPlayer(); //Appel la fonction kill player
      this.gameOver = true; //mettre le gameOver a true
    }
  }
  // New: Boss's bullet attack
  /**
   * Fonction bossShoot.
   * Fait tirer le boss.
   * Crée une balle (baguette) et la fait se déplacer.
   * @param {Phaser.GameObjects.Sprite} boss - Le sprite du boss.
   */
  bossShoot(boss) {
    if (!boss.isDead) { // Si le boss est en vie
      let bossBullet = bossBullets.create(boss.x, boss.y, "bossBullet"); // Création d'une balle (baguette) à la position du boss
      bossBullet.setVelocityX(boss.direction === "left" ? -200 : 200); // Définit la vitesse de la balle : 200 pixels/seconde vers la gauche si le boss regarde à gauche, sinon vers la droite
      bossBullet.body.allowGravity = false; // La balle n'est pas affectée par la gravité
      bossBullet.setCollideWorldBounds(false); // La balle n'est pas limitée par les bords du monde
      bossBullet.body.onWorldBounds = true; // Active l'évènement "worldbounds" (pour détecter quand la balle sort du monde)
    }
  }

  /**
   * Fonction bossDeath.
   * Gère la mort du boss.
   * @param {Phaser.GameObjects.Sprite} boss - Le sprite du boss.
   */
  bossDeath(boss) {
    boss.isDead = true; // Indique que le boss est mort
    boss.setVelocity(0, 0); // Arrête le boss
    boss.destroy(); // Détruit le sprite du boss
    bossHealthBar.destroy(); // Détruit la barre de vie du boss
    bossHealthBarBackground.destroy(); // Détruit le fond de la barre de vie du boss
    bossHealthText.destroy(); // Détruit le texte de la barre de vie du boss
    this.cameras.main.shake(500, 0.05); // Fait trembler la caméra
    son_niveau3.stop(); // Arrête la musique du niveau 3
    this.scene.switch("victoire"); // Change de scène et va vers la scene "victoire"
  }

  /**
   * Fonction bossPattern.
   * Gère le comportement du boss (déplacement, tir, etc.).
   * @param {Phaser.GameObjects.Sprite} boss - Le sprite du boss.
   */
  bossPattern(boss) {
    let bossPhase = 1; // Initialise la phase du boss à 1
    this.time.addEvent({ // Ajoute un événement qui se répète
      delay: 2000, // Délai de 2000 millisecondes (2 secondes)
      callback: () => { // Fonction appelée toutes les 2 secondes
        if (!boss.isDead) { // Si le boss est en vie
          //Calcule la distance entre le boss et le joueur
          let distance = Phaser.Math.Distance.Between(boss.x, boss.y, this.player.x, this.player.y);
          //Déplace le boss vers le joueur
          if (distance > 100) { // vérifie la distance entre le joueur et le boss (si la distance est supérieur a 100)
            if (this.player.x < boss.x) { // Si le joueur est à gauche du boss
              boss.direction = "left" // Le boss regarde à gauche
              boss.setVelocityX(-100); // Déplace le boss vers la gauche
              boss.flipX = true; // Retourne le sprite du boss horizontalement (pour qu'il regarde vers la gauche)
            } else { // Sinon (le joueur est à droite du boss)
              boss.direction = "right" // Le boss regarde à droite
              boss.setVelocityX(100); // Déplace le boss vers la droite
              boss.flipX = false; // Remet le sprite du boss dans sa direction normale (vers la droite)
            }
            boss.setImmovable(true); // Empêche le boss d'être poussé lorsqu'il se déplace
          }
          if (bossPhase === 2) { // Si le boss est dans la phase 2
            // Phase 2: Saut et tir
            boss.setImmovable(false); // Permet au boss de bouger AVANT de sauter

            boss.setVelocityY(-200); // Fait sauter le boss
            //Vérifie la vitesse précédente du boss
            if (boss.body.velocity.x > 0) { // Si le boss se déplaçait vers la droite
              boss.direction = "right" // Le boss regarde à droite
              boss.flipX = false; // Remet le sprite du boss dans sa direction normale (vers la droite)
            } else { // Sinon (le boss se déplaçait vers la gauche)
              boss.direction = "left" // Le boss regarde à gauche
              boss.flipX = true; // Retourne le sprite du boss horizontalement (pour qu'il regarde vers la gauche)
            }
          }
          if (distance < 100) { // si la distance entre le boss et le joueur est inférieur a 100
            boss.setVelocityX(0); // Arret du déplacement horizontal du boss
          }
           if (boss.y > bossLowerYLimit) { // Si le boss descend trop bas
            boss.setVelocityY(-100); // Il saute vers le haut
          }
           if (boss.y > 400) { // Si le boss est descendu en dessous de la limite
             boss.setVelocityY(-100); //force le boss à remonter
            }
        }
      },
      loop: true, // L'événement se répète en boucle
    });
    this.time.addEvent({ // Ajoute un événement qui se répète
      delay: 5000, // Délai de 5000 millisecondes (5 secondes)
      callback: () => { // Fonction appelée toutes les 5 secondes
        if (!boss.isDead) { // Si le boss est en vie
          if (boss.x < 200 || boss.x > 800) { // si le boss est sur le coté de la map, on change de phase
            bossPhase = 2; // Met la phase à 2
          } else { // sinon
            bossPhase = bossPhase === 1 ? 2 : 1; // Alterne entre la phase 1 et la phase 2
          }
        }
      },
      loop: true, // L'événement se répète en boucle
    });
    this.time.addEvent({ // Ajoute un événement qui se répète
      delay: Phaser.Math.Between(1000, 2000), // Délai aléatoire entre 1000 et 2000 millisecondes (1 et 2 secondes)
      callback: () => { // Fonction appelée après le délai
        this.bossShoot(boss); // Fait tirer le boss
      },
      callbackScope: this, // Lie la fonction à la scène actuelle
      loop: true // L'événement se répète en boucle
    });
  }
  /**
   * Fonction killPlayer.
   * Gère la mort du joueur.
   */
  killPlayer() {
    console.log("Le joueur est mort !"); // Affiche dans la console
    if (this.player) { // Vérifie si le joueur existe
      this.player.setTint(0xff0000); // Met une teinte rouge sur le joueur
      this.player.setVelocity(0, 0); // Arrête la vitesse du joueur
      this.player.anims.stop(); // Arrête l'animation du joueur
    }
    playerHealth = 5;//réinitialise la vie du joueur
    playerHealthText.setText("Player Health: " + playerHealth);//update le text des pv
    this.physics.pause(); // Met la physique du jeu en pause (pour éviter d'autres collisions)
    this.time.delayedCall(3000, () => { // Attend 3 secondes (3000 millisecondes) avant de relancer le jeu
      this.resetBoss();//réinitialise le boss
      this.resetBombs();//réinitialise les bombes
      this.scene.start("niveau2"); // Redémarre la scène 2
      this.physics.resume(); // Relance la physique du jeu
      this.gameOver = false;//remet gameOver a false
    });
  }
  /**
   * Fonction update.
   * Gère les mises à jour du niveau (déplacements, tir, etc.).
   */
  update() {
    if (Phaser.Input.Keyboard.JustDown(boutonFeu)) { // Si la touche de tir est pressée
      this.tirer(this.player); // Fait tirer le joueur
    }
    if (this.clavier.left.isDown) { // Si la flèche gauche est pressée
      this.player.setVelocityX(-160); // Déplace le joueur vers la gauche
      this.player.anims.play("anim_tourne_gauche", true); // Joue l'animation de marche vers la gauche
      this.player.direction = "left"; // Met la direction du joueur à gauche
    } else if (this.clavier.right.isDown) { // Si la flèche droite est pressée
      this.player.setVelocityX(160); // Déplace le joueur vers la droite
      this.player.anims.play("anim_tourne_droite", true); // Joue l'animation de marche vers la droite
      this.player.direction = "right"; // Met la direction du joueur à droite
    } else { // Si aucune flèche n'est pressée
      this.player.setVelocityX(0); // Arrête le joueur
      this.player.anims.play("anim_face"); // Joue l'animation de face (immobile)
    }
    if (this.clavier.up.isDown && this.player.body.touching.down) { // Si la flèche haut est pressée et que le joueur touche le sol
      this.player.setVelocityY(-330); // Fait sauter le joueur
    }
    if (this.clavier.down.isDown) { // Si la flèche bas est pressée
      this.player.setVelocityY(260); // Déplace le joueur vers le bas
      this.player.anims.play("anim_face"); // Joue l'animation de face (immobile)
    }
    if (this.gameOver) { // Si gameOver est true
      return; // On sort de la fonction
    }
    if (this.gameOver) { //si gameOver est a true
      return; //on sort de la fonction
    }
  }
  /**
   * Fonction tirer.
   * Gère le tir du joueur.
   * @param {Phaser.GameObjects.Sprite} player - Le sprite du joueur.
   */
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