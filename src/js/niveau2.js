import * as fct from "/src/js/fonctions.js";

var groupe_bombes; // Groupe contenant les bombes présentes dans le niveau
var gameOver = false; // Variable indiquant si la partie est terminée ou non
var groupe_plateformes; // Groupe contenant les plateformes du niveau
var invincible = false; // Variable indiquant si le joueur est invincible (pour le moment toujours false dans le code)
var playerHealth = 1; // Points de vie du joueur, initialisé à 1 (attention il est modifier ensuite, dans le create())
var playerHealthText; // Variable pour le texte affichant les points de vie du joueur (non utilisé dans le code actuel)
var hasInteractedWithCabine = false; // Variable pour savoir si le joueur a interagi avec la cabine (false par default)
var son_niveau2; // Variable pour le son du niveau 2

export default class niveau2 extends Phaser.Scene {
  /**
   * Constructeur de la classe niveau2.
   * Initialise la scène avec la clé "niveau2".
   */
  constructor() {
    super({
      key: "niveau2"
    });
    this.level2Completed = false; // Variable pour savoir si le niveau 2 est complété, initialisé à false (pas utilisé dans le code actuel)
  }

  /**
   * Fonction preload.
   * Charge les assets nécessaires pour le niveau 2.
   */
  preload() {
    this.load.audio("fort", "src/assets/fort.mp3"); // Charge le fichier audio "fort.mp3"
    this.load.image("Phaser_tuile_de_jeu_v0", "src/assets/pixil-frame-0 (3).png"); // Charge l'image pour les tuiles du jeu
    this.load.tilemapTiledJSON("carte", "src/assets/mapNiv2.json"); // Charge la carte du niveau 2 depuis un fichier JSON
    this.load.image("img_porte1", "src/assets/porte1.png"); // Charge l'image de la porte 1
    this.load.image("img_porte2", "src/assets/porte2.png"); // Charge l'image de la porte 2
    this.load.image("img_perso", "src/assets/perso.png"); // Charge l'image du personnage
    this.load.image("img_cabine", "src/assets/cabine.png"); // Charge l'image de la cabine
    this.load.image("img_plateforme_b", "src/assets/platform_b.png"); // Charge l'image d'une plateforme
    this.load.image("bombe", "src/assets/bombe.png"); // Charge l'image d'une bombe
  }

