import * as fct from "/src/js/fonctions.js";
import selection from "/src/js/selection.js";
var player; // désigne le sprite du joueur
var clavier; // pour la gestion du clavier
var groupe_plateformes;
var gameOver = false;
var boutonFeu;
var cursors;
var groupeBullets;
var groupeAgentBullets; // New group for agent bullets
var agents; // New group for agents

export default class niveau1 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau1" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    this.load.image("img_bombe", "src/assets/bombe.png");
    cursors = this.input.keyboard.createCursorKeys();
    boutonFeu = this.input.keyboard.addKey('A');
    this.load.image("bullet", "src/assets/balle.png");
    this.load.image("agentBullet", "src/assets/star.png"); // New bullet for agents
    this.load.image("cible", "src/assets/bouton.png", { frameWidth: 100, frameHeight: 32 });
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


    this.groupe_plateformes.create(-13, 240, "cible_g");
    this.groupe_plateformes.create(811, 330, "cible_d");
    
  
  
  



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



    groupeBullets = this.physics.add.group();
    this.physics.world.on("worldbounds", function (body) {
      // on récupère l'objet surveillé
      var objet = body.gameObject;
      // s'il s'agit d'une balle
      if (groupeBullets.contains(objet)) {
        // on le détruit
        objet.destroy();
      }
    });

    // Create agents group
    agents = this.physics.add.group();
    let agent1 = agents.create(100, 245, "img_agent_d");
    let agent2 = agents.create(600, 245, "img_agent_g");
    let agent3 = agents.create(50, 335, "img_agent_d");
    let agent4 = agents.create(700, 425, "img_agent_g");
    
    // Set agents to non-static
    agents.children.iterate(function (agent) {
        agent.setImmovable(false); 
        agent.body.allowGravity = true;
        agent.setCollideWorldBounds(true);
        agent.setVelocityX(Phaser.Math.Between(-50,50));
    });
     //Collision between agents and platforms
    this.physics.add.collider(agents, this.groupe_plateformes);

    // New group for agent bullets
    groupeAgentBullets = this.physics.add.group();

    // Initialize agent shooting timers
    agents.children.iterate((agent) => {
        this.time.addEvent({
            delay: Phaser.Math.Between(1000, 3000), // Random delay between 1 and 3 seconds
            callback: () => {
                if (!gameOver) {
                  agentTir(agent, this.player, groupeAgentBullets);
                }
            },
            callbackScope: this,
            loop: true
        });
    });
        // Collision between agent bullets and player
    this.physics.add.overlap(this.player, groupeAgentBullets, (player, bullet) => {
      bullet.destroy();
      fct.killPlayer(this);
      gameOver=true;


    }, null, this);

    // add a collider between the agents
    this.physics.add.collider(agents, agents);
  }

  update() {
    // déclenchement de la fonction tirer() si appui sur boutonFeu
    if (Phaser.Input.Keyboard.JustDown(boutonFeu)) {
      console.log("Tir déclenché !");
      tirer(player);
    }

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

    if (Phaser.Input.Keyboard.JustDown(boutonFeu)) {
      tirer(player);
    }

    if(gameOver) {
      return; // on sort de la fonction update si gameOver est true
    }
  }
}

function tirer(player) {
  var coefDir;
  if (player.direction == 'left') { coefDir = -1; } else { coefDir = 1 }
  // on crée la balle a coté du joueur
  var bullet = groupeBullets.create(player.x + (25 * coefDir), player.y - 4, 'bullet');
  // parametres physiques de la balle.
  bullet.setCollideWorldBounds(true);
  bullet.body.allowGravity = false;
  bullet.setVelocity(1000 * coefDir, 0); // vitesse en x et en y
}

function agentTir(agent, player, groupeAgentBullets) {
  let coefDir;

  // Determine the direction of the shot based on player position
  if (player.x < agent.x) {
    coefDir = -1; // Player is on the left
    if (agent.texture.key === "img_agent_d") {
        agent.setTexture("img_agent_g");
    }
  } else {
    coefDir = 1; // Player is on the right
    if (agent.texture.key === "img_agent_g") {
        agent.setTexture("img_agent_d");
    }
  }

  // Create bullet near the agent
  let agentBullet = groupeAgentBullets.create(agent.x + (25 * coefDir), agent.y - 4, 'agentBullet');
  agentBullet.setCollideWorldBounds(false);
  agentBullet.body.allowGravity = false;
  agentBullet.setVelocity(300 * coefDir, 0);
}

function hit(bullet, groupeCibles) {
  groupeCibles.pointsVie--;
  if (groupeCibles.pointsVie == 0) {
    groupeCibles.destroy();
  }
  bullet.destroy();
}
export function startCountdown(scene) {
  scene.timeLeft = 10 * 60; // 10 minutes en secondes
  scene.timerText = scene.add.text(195, 0, "Temps restant: 10:00", {
    fontSize: "20px",
    fill: "#ffffff",
    fontFamily: "Arial",
    backgroundColor: "#000000",
    padding: { x: 10, y: 5 }
  }).setOrigin(1, 0);

  // Met le texte en haut à droite de l'écran en suivant la caméra
  scene.timerText.setScrollFactor(0); // Fixe le texte sur l'écran

  console.log("Texte du timer ajouté !");

  scene.time.addEvent({ // Ajout d'un événement qui se répète toutes les secondes
    delay: 1000, // 1000 ms = 1 seconde
    callback: () => {
      scene.timeLeft--;
      let minutes = Math.floor(scene.timeLeft / 60);
      let seconds = scene.timeLeft % 60;
      scene.timerText.setText(`Temps restant: ${minutes}:${seconds.toString().padStart(2, '0')}`);
      console.log(scene.timeLeft);

      if (scene.timeLeft <= 0) {
        killPlayer(scene);
      }
    },
    loop: true
  });
}
export function updateTimerPosition(scene) {
  // Met à jour la position du timer pour qu'il soit toujours en haut à droite de l'écran
  scene.timerText.x = scene.cameras.main.scrollX + scene.cameras.main.width - 160; // Décalage à droite
  scene.timerText.y = scene.cameras.main.scrollY + 20; // Décalage en haut
}
export function killPlayer(scene) {
  console.log("Le joueur est mort !");
  if (scene.player) { // Check if player exists
    scene.player.setTint(0xff0000);
    scene.player.setVelocity(0, 0);
    scene.player.anims.stop();
  }
  scene.physics.pause(); // Pause physics to prevent further collisions

  scene.time.delayedCall(3000, () => {
    // Logic for respawning

    if (scene.scene.key === "selection") {
      scene.scene.restart();
      scene.gameOver = false;
    } else {
      scene.scene.start(scene.scene.key);
    }

    scene.physics.resume();// Resumes the physics simulation
  });
}
