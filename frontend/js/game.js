import * as THREE from 'three';
import { isMobileDevice } from "./utils.js";
import { cameraMobile } from "./game/mobile/camera.js";
import { eventListener } from "./game/eventListener.js";
import { movePaddlesComputer } from "./game/computer/paddel-moves.js";
import { handleCollisions } from "./game/collisions.js";
import { updateBallTrail } from "./game/items/ball.js";
import { addBall } from "./game/items/ball.js";
import { addPaddles } from "./game/items/paddel.js";
import { createWall } from "./game/items/wall.js";
import { addLines } from "./game/items/line.js";
import { addBackground } from "./game/items/background.js";
import { addLights } from "./game/items/lights.js";
import { addGround } from "./game/items/ground.js";
import { paddleMovesMobile } from "./game/mobile/paddel-moves.js";
import { fullSizePowerBar, emptySizePowerBar, sizeOfStep } from './utils.js';
import { invisible } from './game/characters/invisible.js';
import { timeLaps } from './game/characters/time-laps.js';
import { superStrength } from './game/characters/superStrenght.js';
import { duplication } from './game/characters/duplication.js';
import { startCountdown } from './game/countdown.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';

export class Game {
    constructor(containerId, modeGame, colorPlayer1, colorPlayer2, colorCourt, heroPowerPlayer1, heroPowerPlayer2, username1, username2, styleMatch, numberPlayers) {
        this.container = document.getElementById(containerId);
        this.containerProgressBarLeft = document.getElementById("progress-bar-left");
        this.containerProgressBarRight = document.getElementById("progress-bar-right");
        this.fullSizePowerBar = fullSizePowerBar();
        this.emptySizePowerBar = emptySizePowerBar();
        this.sizeOfStep = sizeOfStep(this.fullSizePowerBar ,this.emptySizePowerBar);
        this.modeGame = modeGame;
        this.scoreContainer = document.getElementById("board-score");
        this.gamePaused = true;
        this.animationFrameId;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer( {antialias: true });
        this.renderer.shadowMap.enabled = true;
		this.dimensions = this.getGameContainerDimensions();
        this.width = 50;
        this.height = 30;
        this.camera = new THREE.PerspectiveCamera(75, this.dimensions.width / this.dimensions.height, 0.1, 1000);
        this.camera.position.set(0, -23 , 15);
        this.camera.lookAt(0, 0, 0);
        this.camera2;
		this.camera.position.z = 20;
		this.ballVelocity = { x: 0.1, y: 0.02 };
        this.paddleSpeed = 0.2;
        this.wallThickness = 1;
        this.wallHeight = 4;
        this.moveInterval = null;
        this.keys = {};
        this.ballInvisible;
        this.changeCamera = 0;
        this.numberPaddelCollision = 0;
        this.trailParticles = [];
        this.test = 0;
        this.heroPowerPlayer1 = heroPowerPlayer1;
        this.heroPowerPlayer2 = heroPowerPlayer2;
        this.powerPlayer1 = "inactive";
        this.powerPlayer2 = "inactive";
        this.trail;
        this.trailReplica;
        this.directionPower;
        this.originalBallVelocityX = 0;
        this.ballReplica;
        this.ballVelocityReplica = { x: 0.1, y: 0.1 };
        this.username1 = username1;
        this.username2 = username2;
        this.styleMatch = styleMatch;
        this.numberPlayers = numberPlayers;
        this.colorCourt = colorCourt;
        this.colorPlayer1 = colorPlayer1;
        this.init(colorPlayer1, colorPlayer2, colorCourt);
    }

    init(colorPlayer1, colorPlayer2, colorCourt) {
        this.renderer.setSize(this.dimensions.width, this.dimensions.height);
        this.container.appendChild(this.renderer.domElement);
        
        console.log("FULL SIZE POWER BAR: " + this.fullSizePowerBar)

        addGround(this, colorCourt);
        this.leftWall = createWall(this, 0, 31, { x: -25, y: 0, z: -(1 / 2) }, 1);
        this.rightWall = createWall(this, 0, 31, { x: 25, y: 0, z: -(1 / 2) }, 1);
        this.topWall = createWall(this, 50, this.wallThickness, { x: 0, y: 15, z: (this.wallHeight / 2) }, this.wallHeight);
        this.bottomWall = createWall(this, 50, this.wallThickness, { x: 0, y: -15, z: (1 / 2) }, 1);
        addPaddles(this, colorPlayer1, colorPlayer2);
		addLines(this);
		addBall(this);
        addBackground(this);
        addLights(this);

        const self = this;

        const loader = new GLTFLoader();
        loader.load(
            'textures/decors/stadium/scene.gltf', 
            function (gltf) {
                const model = gltf.scene;
                model.position.set(0, 352, 3.9);
                model.scale.set(28, 28, 28);
                model.rotation.y = 0;
                model.rotation.z = 0;
                model.rotation.x = 1.585;
                self.scene.add(model);
        });

        if (isMobileDevice())
            cameraMobile(this);
        else
            document.getElementById("button-controller").style.display = "none";
        eventListener(this);

		startCountdown(this);
    }

