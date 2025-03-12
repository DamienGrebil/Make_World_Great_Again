export default class minijeu extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "minijeu" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    this.load.image("img_num", "src/assets/num.png");
    this.load.image("bouton_49.3", "src/assets/49.3.png");
}

  create() {
    let image0 = this.add.image(800, 640, "img_num");
    // ajout d'un texte distintcif  du niveau
    this.add.text(400, 100, "Ouvrez la porte du Bunker", {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt"
    });

let playButton = this.add.image(550, 320, "bouton_49.3").setInteractive();
    playButton.on("pointerdown", () => {
      console.log("minijeu : retour vers niv2");
      this.scene.switch("niveau2");
    });

  }
}
