import * as fct from "/src/js/fonctions.js";
import selection from "/src/js/selection.js";

// Déclaration des variables globales :
var player; // désigne le sprite du joueur
var clavier; // pour la gestion du clavier
var groupe_plateformes; // Groupe d'objets pour les plateformes
var gameOver = false; // Variable pour indiquer si le jeu est terminé ou non
var boutonFeu; // Variable pour la touche de tir
var cursors; // Objet pour la gestion des touches directionnelles
var groupeBullets; // Groupe d'objets pour les balles du joueur
var groupeAgentBullets; // New group for agent bullets
var agents; // New group for agents
var groupeCibles; // Groupe d'objets pour les cibles (boutons)
var bothButtonsPressed = false; // Variable pour savoir si les deux boutons sont activés
var son_niveau1;


export default class niveau1 extends Phaser.Scene {
// Constructeur de la classe niveau1 (hérite de Phaser.Scene)
  constructor() {
    super({
      key: "niveau1" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    this.load.audio("mission", "src/assets/mission.mp3");
    this.load.image("img_bombe", "src/assets/bombe.png"); // Chargement de l'image de la bombe
    cursors = this.input.keyboard.createCursorKeys(); // Création de l'objet pour les touches directionnelles
    boutonFeu = this.input.keyboard.addKey('A'); // Création de l'objet pour la touche 'A' (tir)
    this.load.image("bullet", "src/assets/sombrero.png"); // Chargement de l'image de la balle du joueur
    this.load.image("agentBullet", "src/assets/agentBullet.png"); // Chargement de l'image de la balle des agents
    this.load.image("cible", "src/assets/bouton.png", { frameWidth: 100, frameHeight: 32 }); // Chargement de l'image du bouton non appuyé
    this.load.image("cible_d", "src/assets/cible_d.png"); // Chargement de l'image du bouton droite (non appuyé)
    this.load.image("cible_g", "src/assets/cible_g.png"); // Chargement de l'image du bouton gauche (non appuyé)
    this.load.image("bouton_appuye", "src/assets/bouton_appuyé.png"); // Chargement de l'image du bouton appuyé
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

    

    son_niveau1 = this.sound.add("mission");

    console.log(this.cache.audio.exists("mission")); // Vérifie si le son est bien chargé
    if (this.cache.audio.exists("mission")) {
      son_niveau1.play({ loop: true });
    } else {
      console.error("Le fichier audio ne s'est pas chargé correctement !");
    }


    // ajout d'un texte distintcif  du niveau
    this.add.text(600, 30, "White House", {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt",
      color: "#000000" // Définit la couleur du texte en noir
    });

    this.porte_retour = this.physics.add.staticSprite(100, 550, "img_porte1"); // Ajout de la porte de retour
    this.porte2 = this.physics.add.staticSprite(397, 100, "img_porte2"); // Ajout de la porte pour le niveau 2

    this.player = this.physics.add.sprite(100, 450, "img_perso"); // Ajout du joueur (sprite)
    this.player.body.setSize(20, 30, 6, 18); // taille du rectangle de collision
    this.player.body.setOffset(6, 18); // décalage du rectangle de collision
    this.player.refreshBody(); //Rafraichisement du corp du joueur
    this.player.setBounce(0.1); // Définition du rebond du joueur
    this.player.setCollideWorldBounds(true); // Empêche le joueur de sortir des limites du monde
    this.clavier = this.input.keyboard.createCursorKeys(); // Création de l'objet pour les touches directionnelles
    this.physics.add.collider(this.player, this.groupe_plateformes); // Gestion de la collision entre le joueur et les plateformes
    fct.startCountdown(this); // Lancement du compte à rebours

    groupeBullets = this.physics.add.group(); // Création du groupe pour les balles du joueur
    // Gestion de la destruction des balles lorsqu'elles sortent du monde
    this.physics.world.on("worldbounds", function (body) {
      var objet = body.gameObject; // Récupération de l'objet qui sort du monde
      if (groupeBullets.contains(objet)) { // Si c'est une balle du joueur
        objet.destroy(); // Destruction de la balle
      }
    });
    // Création du groupe des cibles
    groupeCibles = this.physics.add.staticGroup(); // Création d'un groupe statique pour les cibles
    let cible_g = groupeCibles.create(-13, 240, "cible_g"); // Création de la cible gauche (bouton)
    let cible_d = groupeCibles.create(811, 330, "cible_d"); // Création de la cible droite (bouton)
    cible_g.cibleActive = false; // Initialisation de l'état du bouton gauche (non pressé)
    cible_d.cibleActive = false; // Initialisation de l'état du bouton droit (non pressé)
    cible_d.pointsVie = 1; // Initialisation des points de vie du bouton droit = 1
    cible_g.pointsVie = 1; // Initialisation des points de vie du bouton gauche = 1

    // Détection de la collision entre les balles du joueur et les cibles
    this.physics.add.overlap(groupeBullets, groupeCibles, this.hit, null, this); // Ajout d'un overlap et appel de la fonction this.hit si il y a overlap

    this.player.direction = "right"; // Initialisation de la direction du joueur

    // Creation du groupe des agents
    agents = this.physics.add.group();
    let agent2 = agents.create(600, 245, "img_agent_g");
    let agent3 = agents.create(50, 335, "img_agent_d");
    let agent4 = agents.create(700, 425, "img_agent_g");

    // les agents sont statiques et n'ont pas de gravité et peuvent mourir
    agents.children.iterate(function (agent) {
    agent.setImmovable(true); // les agents ne bougent pas
    agent.body.allowGravity = false; // Ales agents ne sont pas affécter par la gravité
    agent.pointsVie = Phaser.Math.Between(3,4); //points de vie des agnets entre 3 et 4 PV
    agent.isDead = false; // Regarder si l'agent est en vie ou mort
    });

    //Collision entre les agents et les plateformes
    this.physics.add.collider(agents, this.groupe_plateformes);

    //nouveau groupe pour les balles des agents
    groupeAgentBullets = this.physics.add.group();

    // Timer du tir des agents 

    this.agentShootingTimers = []; // Création d'un tableau pour stocker les timers des agents.
    agents.children.iterate((agent) => {
      let timer = this.time.addEvent({ // Ajout d'un timer
        delay: Phaser.Math.Between(2000, 4000), // Délai aléatoire entre 2 et 4 secondes
        callback: () => {
          if (!agent.isDead) { // Si l'agent n'est pas mort
            this.agentTir(agent, this.player, groupeAgentBullets); // Appel de la fonction pour faire tirer l'agent
          }
        },
        callbackScope: this, // Périmètre de la fonction
        loop: true // Boucle infini
      });
      this.agentShootingTimers.push(timer); // Ajout du timer dans le tableau
    });

// Gestion de la collision entre les balles des agents et le joueur
    this.physics.add.overlap(this.player, groupeAgentBullets, (player, bullet) => {
      bullet.destroy(); // Destruction de la balle
      fct.killPlayer(this); // Appel de la fonction killPlayer (dans le fichier fonctions.js)
      gameOver = true; // Game over
    }, null, this);

   // Gestion de la collision entre les agents (inutile)
   this.physics.add.collider(agents, agents);

   gameOver = false; // Initialisation de gameOver à false

   // Gestion de la collision entre les balles du joueur et les agents
   this.physics.add.overlap(groupeBullets, agents, this.agentHit, null, this); // Ajout d'un overlap, et appel de la fonction this.agentHit si il y a overlap.
 }

  update() {
    // déclenchement de la fonction tirer() si appui sur boutonFeu
    if (Phaser.Input.Keyboard.JustDown(boutonFeu)) {
      this.tirer(this.player); // Change to this.tirer
    }

    if (this.clavier.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("anim_tourne_gauche", true);
      this.player.direction = "left";

    } else if (this.clavier.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("anim_tourne_droite", true);
      this.player.direction = "right";

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
        son_niveau1.stop();
        this.scene.switch("selection");
      }
      if (this.physics.overlap(this.player, this.porte2)) {
        
          son_niveau1.stop();
          this.scene.switch("niveau2");
        
      }

    }



  }
   // Fonction pour le tir du joueur
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

  agentTir(agent, player, groupeAgentBullets) {
    let coefDir; // Variable pour stocker le coefficient de direction du tir (gauche ou droite)

    // Détermine la direction du tir en fonction de la position du joueur par rapport à l'agent
    if (player.x < agent.x) { // Si la position en X du joueur est inférieure à la position en X de l'agent (le joueur est à gauche)
      coefDir = -1; // Le coefficient de direction est -1 (vers la gauche)
      if (agent.texture.key === "img_agent_d") { // Si l'agent a la texture "img_agent_d" (il regarde à droite)
          agent.setTexture("img_agent_g"); // Change la texture de l'agent en "img_agent_g" (il regarde à gauche)
      }
    } else { // Sinon, le joueur est à droite de l'agent
      coefDir = 1; // Le coefficient de direction est 1 (vers la droite)
      if (agent.texture.key === "img_agent_g") { // Si l'agent a la texture "img_agent_g" (il regarde à gauche)
          agent.setTexture("img_agent_d"); // Change la texture de l'agent en "img_agent_d" (il regarde à droite)
      }
    }

    // Création de la balle à côté de l'agent et on lui donne une vitesse
    let agentBullet = groupeAgentBullets.create(agent.x + (25 * coefDir), agent.y - 4, 'agentBullet'); 
    agentBullet.setCollideWorldBounds(false); // La balle n'est pas limitée par les bords du monde (elle peut sortir de l'écran)
    agentBullet.body.allowGravity = false; // La balle n'est pas affectée par la gravité
    agentBullet.setVelocity(300 * coefDir, 0); // Définit la vitesse de la balle : 300 pixels/seconde dans la direction du coefficient (gauche ou droite)
  }

  // Fonction appelée lorsqu'une balle du joueur touche un agent
  agentHit(bullet, agent) {
      agent.pointsVie--; // Décrémente les points de vie de l'agent
      if (agent.pointsVie <= 0) { // Si les points de vie de l'agent sont inférieurs ou égaux à 0
        agent.isDead = true; // L'agent est marqué comme mort (isDead passe à true)
          agent.destroy(); // Détruit l'agent (le supprime du jeu)
      }
      bullet.destroy(); // Détruit la balle (la supprime du jeu)
  }

  // Fonction appelée lorsqu'une balle du joueur touche une cible (bouton)
  hit(bullet, cible) {
    cible.pointsVie--; // Décrémente les points de vie de la cible

    if (cible.pointsVie <= 0) { // Si les points de vie de la cible sont inférieurs ou égaux à 0
      if (cible.texture.key === "cible_g") { // Si la cible est le bouton gauche
        cible.setTexture("bouton_appuyé"); // Change la texture du bouton en "bouton_appuyé" (bouton appuyé)
        cible.cibleActive = true; // Définit le bouton comme actif (true)
      }
      if (cible.texture.key === "cible_d") { // Si la cible est le bouton droit
        cible.setTexture("bouton_appuyé"); // Change la texture du bouton en "bouton_appuyé" (bouton appuyé)
        cible.cibleActive = true; // Définit le bouton comme actif (true)
      }
      // Vérifie si les deux boutons sont actifs
        if (groupeCibles.getChildren().every(cible => cible.cibleActive)) { // Si tous les enfants de groupeCibles sont actifs
          bothButtonsPressed = true; // Les deux boutons sont considérés comme pressés (bothButtonsPressed passe à true)
        }
    }
    bullet.destroy(); // Détruit la balle (la supprime du jeu)
  }
}

// Fonction pour démarrer le compte à rebours
export function startCountdown(scene) {
  scene.timeLeft = 10 * 60; // 10 minutes en secondes (10 minutes * 60 secondes/minute)
  scene.timerText = scene.add.text(195, 0, "Temps restant: 10:00", { // Ajoute un texte pour le timer
    fontSize: "20px", // Taille de la police
    fill: "#ffffff", // Couleur du texte (blanc)
    fontFamily: "Arial", // Police d'écriture
    backgroundColor: "#000000", //couleur du background
    padding: { x: 10, y: 5 } // Marge intérieure du texte
  }).setOrigin(1, 0); // Place le point d'origine du texte en haut à droite

  // Met le texte en haut à droite de l'écran en suivant la caméra
  scene.timerText.setScrollFactor(0); // Fixe le texte sur l'écran (ne suit pas la caméra)

  console.log("Texte du timer ajouté !"); // Affichage dans la console

  scene.time.addEvent({ // Ajout d'un événement qui se répète toutes les secondes
    delay: 1000, // 1000 ms = 1 seconde
    callback: () => { // Fonction appelée à chaque seconde
      scene.timeLeft--; // Décrémente le temps restant
      let minutes = Math.floor(scene.timeLeft / 60); // Calcule les minutes (partie entière de la division par 60)
      let seconds = scene.timeLeft % 60; // Calcule les secondes (reste de la division par 60)
      scene.timerText.setText(`Temps restant: ${minutes}:${seconds.toString().padStart(2, '0')}`); // Met à jour le texte du timer
      console.log(scene.timeLeft); // Affiche le temps restant dans la console

      if (scene.timeLeft <= 0) { // Si le temps est écoulé (inférieur ou égal à 0)
        killPlayer(scene); // Appel de la fonction "killPlayer" (pour la mort du joueur)
      }
    },
    loop: true // L'événement se répète en boucle
  });
}

// Fonction pour mettre à jour la position du timer en fonction du mouvement de la caméra
export function updateTimerPosition(scene) {
  // Met à jour la position du timer pour qu'il soit toujours en haut à droite de l'écran
  scene.timerText.x = scene.cameras.main.scrollX + scene.cameras.main.width - 160; // Décalage à droite
  scene.timerText.y = scene.cameras.main.scrollY + 20; // Décalage en haut
}

// Fonction appelée lorsqu'un joueur doit mourir
export function killPlayer(scene) {
  console.log("Le joueur est mort !"); // Affichage dans la console
  if (scene.player) { // Vérifie si le joueur existe
    scene.player.setTint(0xff0000); // Met une teinte rouge sur le joueur
    scene.player.setVelocity(0, 0); // Arrête la vitesse du joueur
    scene.player.anims.stop(); // Arrête l'animation du joueur
  }
    // Arrête les timers de tir des agents
  for(let timer of scene.agentShootingTimers) {
        timer.remove(); // Retire chaque timer du tableau 
    }
  scene.physics.pause(); // Met la physique du jeu en pause (pour éviter d'autres collisions)

  scene.time.delayedCall(3000, () => { // Attend 3 secondes (3000 millisecondes) avant de relancer le jeu
    // Logique de réapparition du joueur (respawn)

    if (scene.scene.key === "selection") { // Si la scene actuel est celle de la selection
      scene.scene.restart(); // Redémarre la scène (retour à la scene de selection)
        scene.gameOver = false; // Remet gameOver à false

    } else { //sinon

        scene.scene.start(scene.scene.key); // Redémarre la scène en cours (respawn dans le même niveau)

    }

    scene.physics.resume(); // Relance la physique du jeu
  });
}
