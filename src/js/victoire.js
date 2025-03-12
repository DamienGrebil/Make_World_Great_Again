import * as fct from "/src/js/fonctions.js";

var player; // désigne le sprite du joueur
var clavier; // pour la gestion du clavier
var groupe_plateformes; // Groupe d'objets pour les plateformes

export default class victoire extends Phaser.Scene {
    // constructeur de la classe
    constructor() {
        super({
            key: "victoire" //  ici on précise le nom de la classe en tant qu'identifiant
        });
    }
    preload() {
        this.load.image("img_victoire", "src/assets/VICTOIRE.png");
        

    }

    create() {

        // Fond d'écran
        this.add.image(400, 300, "img_victoire");

      
    }
    update() {
        
    }
}
