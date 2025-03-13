var boutonFeu; // Variable pour la touche de tir (non initialisée dans ce fichier)
var cursors; // Objet pour la gestion des touches directionnelles (non initialisé dans ce fichier)
var groupeBullets; // Groupe d'objets pour les balles (non initialisé dans ce fichier)
var groupeCibles; // Groupe d'objets pour les cibles (non initialisé dans ce fichier)

/**
 * Fonction tirer.
 * Gère le tir du joueur.
 * Cette fonction n'est pas utilisée dans ce fichier, elle était dans un ancien code,
 * Mais est toujours dans le fichier, par soucis de clartée
 * @param {Phaser.GameObjects.Sprite} player - Le sprite du joueur.
 */
function tirer(player) {
    var coefDir; // Variable pour stocker le coefficient de direction du tir (-1 pour gauche, 1 pour droite)
    if (player.direction == 'left') { // Si le joueur regarde à gauche
        coefDir = -1; // Le coefficient de direction est -1 (vers la gauche)
    } else { // Sinon (le joueur regarde à droite)
        coefDir = 1; // Le coefficient de direction est 1 (vers la droite)
    }
    // Création de la balle à côté du joueur
    var bullet = groupeBullets.create(player.x + (25 * coefDir), player.y - 4, 'bullet');
    // Paramètres physiques de la balle :
    bullet.setCollideWorldBounds(true); // La balle peut entrer en collision avec les limites du monde
    bullet.body.allowGravity = false; // La balle n'est pas affectée par la gravité
    bullet.setVelocity(1000 * coefDir, 0); // Définit la vitesse de la balle (1000 pixels/seconde) dans la direction du coefficient (gauche ou droite), pas de vitesse verticale (0)
}

/**
 * Fonction hit.
 * Gère la collision entre une balle et une cible.
 *  Cette fonction n'est pas utilisée dans ce fichier, elle était dans un ancien code,
 * Mais est toujours dans le fichier, par soucis de clartée
 * @param {Phaser.GameObjects.Sprite} bullet - Le sprite de la balle.
 * @param {Phaser.GameObjects.Sprite} groupeCibles - Le sprite de la cible.
 */
function hit(bullet, groupeCibles) {
    groupeCibles.pointsVie--; // Décrémente les points de vie de la cible
    if (groupeCibles.pointsVie == 0) { // Si les points de vie de la cible sont à 0
        groupeCibles.destroy(); // Détruit la cible
    }
    bullet.destroy(); // Détruit la balle
}

/**
 * Fonction startCountdown.
 * Crée et démarre un compte à rebours (timer) dans la scène.
 * @param {Phaser.Scene} scene - La scène Phaser dans laquelle ajouter le timer.
 */
export function startCountdown(scene) {
    scene.timeLeft = 10 * 60; // Initialise le temps restant à 10 minutes (10 * 60 secondes)
    scene.timerText = scene.add.text(195, 0, "Temps restant: 10:00", { // Création du texte du timer
        fontSize: "20px", // Taille de la police
        fill: "#ffffff", // Couleur du texte (blanc)
        fontFamily: "Arial", // Police d'écriture
        backgroundColor: "#000000", // Couleur de fond
        padding: { x: 10, y: 5 } // Marge intérieure du texte
    }).setOrigin(1, 0); // Positionne le point d'origine du texte en haut à droite

    // Met le texte en haut à droite de l'écran en suivant la caméra
    scene.timerText.setScrollFactor(0); // Fixe le texte sur l'écran (ne suit pas la caméra)

    console.log("Texte du timer ajouté !"); // Affiche un message dans la console

    scene.time.addEvent({ // Ajoute un événement qui se répète toutes les secondes
        delay: 1000, // 1000 ms = 1 seconde
        callback: () => {
            scene.timeLeft--; // Décrémente le temps restant
            let minutes = Math.floor(scene.timeLeft / 60); // Calcule le nombre de minutes (partie entière de la division par 60)
            let seconds = scene.timeLeft % 60; // Calcule le nombre de secondes (reste de la division par 60)
            scene.timerText.setText(`Temps restant: ${minutes}:${seconds.toString().padStart(2, '0')}`); // Met à jour le texte du timer en affichant les minutes et les secondes. `padStart(2, '0')` ajoute un 0 devant les secondes si elles sont < 10.
            console.log(scene.timeLeft); // Affiche le temps restant dans la console

            if (scene.timeLeft <= 0) { // Si le temps est écoulé
                killPlayer(scene); // Appel de la fonction killPlayer pour gérer la mort du joueur
            }
        },
        loop: true // L'événement se répète en boucle
    });
}

/**
 * Fonction updateTimerPosition.
 * Met à jour la position du timer en fonction du mouvement de la caméra.
 * @param {Phaser.Scene} scene - La scène Phaser dans laquelle se trouve le timer.
 */
export function updateTimerPosition(scene) {
    // Met à jour la position du timer pour qu'il soit toujours en haut à droite de l'écran
    scene.timerText.x = scene.cameras.main.scrollX + scene.cameras.main.width - 160; // Calcul de la position horizontale (bord droit de la caméra - décalage)
    scene.timerText.y = scene.cameras.main.scrollY + 20; // Calcul de la position verticale (bord haut de la caméra + décalage)
}

/**
 * Fonction killPlayer.
 * Gère la mort du joueur et son respawn.
 * @param {Phaser.Scene} scene - La scène Phaser dans laquelle se trouve le joueur.
 */
export function killPlayer(scene) {
    console.log("Le joueur est mort !"); // Affiche un message dans la console
    if (scene.player) { // Vérifie si le joueur existe dans la scène
        scene.player.setTint(0xff0000); // Applique une teinte rouge au joueur
        scene.player.setVelocity(0, 0); // Arrête le mouvement du joueur (vitesse à 0)
        scene.player.anims.stop(); // Arrête l'animation du joueur
    }
    scene.physics.pause(); // Met la physique en pause pour éviter d'autres collisions

    scene.time.delayedCall(3000, () => { // Après un délai de 3 secondes (3000 ms)
        // Logique de réapparition (respawn)

        if (scene.scene.key === "selection") { // Si la scène actuelle est celle de "selection"
            scene.scene.restart(); // Redémarre la scène actuelle (retour à la scene de selection)
            scene.gameOver = false; // Réinitialise gameOver à false.

        } else { // Sinon (si on n'est pas sur la scene selection)
            scene.scene.start(scene.scene.key); // Redémarre la scène actuelle (respawn dans le meme niveau)
        }

        scene.physics.resume();// Relance la physique
    });
}