  /**
   * Fonction create.
   * Crée les éléments du niveau 2 (carte, joueur, objets, etc.).
   */
  create() {

    // Ajout du son au gestionnaire de son
    son_niveau2 = this.sound.add("fort");

    console.log(this.cache.audio.exists("fort")); // Vérifie si le son est bien chargé
    if (this.cache.audio.exists("fort")) {
      son_niveau2.play({ loop: true }); // On joue le son, en boucle
    } else {
      console.error("Le fichier audio ne s'est pas chargé correctement !"); //si le fichier n'est pas chargé, on l'affiche en console.
    }
    this.hasInteractedWithCabine = false; // Réinitialise la variable hasInteractedWithCabine à false (le joueur n'a pas encore interagi avec la cabine)
    this.playerHealth = 5; // Initialise la vie du joueur à 5
    groupe_plateformes = this.physics.add.staticGroup(); // Création d'un groupe statique pour les plateformes

    // Ajout de la carte du niveau
    const carteDuNiveau = this.add.tilemap("carte"); // Charge la carte du niveau à partir du fichier JSON
    const tileset = carteDuNiveau.addTilesetImage(
      "tuile_de_jeuv0",
      "Phaser_tuile_de_jeu_v0"
    ); // Ajoute l'image du tileset à la carte
    const calque_background = carteDuNiveau.createLayer(
      "background",
      tileset
    ); // Création du calque background (arrière plan)
    const calque_background_2 = carteDuNiveau.createLayer(
      "background2",
      tileset
    ); // Création du calque background2 (deuxième arrière plan)
    const calque_plateformes = carteDuNiveau.createLayer(
      "plateformes",
      tileset
    ); // Création du calque plateformes (éléments sur lesquels le joueur peut marcher)
    calque_plateformes.setCollisionByProperty({ estSolide: true }); // Définition des collisions sur le calque "plateformes" en fonction de la propriété "estSolide" (définie dans Tiled)

    // Configuration du monde physique et de la caméra
    this.physics.world.setBounds(0, 0, 3200, 640); // Définit les limites du monde (largeur : 3200, hauteur : 640)
    this.cameras.main.setBounds(0, 0, 3200, 640); // Définit les limites de la caméra (largeur : 3200, hauteur : 640)
    this.cabine = this.physics.add.staticSprite(2400, 115, "img_cabine"); // Ajout de la cabine (sprite statique)
    this.porte_retour = this.physics.add.staticSprite(100, 525, "img_porte2"); // Ajout de la porte de retour (sprite statique)
    this.porte3 = this.physics.add.staticSprite(3150, 525, "img_porte3"); // Ajout de la porte 3 (sprite statique)
    //ajout d'un text
    this.add.text(2990, 300, "Appelle le propriétaire du\n bunker pour qu'il vienne\n t'ouvrir ;)", {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "12pt",
      color: "#000000"
    }); // Ajoute un texte dans la scene (avec les instruction)
    this.player = this.physics.add.sprite(100, 450, "img_perso"); // Ajout du joueur (sprite)
    this.player.body.setSize(20, 30, 6, 18); // Définition de la taille du corps du joueur
    this.player.body.setOffset(6, 18); // Définition du décalage du corps du joueur
    this.player.refreshBody(); // Rafraîchit le corps du joueur (mise à jour des propriétés physiques)
    this.player.setBounce(0.2); // Ajout d'un rebond au joueur
    this.player.setCollideWorldBounds(true); // Le joueur ne peut pas sortir des limites du monde
    this.physics.add.collider(this.player, calque_plateformes); // Ajout d'une collision entre le joueur et le calque plateformes
    this.cameras.main.startFollow(this.player); // La caméra suit le joueur
    this.clavier = this.input.keyboard.createCursorKeys(); // Création de l'objet pour les touches directionnelles
    this.groupe_plateformes = this.physics.add.staticGroup(); //initialisation du groupe plateforme (déclarer dans le constructeur)
    this.physics.add.collider(this.player, this.groupe_plateformes) //Ajout d'une collision entre le player et le groupe de platforme
    this.groupe_plateformes.create(2400, 150, "img_plateforme_be"); //ajout d'une platforme (pour la cabine)



    // Création des bombes
    groupe_bombes = this.physics.add.group(); // Création d'un groupe pour les bombes
    this.physics.add.collider(groupe_bombes, calque_plateformes); // Ajout d'une collision entre les bombes et le calque plateformes
    for (let i = 0; i < 20; i++) { // Boucle pour créer 20 bombes
      let x = Phaser.Math.Between(50, 3000); // Position X aléatoire entre 50 et 3000
      let y = Phaser.Math.Between(100, 130); // Position Y aléatoire entre 100 et 130

      let une_bombe = groupe_bombes.create(x, y, "bombe"); // Création d'une bombe (sprite)

      une_bombe.setBounce(Phaser.Math.FloatBetween(1, 1)); // Ajout d'un rebond à la bombe (rebond aléatoire entre 1 et 1)
      une_bombe.setCollideWorldBounds(true); // La bombe ne peut pas sortir des limites du monde

      let vitesseX = Phaser.Math.Between(-200, 200); // Vitesse X aléatoire entre -200 et 200
      let vitesseY = Phaser.Math.Between(100, 130); // Vitesse Y aléatoire entre 100 et 130

      une_bombe.setVelocity(vitesseX, vitesseY); // Application de la vitesse à la bombe
      une_bombe.allowGravity = false; // La gravité n'affecte pas la bombe
    }

    // Ajout d'une collision entre le joueur et les bombes
    this.physics.add.collider(this.player, groupe_bombes, this.chocAvecBombe, null, this);
  }