	getGameContainerDimensions() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        return { width, height };
    }

    update() {
        if (!this.gamePaused)
        {
            this.fullSizePowerBar = fullSizePowerBar();
            this.emptySizePowerBar = emptySizePowerBar();
            this.sizeOfStep = sizeOfStep(this.fullSizePowerBar ,this.emptySizePowerBar);

            movePaddlesComputer(this);

            paddleMovesMobile(this);

            // Limiter le mouvement des raquettes dans les limites visibles
            if (this.leftPaddle.position.y > ((15 - (this.wallThickness / 2)) - (6 / 2))) {
                this.leftPaddle.position.y = ((15 - (this.wallThickness / 2)) - (6 / 2)); // Ajuster la position
            }
            if (this.leftPaddle.position.y < (-15 + (this.wallThickness / 2) + (6 / 2))) {
                this.leftPaddle.position.y = (-15 + (this.wallThickness / 2) + (6 / 2)); // Ajuster la position
            }
            if (this.rightPaddle.position.y > (15 - (this.wallThickness / 2) - (6 / 2))) {
                this.rightPaddle.position.y = (15 - (this.wallThickness / 2) - (6 / 2)); // Ajuster la position
            }
            if (this.rightPaddle.position.y < (-15 + (this.wallThickness / 2) + (6 / 2))) {
                this.rightPaddle.position.y = (-15 + (this.wallThickness / 2) + (6 / 2)); // Ajuster la position
            }

            // Déplacement de la balle
            this.ball.position.x += this.ballVelocity.x;
            this.ball.position.y += this.ballVelocity.y;

            if (this.ballReplica)
            {
                this.ballReplica.position.x += this.ballVelocityReplica.x;
                this.ballReplica.position.y += this.ballVelocityReplica.y;
            }
        }
        // Gestion des collisions
        handleCollisions(this);
        updateBallTrail(this);

        if ((this.heroPowerPlayer1 === "Time laps" && this.powerPlayer1 === "active") || (this.heroPowerPlayer2 === "Time laps" && this.powerPlayer2 === "active"))
            timeLaps(this);
        else if ((this.heroPowerPlayer1 === "Invisible" && this.powerPlayer1 === "active") || (this.heroPowerPlayer2 === "Invisible" && this.powerPlayer2 === "active"))
            invisible(this, this.directionPower);
        else if (((this.heroPowerPlayer1 === "Super strength" && this.powerPlayer1 === "active") || (this.heroPowerPlayer2 === "Super strength" && this.powerPlayer2 === "active")))
            superStrength(this, this.directionPower);
        else if (((this.heroPowerPlayer1 === "Duplication" && this.powerPlayer1 === "active") || (this.heroPowerPlayer2 === "Duplication" && this.powerPlayer2 === "active")))
            duplication(this, this.directionPower);
        if (this.changeCamera == 5)
        {
            this.renderer.setViewport(0, 0, this.dimensions.width / 2, this.dimensions.height);
            this.renderer.setScissor(0, 0, this.dimensions.width / 2, this.dimensions.height);
            this.renderer.setScissorTest(true);
            this.renderer.render(this.scene, this.camera);

            this.renderer.setViewport(this.dimensions.width / 2, 0, this.dimensions.width / 2, this.dimensions.height);
            this.renderer.setScissor(this.dimensions.width / 2, 0, this.dimensions.width / 2, this.dimensions.height);
            this.renderer.setScissorTest(true);
            this.renderer.render(this.scene, this.camera2);
        }
        else
        {
            this.renderer.setScissorTest(false);
            this.renderer.setViewport(0, 0, this.dimensions.width, this.dimensions.height);
            this.renderer.render(this.scene, this.camera);
        }
    }

    start()
    {
        const animate = () => {
            this.animationFrameId = requestAnimationFrame(animate);
            this.update();
        };
        animate();
    }
}