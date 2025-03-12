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
    let image0 = this.add.image(400, 300, "img_num");
    

let playButton = this.add.image(625, 300, "bouton_49.3").setInteractive();
    playButton.on("pointerdown", () => {
      console.log("minijeu : retour vers niv2");
      this.scene.switch("niveau2");
    });

  }
}
