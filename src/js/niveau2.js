import * as fct from "/src/js/fonctions.js";

var groupe_bombes;
var gameOver = false;
var groupe_plateformes;
var invincible = true; // New variable for invincibility

export default class niveau2 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau2" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    this.load.image("Phaser_tuile_de_jeu_v0", "src/assets/pixil-frame-0 (3).png");
    // chargement de la carte
    this.load.tilemapTiledJSON("carte", "src/assets/mapNiv2.json");
    this.load.image("img_porte1", "src/assets/porte1.png");
    this.load.image("img_porte2", "src/assets/porte2.png");
    this.load.image("img_perso", "src/assets/perso.png");
    this.load.image("img_bombe", "src/assets/bombe.png")
    this.load.image("img_cabine", "src/assets/cabine.png")
    this.load.image("img_plateforme_b", "src/assets/platform_b.png");
  }

  create() {

    groupe_plateformes = this.physics.add.staticGroup();



    // chargement de la carte
    const carteDuNiveau = this.add.tilemap("carte");
    // chargement du jeu de tuiles
    const tileset = carteDuNiveau.addTilesetImage(
      "tuile_de_jeuv0",
      "Phaser_tuile_de_jeu_v0"
    );
    // chargement du calque calque_background
    const calque_background = carteDuNiveau.createLayer(
      "background",
      tileset
    );
    // chargement du calque calque_background_2
    const calque_background_2 = carteDuNiveau.createLayer(
      "background2",
      tileset
    );
    // chargement du calque calque_plateformes
    const calque_plateformes = carteDuNiveau.createLayer(
      "plateformes",
      tileset
    );
    calque_plateformes.setCollisionByProperty({ estSolide: true });

    // redimentionnement du monde avec les dimensions calculées via tiled
    this.physics.world.setBounds(0, 0, 3200, 640);
    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 3200, 640);
    // Création de la cabine
    this.cabine = this.physics.add.staticSprite(2400, 115, "img_cabine");
    // ancrage de la caméra sur le joueur
    this.porte_retour = this.physics.add.staticSprite(100, 525, "img_porte2");
    this.porte3 = this.physics.add.staticSprite(3150, 525, "img_porte3");
    this.player = this.physics.add.sprite(100, 450, "img_perso");
    this.player.body.setSize(20, 30, 6, 18); // taille du rectangle de collision
    this.player.body.setOffset(6, 18); // décalage du rectangle de collision
    this.player.refreshBody();
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, calque_plateformes);
    this.cameras.main.startFollow(this.player);
    this.clavier = this.input.keyboard.createCursorKeys();
    this.groupe_plateformes = this.physics.add.staticGroup();
    this.physics.add.collider(this.player, this.groupe_plateformes)
    this.groupe_plateformes.create(2400, 150, "img_plateforme_be");
    

    this.add.text(3000, 300, "Appelle le propriétaire du bunker\npour qu'il vienne t'ouvrir ;)", {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "12pt",
      color: "#000000" // Définit la couleur du texte en noir
    });

    groupe_bombes = this.physics.add.group();
    this.physics.add.collider(groupe_bombes, calque_plateformes);
    for (let i = 0; i < 20; i++) { // Modifier le 5 pour changer le nombre de bombes
      let x = Phaser.Math.Between(50, 3000); // Position X aléatoire
      let y = Phaser.Math.Between(100, 130); // Position Y aléatoire (hauteur aléatoire)

      let une_bombe = groupe_bombes.create(x, y, "img_bombe");

      une_bombe.setBounce(Phaser.Math.FloatBetween(1, 1)); // Rebond aléatoire entre 0.6 et 1
      une_bombe.setCollideWorldBounds(true);

      let vitesseX = Phaser.Math.Between(-200, 200); // Vitesse X aléatoire
      let vitesseY = Phaser.Math.Between(100, 130);  // Vitesse Y aléatoire pour des rebonds différents

      une_bombe.setVelocity(vitesseX, vitesseY);
      une_bombe.allowGravity = false;
    }

    // Gestion de la collision entre le joueur et les bombes
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
        console.log("niveau 3 : retour vers selection");
        this.scene.switch("niveau1");
      }
      if (this.physics.overlap(this.player, this.porte3)) {
        console.log("niveau 3 : passage au niveau 3");
        this.scene.switch("niveau3");
      }
      if (this.physics.overlap(this.player, this.cabine)) {
        console.log("mini defi : passage au defi");
        this.scene.switch("minijeu");
      }
    }
  }

  chocAvecBombe(un_player, une_bombe) {
     if (!invincible){
         this.physics.pause();
          this.player.setTint(0xff0000);
          this.player.anims.play("anim_face");
          gameOver = true;
         fct.killPlayer(this);
      }
  }
}
