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
    this.load.image("img_ciel", "src/assets/sky.png");
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
    this.load.image("img_regles", "src/assets/porte.transparente.png");
    this.load.image("img_porte3", "src/assets/door3.png");
    this.load.image("img_bombe", "src/assets/bombe.png");
    cursors = this.input.keyboard.createCursorKeys();
    boutonFeu = this.input.keyboard.addKey('A');
    this.load.image("bullet", "src/assets/balle.png");
    this.load.image("cible", "src/assets/bouton.png", { frameWidth: 100, frameHeight: 32 });
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

    groupeCibles = this.physics.add.group({
      key: 'cible',
      repeat: 5,
      setXY: { x: 24, y: 0, stepX: 107 }

    });
    this.physics.add.collider(groupeCibles, groupe_plateformes);



    /****************************
     *  CREATION DU PERSONNAGE  *
     ****************************/

    // On créée un nouveeau personnage : player
    player = this.physics.add.sprite(100, 450, "img_perso");

    //  propriétées physiqyes de l'objet player :
    player.setBounce(0.2); // on donne un petit coefficient de rebond
    player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde
    player.direction = 'right';


    this.play = this.physics.add.staticSprite(420, 490, "img_play");
    this.regles = this.physics.add.staticSprite(420, 550, "img_regles");



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

    bombe = this.physics.add.group();
    this.physics.add.collider(bombe, groupe_plateformes);
    var x;
    if (player.x < 400) {
      x = Phaser.Math.Between(400, 800);
    } else {
      x = Phaser.Math.Between(0, 400);
    }

    var une_bombe = bombe.create(x, 16, "img_bombe");
    une_bombe.setBounce(0.8);
    une_bombe.setCollideWorldBounds(true);
    une_bombe.setVelocity(Phaser.Math.Between(-200, 200), 20);
    une_bombe.allowGravity = false;
    this.physics.add.collider(player, bombe, chocAvecBombe, null, this);

    groupeBullets = this.physics.add.group();
    this.physics.add.overlap(groupeBullets, groupeCibles, hit, null, this);
    // modification des cibles créées
    groupeCibles.children.iterate(function (cibleTrouvee) {
      // définition de points de vie
      cibleTrouvee.pointsVie = Phaser.Math.Between(1, 5);;
      // modification de la position en y
      cibleTrouvee.y = Phaser.Math.Between(10, 250);
      // modification du coefficient de rebond
      cibleTrouvee.setBounce(1);
    });
    this.physics.world.on("worldbounds", function (body) {
      // on récupère l'objet surveillé
      var objet = body.gameObject;
      // s'il s'agit d'une balle
      if (groupeBullets.contains(objet)) {
        // on le détruit
        objet.destroy();
      }
    });
  }

  /***********************************************************************/
  /** FONCTION UPDATE 
/***********************************************************************/

  update() {
    // déclenchement de la fonction tirer() si appui sur boutonFeu 
    if (Phaser.Input.Keyboard.JustDown(boutonFeu)) {
      console.log("Tir déclenché !");
      tirer(player);
    }

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

    
      if (this.physics.overlap(player, this.play))
        this.scene.switch("niveau1");
      if (this.physics.overlap(player, this.regles)) {
        console.log("Changement de scène vers règles"); // Debug
        this.scene.start("règles"); // Assurez-vous que la scène "règles" existe
      }
    

    // déclenchement de la fonction tirer() si appui sur boutonFeu 
    if (Phaser.Input.Keyboard.JustDown(boutonFeu)) {
      tirer(player);
    }
  
    if(gameOver) {
      return; // on sort de la fonction update si gameOver est true
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


function tirer(player) { // fonction appelée lorsqu'on appuie sur le bouton de tir
  print("tirer"); // debug
  var coefDir; // coefficient de direction
  if (player.direction == 'left') { coefDir = -1; } else { coefDir = 1 } // si le joueur regarde à gauche, coefDir = -1, sinon coefDir = 1
  var bullet = groupeBullets.create(player.x + (25 * coefDir), player.y - 4, 'bullet');   // on crée la balle a coté du joueur
  // parametres physiques de la balle.
  bullet.setCollideWorldBounds(true);
  bullet.body.allowGravity = false;
  bullet.setVelocity(1000 * coefDir, 0); // vitesse en x et en y
}

function hit(bullet, groupeCibles) { // fonction appelée lorsqu'une balle touche une cible
  groupeCibles.pointsVie--;  // on retire un point de vie à la cible
  if (groupeCibles.pointsVie == 0) { // si la cible n'a plus de points de vie
    groupeCibles.destroy(); // on la détruit
  }
  bullet.destroy(); // on détruit la balle
}
