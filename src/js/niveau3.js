import * as fct from "/src/js/fonctions.js";

var groupe_plateforme_bunker
export default class niveau3 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau3" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    this.load.image("img_bunker", "src/assets/bunker.png");
    this.load.image("img_plateforme_bunker", "src/assets/platform_bunker.png");
    this.load.image("img_plateforme_bunker_mini", "src/assets/platform_bunker_mini.png");
}

  create() {
    this.add.image(500, 400, "img_bunker");
    this.groupe_plateformes_bunker= this.physics.add.staticGroup();
    this.groupe_plateformes_bunker.create(200, 450, "img_plateforme_bunker");
    this.groupe_plateformes_bunker.create(600, 450, "img_plateforme_bunker");
    this.groupe_plateformes_bunker.create(270, 260, "img_plateforme_bunker");
    this.groupe_plateformes_bunker.create(500, 260, "img_plateforme_bunker");
    this.groupe_plateformes_bunker.create(50, 334, "img_plateforme_bunker_mini");
    this.groupe_plateformes_bunker.create(150, 334, "img_plateforme_bunker_mini");
    this.groupe_plateformes_bunker.create(170, 334, "img_plateforme_bunker_mini");
    this.groupe_plateformes_bunker.create(800, 310, "img_plateforme_bunker_mini");
    // ajout d'un texte distintcif  du niveau
    this.add.text(400, 100, "Vous êtes dans le Bunker", {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt"
    });

    this.porte_retour = this.physics.add.staticSprite(100, 409, "img_porte3");

    this.player = this.physics.add.sprite(100, 409, "img_perso");
    this.player.body.setSize(20, 30, 6, 18); // taille du rectangle de collision
    this.player.body.setOffset(6, 18); // décalage du rectangle de collision
    this.player.refreshBody();
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, this.groupe_plateformes_bunker);
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
    if (this.clavier.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
    if (this.clavier.down.isDown) {
      this.player.setVelocityY(260);
      this.player.anims.play("anim_face");
    }

    if (Phaser.Input.Keyboard.JustDown(this.clavier.space) == true) {
      if (this.physics.overlap(this.player, this.porte_retour)) {
        console.log("niveau 3 : retour vers selection");
        this.scene.switch("niveau2");
      }
    }
  }
}
