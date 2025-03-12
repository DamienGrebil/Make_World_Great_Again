var son_tel;

export default class minijeu extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "minijeu" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    this.load.audio("tel", "src/assets/monkey.mp3");
    this.load.image("img_num", "src/assets/num.png");
    this.load.image("bouton_49.3", "src/assets/49.3.png");
}

  create() {
    son_tel = this.sound.add("tel");

    console.log(this.cache.audio.exists("tel")); // Vérifie si le son est bien chargé
    if (this.cache.audio.exists("time")) {
      son_tel.play({ loop: true });
    } else {
      console.error("Le fichier audio ne s'est pas chargé correctement !");
    }
    let image0 = this.add.image(400, 300, "img_num");
    

let playButton = this.add.image(625, 300, "bouton_49.3").setInteractive();
    playButton.on("pointerdown", () => {
      son_tel.stop();
      console.log("minijeu : retour vers niv2");
      this.scene.switch("niveau2");
    });

  }
}
