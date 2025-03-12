import * as fct from "/src/js/fonctions.js";

var groupe_bombes;
var gameOver = false;
var groupe_plateformes;
var invincible = true; // New variable for invincibility
var playerHealth = 1; // Initialize player's health
var playerHealthText; // New variable for the player's health text
var hasInteractedWithCabine = false; // New variable to track interaction with the cabine
var son_niveau2;

export default class niveau2 extends Phaser.Scene {
  constructor() {
    super({
      key: "niveau2"
    });
    this.level2Completed = false;
  }
  preload() {
    this.load.audio("fort", "src/assets/fort.mp3");
    this.load.image("Phaser_tuile_de_jeu_v0", "src/assets/pixil-frame-0 (3).png");
    this.load.tilemapTiledJSON("carte", "src/assets/mapNiv2.json");
    this.load.image("img_porte1", "src/assets/porte1.png");
    this.load.image("img_porte2", "src/assets/porte2.png");
    this.load.image("img_perso", "src/assets/perso.png");
    this.load.image("img_cabine", "src/assets/cabine.png");
    this.load.image("img_plateforme_b", "src/assets/platform_b.png");
    this.load.image("bombe", "src/assets/bombe.png");
  }

  create() {

    son_niveau2 = this.sound.add("fort");

    console.log(this.cache.audio.exists("fort")); // Vérifie si le son est bien chargé
    if (this.cache.audio.exists("fort")) {
      son_niveau2.play({ loop: true });
    } else {
      console.error("Le fichier audio ne s'est pas chargé correctement !");
    }
    this.hasInteractedWithCabine = false; //reset the variable
    this.playerHealth = 5;
    groupe_plateformes = this.physics.add.staticGroup();

    const carteDuNiveau = this.add.tilemap("carte");
    const tileset = carteDuNiveau.addTilesetImage(
      "tuile_de_jeuv0",
      "Phaser_tuile_de_jeu_v0"
    );
    const calque_background = carteDuNiveau.createLayer(
      "background",
      tileset
    );
    const calque_background_2 = carteDuNiveau.createLayer(
      "background2",
      tileset
    );
    const calque_plateformes = carteDuNiveau.createLayer(
      "plateformes",
      tileset
    );
    calque_plateformes.setCollisionByProperty({ estSolide: true });

    this.physics.world.setBounds(0, 0, 3200, 640);
    this.cameras.main.setBounds(0, 0, 3200, 640);
    this.cabine = this.physics.add.staticSprite(2400, 115, "img_cabine");
    this.porte_retour = this.physics.add.staticSprite(100, 525, "img_porte2");
    this.porte3 = this.physics.add.staticSprite(3150, 525, "img_porte3");
    this.add.text(2990, 300, "Appelle le propriétaire du\n bunker pour qu'il vienne\n t'ouvrir ;)", {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "12pt",
      color: "#000000"
    });
    this.player = this.physics.add.sprite(100, 450, "img_perso");
    this.player.body.setSize(20, 30, 6, 18);
    this.player.body.setOffset(6, 18);
    this.player.refreshBody();
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, calque_plateformes);
    this.cameras.main.startFollow(this.player);
    this.clavier = this.input.keyboard.createCursorKeys();
    this.groupe_plateformes = this.physics.add.staticGroup();
    this.physics.add.collider(this.player, this.groupe_plateformes)
    this.groupe_plateformes.create(2400, 150, "img_plateforme_be");




    groupe_bombes = this.physics.add.group();
    this.physics.add.collider(groupe_bombes, calque_plateformes);
    for (let i = 0; i < 20; i++) {
      let x = Phaser.Math.Between(50, 3000);
      let y = Phaser.Math.Between(100, 130);

      let une_bombe = groupe_bombes.create(x, y, "bombe"); //Change the texture here

      une_bombe.setBounce(Phaser.Math.FloatBetween(1, 1));
      une_bombe.setCollideWorldBounds(true);

      let vitesseX = Phaser.Math.Between(-200, 200);
      let vitesseY = Phaser.Math.Between(100, 130);

      une_bombe.setVelocity(vitesseX, vitesseY);
      une_bombe.allowGravity = false;
    }

    this.physics.add.collider(this.player, groupe_bombes, this.chocAvecBombe, null, this);
  }

  update() {
    if (this.clavier.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("anim_tourne_gauche", true);
    } else if (this.clavier.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("anim_tourne_droite", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("anim_face");
    }
    if (this.clavier.up.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-325);
    }

    if (this.clavier.down.isDown) {
      this.player.setVelocityY(260);
      this.player.anims.play("anim_face");
    }

    if (Phaser.Input.Keyboard.JustDown(this.clavier.space) == true) {
      if (this.physics.overlap(this.player, this.porte_retour)) {
        son_niveau2.stop();
        console.log("niveau 3 : retour vers selection");
        this.scene.switch("selection");
      }
      if (this.physics.overlap(this.player, this.porte3) && hasInteractedWithCabine) { // Add condition to check if player has interacted with the cabine
        son_niveau2.stop();
        console.log("niveau 3 : passage au niveau 3");
        this.scene.switch("niveau3");
      }
      if (this.physics.overlap(this.player, this.cabine)) {
        son_niveau2.stop();
        console.log("mini defi : passage au defi");
        this.scene.switch("minijeu");
        hasInteractedWithCabine = true; // Set the variable to true when the player interacts with the cabine
      }
    }
  }

  chocAvecBombe(un_player, une_bombe) {
    if (!invincible) {
      playerHealth -= 2; //enleve 2PV au joueur
      playerHealthText.setText("Player Health: " + playerHealth);//update le texte du player Health
      if (playerHealth <= 0) { //si le player a 0PV ou moins
        this.physics.pause(); //mettre le jeu en pause
        this.player.setTint(0xff0000); //changer la couleur du joueur
        this.player.anims.play("anim_face"); //lancer l'animation du joueur
        gameOver = true; //mettre game over a true
        fct.killPlayer(this);//appeler la fonction kill player qui est dans fonction.js
      }
      une_bombe.destroy();
    }
  }
}
