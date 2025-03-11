import * as fct from "/src/js/fonctions.js";

export default class niveau1 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau1" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    // chargement tuiles de jeu
    this.load.image("Phaser_Tuile_de_jeuV0", "src/assets/pixil-frame-0 (1).png");

    // chargement de la carte
    this.load.tilemapTiledJSON("carte", "src/assets/map.json");
    this.load.image("img_porte1", "src/assets/porte1.png");
    this.load.image("img_porte2", "src/assets/porte2.png");
    this.load.image("img_perso", "src/assets/perso.png");
    this.gameOver = false;
  }

  create() {
    // chargement de la carte
    const carteDuNiveau = this.add.tilemap("carte");

    // chargement du jeu de tuiles
    const tileset = carteDuNiveau.addTilesetImage(
          "Tuile_de_jeuV0",
          "Phaser_Tuile_de_jeuV0"
        ); 
    // chargement du calque calque_background
    const calque_background = carteDuNiveau.createLayer(
          "Calque de Tuiles 1",
          tileset
        );

    // chargement du calque calque_background_2
    const calque_background_2 = carteDuNiveau.createLayer(
        "route",
        tileset
      );
    calque_background_2.setCollisionByProperty({ estSolide: true }); 

    // redimentionnement du monde avec les dimensions calculées via tiled
    this.physics.world.setBounds(0, 0, 3200, 640);
    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 3200, 640);
    // ancrage de la caméra sur le joueur
    
    this.porte_retour = this.physics.add.staticSprite(200, 450, "img_porte1");
    this.porte2 = this.physics.add.staticSprite(750, 450, "img_porte2");
    this.player = this.physics.add.sprite(100, 450, "img_perso");
    this.player.refreshBody();
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, calque_background_2);
    this.cameras.main.startFollow(this.player);
    this.clavier = this.input.keyboard.createCursorKeys();
    this.startCountdown(); 
    this.physics.add.collider(this.player, this.groupe_plateformes);
    this.startCountdown(); //démare le compte à rebours
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
      this.player.setVelocityY(-200);
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
  startCountdown() {
    this.timeLeft = 10 * 60; // 10 minutes en secondes
    this.timerText = this.add.text(400, 20, "Temps restant: 10:00", {
      fontSize: "20px", // taille de la police
      fill: "#fff" // couleur de la police
    });

    this.time.addEvent({
      delay: 1000, // delai de 1 seconde
      callback: () => {
        this.timeLeft--;
        let minutes = Math.floor(this.timeLeft / 60); // division entière par 60
        let seconds = this.timeLeft % 60; // reste de la division par 60
        this.timerText.setText(`Temps restant: ${minutes}:${seconds.toString().padStart(2, '0')}`); // affichage du temps restant

        if (this.timeLeft <= 0) { // si le temps est écoulé
          this.killPlayer(); // on tue le joueur
        }
      },
      loop: true // boucle infinie
    });
  }

  killPlayer() {
    this.player.setTint(0xff0000); // on change la couleur du joueur
    this.player.setVelocity(0, 0); // on arrête le joueur
    this.player.anims.stop(); // on arrête l'animation du joueur
    this.time.delayedCall(5000, () => { // on attend 5 secondes
      this.scene.restart(); // on redémarre la scène
    });
  }
}