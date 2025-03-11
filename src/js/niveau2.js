import * as fct from "/src/js/fonctions.js";
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
  }


  create() {
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
    calque_plateformes.setCollisionByProperty({estSolide: true }); 

    // redimentionnement du monde avec les dimensions calculées via tiled
    this.physics.world.setBounds(0, 0, 3200, 640);
    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 3200, 640);
    // ancrage de la caméra sur le joueur
    this.porte_retour = this.physics.add.staticSprite(100, 525, "img_porte2");
    this.porte3 = this.physics.add.staticSprite(3150, 525, "img_porte3");
    this.player = this.physics.add.sprite(100, 450, "img_perso");
    this.player.refreshBody();
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, calque_plateformes);
    this.cameras.main.startFollow(this.player);
    this.clavier = this.input.keyboard.createCursorKeys();
    bombe = this.physics.add.group();
    this.physics.add.collider(bombe, groupe_plateformes);
    

    var une_bombe = bombe.create(500, 16, "img_bombe");
    une_bombe.setBounce(0.8);
    une_bombe.setCollideWorldBounds(true);
    une_bombe.setVelocity(Phaser.Math.Between(-200, 200), 20);
    une_bombe.allowGravity = false;
    this.physics.add.collider(player, bombe, chocAvecBombe, null, this);
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
    }
  }
}
  
function chocAvecBombe(un_player, une_bombe) { // fonction appelée lorsqu'une bombe touche le joueur
  console.log("hit"); //debug 
  this.physics.pause(); // on met le jeu en pause
  player.setTint(0xff00ff); // on change la couleur du joueur
  player.anims.play("anim_face"); // on joue l'animation "anim_face"
  gameOver = true; // on met la variable gameOver à true
  killPlayer(this); // on appelle la fonction killPlayer
}
