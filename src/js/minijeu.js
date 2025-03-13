var son_tel; // Variable pour stocker l'objet son du téléphone.

export default class minijeu extends Phaser.Scene {
  /**
   * Constructeur de la classe minijeu.
   * Initialise la scène avec la clé "minijeu".
   */
  constructor() {
    super({
      key: "minijeu" // Clé unique pour identifier cette scène.
    });
  }

  /**
   * Fonction preload.
   * Charge les assets nécessaires pour la scène minijeu.
   */
  preload() {
    this.load.audio("tel", "src/assets/monkey.mp3"); // Charge le fichier audio "monkey.mp3" et lui donne la clé "tel".
    this.load.image("img_num", "src/assets/num.png"); // Charge l'image "num.png" et lui donne la clé "img_num".
    this.load.image("bouton_49.3", "src/assets/49.3.png"); // Charge l'image "49.3.png" et lui donne la clé "bouton_49.3".
  }

  /**
   * Fonction create.
   * Crée les éléments de la scène minijeu (son, image, bouton).
   */
  create() {
    son_tel = this.sound.add("tel"); // Ajoute le son chargé précédemment (avec la clé "tel") au gestionnaire de sons et le stocke dans la variable `son_tel`.

    console.log(this.cache.audio.exists("tel")); // Vérifie si le son "tel" est bien chargé et affiche le résultat dans la console.
    if (this.cache.audio.exists("tel")) { // Si le son est chargé
      son_tel.play({ loop: true }); // Joue le son en boucle.
    } else { // Sinon
      console.error("Le fichier audio ne s'est pas chargé correctement !"); // Affiche une erreur dans la console si le fichier audio ne s'est pas chargé.
    }

    // Ajout d'une image avec la clé "img_num" au centre de la scène (400, 300).
    let image0 = this.add.image(400, 300, "img_num");

    // Création d'un bouton interactif avec l'image "bouton_49.3"
    let playButton = this.add.image(625, 300, "bouton_49.3").setInteractive();

    // Ajoute un écouteur d'événement sur le bouton. Lorsque le bouton est cliqué ("pointerdown"), la fonction fléchée est exécutée.
    playButton.on("pointerdown", () => {
      son_tel.stop(); // Arrête la lecture du son du téléphone.
      console.log("minijeu : retour vers niv2"); // Affiche un message dans la console.
      this.scene.switch("niveau2"); // Change de scène et revient à la scène "niveau2".
    });
  }
}
