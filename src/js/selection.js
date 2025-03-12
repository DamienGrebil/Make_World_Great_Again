import * as fct from "/src/js/fonctions.js";
import { killPlayer } from "/src/js/fonctions.js"; // Import killPlayer here
/***********************************************************************/
/** VARIABLES GLOBALES 
/***********************************************************************/

var player; // désigne le sprite du joueur
var clavier; // pour la gestion du clavier
var groupe_plateformes;
var bombe;
var gameOver = false;
var boutonFeu;
var cursors;
var groupeBullets;
var groupeCibles;
var son_time;


// définition de la classe "selection"
export default class selection extends Phaser.Scene {
  constructor() {
    super({ key: "selection" }); // mettre le meme nom que le nom de la classe
  }

  /***********************************************************************/
  /** FONCTION PRELOAD 
/***********************************************************************/

  /** La fonction preload est appelée une et une seule fois,
   * lors du chargement de la scene dans le jeu.
   * On y trouve surtout le chargement des assets (images, son ..)
   */
  preload() {
    // tous les assets du jeu sont placés dans le sous-répertoire src/assets/
    this.load.audio("time", "src/assets/hans-zimmer-time.mp3");

    this.load.image("img_ciel", "src/assets/sky.png");
    this.load.image("img_regle", "src/assets/regle menu.png");
    this.load.image("img_drapeau", "src/assets/drapeau.png")
    this.load.image("img_plateforme", "src/assets/platform.png");
    this.load.image("img_plateforme_b", "src/assets/platform_b.png");
    this.load.image("img_plateforme_be", "src/assets/platform_be.png");
    this.load.image("img_plateforme_mini", "src/assets/platform_mini.png");
    this.load.image("img_bombe", "src/assets/bombe.png")
    this.load.spritesheet("img_perso", "src/assets/trump.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.image("img_maison_b", "src/assets/maison_blanche.png")
    this.load.image("img_trump_menu", "src/assets/trump menu.png")
    this.load.image("img_agent_g", "src/assets/agent_g.png")
    this.load.image("img_agent_d", "src/assets/agent_d.png")
    this.load.image("img_fond_menu", "src/assets/fond_menu.png")
    this.load.image("img_play", "src/assets/porte.transparente.png")
    this.load.image("img_porte1", "src/assets/door1.png");
    this.load.image("img_porte2", "src/assets/door2.png");
    this.load.image("img_porte_regle", "src/assets/porte.transparente.png");
    this.load.image("img_cabine", "src/assets/cabine.png");
    this.load.image("img_porte3", "src/assets/door3.png");
    this.load.image("img_bombe", "src/assets/bombe.png");
    cursors = this.input.keyboard.createCursorKeys();
    boutonFeu = this.input.keyboard.addKey('A');
    this.load.image("bullet", "src/assets/balle.png");
    this.load.image("cible_d", "src/assets/bouton_d.png");
    this.load.image("cible_g", "src/assets/bouton_g.png");
    this.load.image("img_victoire", "src/assets/VICTOIRE.png");

    // on charge deux fichiers audio avec les identifiants coupDeFeu et background



  }

  /***********************************************************************/
  /** FONCTION CREATE 
/***********************************************************************/


  create() {
    /*************************************
     *  CREATION DU MONDE + PLATEFORMES  *
     *************************************/

    // On ajoute une simple image de fond, le ciel, au centre de la zone affichée (400, 300)
    // Par défaut le point d'ancrage d'une image est le centre de cette derniere


    this.add.image(400, 290, "img_fond_menu");




    // ajout des sons au gestionnaire sound
    // recupération de variables pour manipuler le son


    son_time = this.sound.add("time");

    console.log(this.cache.audio.exists("time")); // Vérifie si le son est bien chargé
    if (this.cache.audio.exists("time")) {
      son_time.play({ loop: true });
    } else {
      console.error("Le fichier audio ne s'est pas chargé correctement !");
    }





    // la création d'un groupes permet de gérer simultanément les éléments d'une meme famille
    //  Le groupe groupe_plateformes contiendra le sol et deux platesformes sur lesquelles sauter
    // notez le mot clé "staticGroup" : le static indique que ces élements sont fixes : pas de gravite,
    // ni de possibilité de les pousser.
    groupe_plateformes = this.physics.add.staticGroup();
    // une fois le groupe créé, on va créer les platesformes , le sol, et les ajouter au groupe groupe_plateformes

    // l'image img_plateforme fait 400x32. On en met 2 à coté pour faire le sol
    // la méthode create permet de créer et d'ajouter automatiquement des objets à un groupe
    // on précise 2 parametres : chaque coordonnées et la texture de l'objet, et "voila!"
    groupe_plateformes.create(200, 584, "img_plateforme");
    groupe_plateformes.create(600, 584, "img_plateforme");




    /****************************
     *  CREATION DU PERSONNAGE  *
     ****************************/

    // On créée un nouveeau personnage : player
    player = this.physics.add.sprite(100, 450, "img_perso");

    //  propriétées physiqyes de l'objet player :
    player.body.setSize(20, 30, 6, 18); // taille du rectangle de collision
    player.body.setOffset(6, 18); // décalage du rectangle de collision
    player.setBounce(0.2); // on donne un petit coefficient de rebond
    player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde
    player.direction = 'right';


    this.play = this.physics.add.staticSprite(420, 490, "img_play");
    this.regle = this.physics.add.staticSprite(420, 550, "img_porte_regle");



    /***************************
     *  CREATION DES ANIMATIONS *
     ****************************/
    // dans cette partie, on crée les animations, à partir des spritesheet
    // chaque animation est une succession de frame à vitesse de défilement défini
    // une animation doit avoir un nom. Quand on voudra la jouer sur un sprite, on utilisera la méthode play()
    // creation de l'animation "anim_tourne_gauche" qui sera jouée sur le player lorsque ce dernier tourne à gauche
    this.anims.create({
      key: "anim_tourne_gauche", // key est le nom de l'animation : doit etre unique poru la scene.
      frames: this.anims.generateFrameNumbers("img_perso", { start: 0, end: 3 }), // on prend toutes les frames de img perso numerotées de 0 à 3
      frameRate: 10, // vitesse de défilement des frames
      repeat: -1 // nombre de répétitions de l'animation. -1 = infini
    });

    // creation de l'animation "anim_tourne_face" qui sera jouée sur le player lorsque ce dernier n'avance pas.
    this.anims.create({
      key: "anim_face",
      frames: [{ key: "img_perso", frame: 4 }],
      frameRate: 20
    });

    // creation de l'animation "anim_tourne_droite" qui sera jouée sur le player lorsque ce dernier tourne à droite
    this.anims.create({
      key: "anim_tourne_droite",
      frames: this.anims.generateFrameNumbers("img_perso", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    /***********************
     *  CREATION DU CLAVIER *
     ************************/
    // ceci permet de creer un clavier et de mapper des touches, connaitre l'état des touches
    clavier = this.input.keyboard.createCursorKeys();

    /*****************************************************
     *  GESTION DES INTERATIONS ENTRE  GROUPES ET ELEMENTS *
     ******************************************************/

    //  Collide the player and the groupe_etoiles with the groupe_plateformes
    this.physics.add.collider(player, groupe_plateformes);
  }

  /***********************************************************************/
  /** FONCTION UPDATE 
/***********************************************************************/

  update() {

    if (clavier.left.isDown) {
      player.direction = 'left';
      player.setVelocityX(-160);
      player.anims.play("anim_tourne_gauche", true);
    } else if (clavier.right.isDown) {
      player.direction = 'right';
      player.setVelocityX(160);
      player.anims.play("anim_tourne_droite", true);
    } else {
      player.setVelocityX(0);
      player.anims.play("anim_face");
    }

    if (clavier.down.isDown) {
      player.setVelocityY(300);
      player.anims.play("anim_face");
    }

    if (clavier.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }


    if (this.physics.overlap(player, this.play)) {

      son_time.stop();
      this.scene.switch("niveau1");
    }

    if (this.physics.overlap(player, this.regle)) {
      son_time.stop();
      this.scene.start("règles");
    }


    // déclenchement de la fonction tirer() si appui sur boutonFeu 
    if (Phaser.Input.Keyboard.JustDown(boutonFeu)) {
      tirer(player);
    }

    if (gameOver) {
      return; // on sort de la fonction update si gameOver est true
    }
  }
}
