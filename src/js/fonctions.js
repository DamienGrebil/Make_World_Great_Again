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