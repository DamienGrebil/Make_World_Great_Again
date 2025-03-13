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


/**
 * Fonction updateTimerPosition.
 * Met à jour la position du timer en fonction du mouvement de la caméra.
 * @param {Phaser.Scene} scene - La scène Phaser dans laquelle se trouve le timer.
 */
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