  /**
   * Fonction update.
   * Gère les mises à jour du niveau 2 (déplacements, interactions, etc.).
   */
  update() {
    // Gestion des déplacements du joueur
    if (this.clavier.left.isDown) { // Si la flèche gauche est pressée
      this.player.setVelocityX(-160); // Déplace le joueur vers la gauche
      this.player.anims.play("anim_tourne_gauche", true); // Joue l'animation de déplacement vers la gauche
    } else if (this.clavier.right.isDown) { // Si la flèche droite est pressée
      this.player.setVelocityX(160); // Déplace le joueur vers la droite
      this.player.anims.play("anim_tourne_droite", true); // Joue l'animation de déplacement vers la droite
    } else { // Si aucune flèche directionnelle n'est pressée
      this.player.setVelocityX(0); // Arrête le joueur
      this.player.anims.play("anim_face"); // Joue l'animation de face (immobile)
    }
    if (this.clavier.up.isDown && this.player.body.blocked.down) { // Si la flèche haut est pressée et que le joueur touche le sol
      this.player.setVelocityY(-325); // Fait sauter le joueur
    }

    if (this.clavier.down.isDown) { // Si la flèche bas est pressée
      this.player.setVelocityY(260); // Déplace le joueur vers le bas
      this.player.anims.play("anim_face"); // Joue l'animation de face (immobile)
    }

    // Gestion des interactions avec les portes/cabines
    if (Phaser.Input.Keyboard.JustDown(this.clavier.space) == true) { // Si la barre espace est pressée (et juste pressée)
      if (this.physics.overlap(this.player, this.porte_retour)) { // Si le joueur chevauche la porte de retour
        son_niveau2.stop();//stop le son du niveau
        console.log("niveau 3 : retour vers selection"); // Affiche dans la console
        this.scene.switch("selection"); // Change de scène vers "selection"
      }
      if (this.physics.overlap(this.player, this.porte3) && hasInteractedWithCabine) { // Si le joueur chevauche la porte 3 et qu'il a interagi avec la cabine
        son_niveau2.stop();//stop le son du niveau
        console.log("niveau 3 : passage au niveau 3"); // Affiche dans la console
        this.scene.switch("niveau3"); // Change de scène vers "niveau3"
      }
      if (this.physics.overlap(this.player, this.cabine)) { // Si le joueur chevauche la cabine
        son_niveau2.stop();//stop le son du niveau
        console.log("mini defi : passage au defi"); // Affiche dans la console
        this.scene.switch("minijeu"); // Change de scène vers "minijeu"
        hasInteractedWithCabine = true; // Met la variable à true (le joueur a interagi avec la cabine)
      }
    }
  }

  /**
   * Fonction chocAvecBombe.
   * Gère la collision entre le joueur et une bombe.
   * @param {Phaser.GameObjects.Sprite} un_player - Le sprite du joueur.
   * @param {Phaser.GameObjects.Sprite} une_bombe - Le sprite de la bombe.
   */
  chocAvecBombe(un_player, une_bombe) {
    if (!invincible) { //si le joueur n'est pas invincible
      playerHealth -= 2; //enleve 2PV au joueur
      //playerHealthText.setText("Player Health: " + playerHealth);//update le texte du player Health
      if (playerHealth <= 0) { //si le player a 0PV ou moins
        this.physics.pause(); //mettre le jeu en pause
        this.player.setTint(0xff0000); //changer la couleur du joueur
        this.player.anims.play("anim_face"); //lancer l'animation du joueur
        gameOver = true; //mettre game over a true
        fct.killPlayer(this);//appeler la fonction kill player qui est dans fonction.js
      }
      une_bombe.destroy();//détruire la bombe
    }
  }
}
