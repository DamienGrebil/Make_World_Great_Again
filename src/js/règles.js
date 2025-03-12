import * as fct from "/src/js/fonctions.js";

var player; // désigne le sprite du joueur
var clavier; // pour la gestion du clavier
var groupe_plateformes; // Groupe d'objets pour les plateformes
var son_regle;

export default class règles extends Phaser.Scene {
    // constructeur de la classe
    constructor() {
        super({
            key: "règles" //  ici on précise le nom de la classe en tant qu'identifiant
        });
    }
    preload() {
        this.load.audio("cotton", "src/assets/cotton.mp3");
        this.load.image("img_regle", "src/assets/règle menu.png");
        this.load.image("img_plateforme", "src/assets/platform.png");
        this.load.spritesheet("img_perso", "src/assets/trump.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
        this.load.image("img_porte1", "src/assets/door1.png");
        this.load.image("img_porte2", "src/assets/door2.png");

    }

    create() {

        // Fond d'écran
        this.add.image(400, 300, "img_regle");

        son_regle = this.sound.add("cotton");

        console.log(this.cache.audio.exists("cotton")); // Vérifie si le son est bien chargé
        if (this.cache.audio.exists("cotton")) {
            son_regle.play({ loop: true });
        } else {
            console.error("Le fichier audio ne s'est pas chargé correctement !");
        }

        // Plateformes
        this.groupe_plateformes = this.physics.add.staticGroup();
        this.groupe_plateformes.create(200, 584, "img_plateforme");
        this.groupe_plateformes.create(600, 584, "img_plateforme");
        // Porte
        this.porte2 = this.physics.add.staticSprite(750, 550, "img_porte2");
        // Joueur
        this.player = this.physics.add.sprite(100, 450, "img_perso");
        this.player.body.setSize(20, 30, 6, 18);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.direction = "right";

        // Collision joueur/plateformes
        this.physics.add.collider(this.player, this.groupe_plateformes);



        // Clavier
        this.clavier = this.input.keyboard.createCursorKeys();

        // Animations du joueur (à créer)
        this.anims.create({
            key: "anim_face",
            frames: [{ key: "img_perso", frame: 0 }],
            frameRate: 10,
        });

        this.anims.create({
            key: "anim_tourne_gauche",
            frames: this.anims.generateFrameNumbers("img_perso", { start: 1, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "anim_tourne_droite",
            frames: this.anims.generateFrameNumbers("img_perso", { start: 4, end: 6 }),
            frameRate: 10,
            repeat: -1,
        });
    }
    update() {
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
            if (this.physics.overlap(this.player, this.porte2)) {
                son_regle.stop();
                this.scene.switch("selection");
            }
        }
    }
}
