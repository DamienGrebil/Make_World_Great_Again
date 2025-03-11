import * as fct from "/src/js/fonctions.js";
import selection from "/src/js/selection.js";
export default class niveau1 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau1" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
  }

  create() {
    this.add.image(400, 300, "img_maison_b");
    this.groupe_plateformes = this.physics.add.staticGroup();
    this.groupe_plateformes.create(200, 584, "img_plateforme_b");
    this.groupe_plateformes.create(600, 584, "img_plateforme_b");
    
    
    this.groupe_plateformes.create(140, 460, "img_plateforme_be");
    this.groupe_plateformes.create(640, 460, "img_plateforme_be");
    this.groupe_plateformes.create(0, 370, "img_plateforme_be");
    this.groupe_plateformes.create(165, 280, "img_plateforme_be");
    this.groupe_plateformes.create(625, 280, "img_plateforme_be");
    this.groupe_plateformes.create(0, 280, "img_plateforme_be");
    this.groupe_plateformes.create(700, 280, "img_plateforme_be");
    this.groupe_plateformes.create(140, 170, "img_plateforme_be");
    this.groupe_plateformes.create(300, 170, "img_plateforme_be");
    this.groupe_plateformes.create(500, 170, "img_plateforme_be");
    this.groupe_plateformes.create(655, 170, "img_plateforme_be");

    this.groupe_plateformes.create(450, 500, "img_plateforme_mini");
    this.groupe_plateformes.create(450, 505, "img_plateforme_mini");
    this.groupe_plateformes.create(340, 500, "img_plateforme_mini");
    this.groupe_plateformes.create(340, 505, "img_plateforme_mini");
    this.groupe_plateformes.create(395, 350, "img_plateforme_mini");
    this.groupe_plateformes.create(395, 355, "img_plateforme_mini"); 
    this.groupe_plateformes.create(395, 130, "img_plateforme_mini");
    this.groupe_plateformes.create(395, 125, "img_plateforme_mini");
    this.groupe_plateformes.create(370, 130, "img_plateforme_mini");
    this.groupe_plateformes.create(370, 125, "img_plateforme_mini");
    this.groupe_plateformes.create(420, 130, "img_plateforme_mini");
    this.groupe_plateformes.create(420, 125, "img_plateforme_mini");






    // ajout d'un texte distintcif  du niveau
    this.add.text(600, 30, "White House", {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt",
      color: "#000000" // Définit la couleur du texte en noir
    });

    this.porte_retour = this.physics.add.staticSprite(100, 550, "img_porte1");
    this.porte2 = this.physics.add.staticSprite(397, 100, "img_porte2");

    this.player = this.physics.add.sprite(100, 450, "img_perso");
    this.player.refreshBody();
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, this.groupe_plateformes);
    fct.startCountdown(this);

    this.add.image(100, 245, "img_agent_d"); 
    this.add.image(600, 245, "img_agent_g"); 
    this.add.image(50, 335, "img_agent_d"); 
    this.add.image(700, 425, "img_agent_g"); 

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
        this.scene.switch("selection");
      }
      if (this.physics.overlap(this.player, this.porte2)) {
        this.scene.switch("niveau2");
      }
    }
  }
}
