var boutonFeu;
var cursors;
var groupeBullets;
var groupeCibles;






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
        
        if (scene.scene.key === "selection"){
            scene.scene.restart();
            scene.gameOver = false;
        }else{
            scene.scene.start(scene.scene.key);
        }
        
        scene.physics.resume();// Resumes the physics simulation
    });
}

