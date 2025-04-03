import * as THREE from 'three';
import { isMobileDevice } from "./utils.js";
import { cameraMobile } from "./game/mobile/camera.js";
import { eventListener } from "./game/eventListener.js";
import { movePaddlesComputer } from "./game/computer/paddel-moves.js";
import { handleCollisions } from "./game/collisions.js";
import { updateBallTrail } from "./game/items/ball.js";
import { addBall } from "./game/items/ball.js";
import { addPaddles, addPaddlesMini } from "./game/items/paddel.js";
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
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';
import { cleanupScene } from './game/remove-game.js';
import { GetSocket } from './websocket.js';

export class Game {
    constructor(containerId, modeGame, colorPlayer1, colorPlayer2, colorCourt, heroPowerPlayer1, heroPowerPlayer2, username1, username2, typeOfGame, numberPlayers, superPower, numberMatch, tab, tabNewRound) {
        this.container = null;
        this.superPower = superPower;
        this.containerProgressBarLeft = null;
        this.containerProgressBarRight = null;
        this.fullSizePowerBar = null;
        this.emptySizePowerBar = null;
        this.sizeOfStep = null;
        this.modeGame = modeGame;
        this.scoreContainer = null;
        this.animationFrameId = null;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.shadowMap.enabled = true;
        this.dimensions = { width: 0, height: 0 };
        this.width = 50;
        this.height = 30;
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.activeCamera = this.camera;
        this.camera2 = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.ballVelocity = { x: 0.1, y: 0.02 };
        this.paddleSpeed = 0.2;
        this.wallThickness = 1;
        this.wallHeight = 4;
        this.moveInterval = null;
        this.keys = {};
        this.changeCamera = 0;
        this.numberPaddelCollision = 0;
        this.trailParticles = [];
        this.test = 0;
        this.heroPowerPlayer1 = heroPowerPlayer1;
        this.heroPowerPlayer2 = heroPowerPlayer2;
        this.powerPlayer1 = "inactive";
        this.powerPlayer2 = "inactive";
        this.trail = null;
        this.trailReplica = null;
        this.directionPower = "";
        this.originalBallVelocityX = 0;
        this.ballReplica = null;
        this.ballVelocityReplica = { x: 0.1, y: 0.1 };
        this.username1 = username1;
        this.username2 = username2;
        this.typeOfGame = typeOfGame;
        this.numberPlayers = numberPlayers;
        this.colorCourt = colorCourt;
        this.colorPlayer1 = colorPlayer1;
        this.numberMatch = numberMatch;
        this.tab = tab;
        this.tabNewRound = tabNewRound;
        this.gameState = "paused";
        this.echangeLongueur = 0;
        this.numberGameBreaker = 0;
        this.startMatch = 0;
        this.endMatch = 0;
        this.wbsckt = 0;
        this.init(colorPlayer1, colorPlayer2, colorCourt, superPower, containerId, modeGame, heroPowerPlayer1, heroPowerPlayer2, username1, username2, typeOfGame, numberPlayers, numberMatch, tab, tabNewRound);
    
        this.isplayer1 = sessionStorage.getItem("role") === "player1";

        if (this.modeGame == "Online")
        {
            this.socket = GetSocket();
            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
            
                if (data.type === "update_paddle") {
                    if (data.player === "player1") {
                        this.leftPaddle.position.y = data.position;
                    } else if (data.player === "player2") {
                        this.rightPaddle.position.y = data.position;
                    }
                }

                if (data.type === "broadcast_ball") {
                    this.numberPaddelCollision = data.rally;
                    this.echangeLongueur = data.longest_rally;
                    this.ball.position.x = data.position.x;
                    this.ball.position.y = data.position.y;
                    this.ballVelocity.x = data.velocity.x;
                    this.ballVelocity.y = data.velocity.y;
                    if (data.superpowerleft !== null)
                        this.containerProgressBarLeft.style.width = `${data.superpowerleft}%`;
                    if (data.superpowerright !== null)                        
                        this.containerProgressBarRight.style.width = `${data.superpowerright}%`;
                }

                if (data.type === "broadcast_invisibility")
                {
                    this.ball.visible = data.visibility;
                    if(data.trail == "delete")
                        this.scene.remove(this.trail);
                }

                if (data.type === "broadcast_timelaps")
                {
                    this.ballVelocity.x = data.velocity;
                }

                if (data.type === "broadcast_superstrengh")
                {
                    this.ballVelocity.x = data.velocity.x;
                    this.ballVelocity.y = data.velocity.y;
                }

                if (data.type === "broadcast_duplication")
                {
                    this.ballReplica = this.ball.clone();
                    this.ballReplica.position.copy(this.ball.position);
                    this.scene.add(this.ballReplica);
                    this.ballVelocityReplica = {
                        x: data.velocity.x,
                        y: data.velocity.y
		            };

                }

                if (data.type === "broadcast_disconnection")
                {
                    alert('Votre adversaire a quitté la partie.');
                    window.location.href = '/';
                }
            };
        }
    }

    init(colorPlayer1, colorPlayer2, colorCourt, superPower, containerId, modeGame, heroPowerPlayer1, heroPowerPlayer2, username1, username2, typeOfGame, numberPlayers, numberMatch, tab, tabNewRound) {
        this.container = document.getElementById(containerId);
        this.superPower = superPower;
        this.containerProgressBarLeft = document.getElementById("progress-bar-left");
        this.containerProgressBarRight = document.getElementById("progress-bar-right");
        this.fullSizePowerBar = fullSizePowerBar();
        this.emptySizePowerBar = emptySizePowerBar();
        this.modeGame = modeGame;
        this.scoreContainer = document.getElementById("board-score");
        this.animationFrameId = null;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer( {antialias: true });
        this.renderer.shadowMap.enabled = true;
        this.dimensions = this.getGameContainerDimensions();
        this.width = 50;
        this.height = 30;
        this.camera = new THREE.PerspectiveCamera(75, this.dimensions.width / this.dimensions.height, 0.1, 1000);
        this.camera.position.set(0, -23 , 15);
        this.camera.lookAt(0, 0, 0);
        this.camera.position.z = 20;
        this.activeCamera = this.camera;
        this.ballVelocity = { x: 0.1, y: 0.02 };
        this.paddleSpeed = 0.2;
        this.wallThickness = 1;
        this.wallHeight = 4;
        this.moveInterval = null;
        this.keys = {};
        this.changeCamera = 0;
        this.numberPaddelCollision = 0;
        this.trailParticles = [];
        this.test = 0;
        this.heroPowerPlayer1 = heroPowerPlayer1;
        this.heroPowerPlayer2 = heroPowerPlayer2;
        this.powerPlayer1 = "inactive";
        this.powerPlayer2 = "inactive";
        this.originalBallVelocityX = 0;
        this.ballVelocityReplica = { x: 0.1, y: 0.1 };
        this.username1 = username1;
        this.username2 = username2;
        this.typeOfGame = typeOfGame;
        this.numberPlayers = numberPlayers;
        this.colorCourt = colorCourt;
        this.colorPlayer1 = colorPlayer1;
        this.numberMatch = numberMatch;
        this.tab = tab;
        this.tabNewRound = tabNewRound;
        this.gameState = "paused";
        this.startMatch = new Date();

        this.renderer.setSize(this.dimensions.width, this.dimensions.height);
        this.container.appendChild(this.renderer.domElement);
        this.sizeOfStep = sizeOfStep(this.fullSizePowerBar ,this.emptySizePowerBar);
        addGround(this, colorCourt);
        this.leftWall = createWall(this, 0, 31, { x: -25, y: 0, z: -(1 / 2) }, 1);
        this.rightWall = createWall(this, 0, 31, { x: 25, y: 0, z: -(1 / 2) }, 1);
        this.topWall = createWall(this, 50, this.wallThickness, { x: 0, y: 15, z: (this.wallHeight / 2) }, this.wallHeight);
        this.bottomWall = createWall(this, 50, this.wallThickness, { x: 0, y: -15, z: (1 / 2) }, 1);
        this.camera2 = new THREE.PerspectiveCamera(75, this.dimensions.width / this.dimensions.height, 0.1, 1000);
		this.camera2.position.set(this.leftWall.position.x - 5, this.leftWall.position.y , 11.8);
        this.camera2.lookAt(this.leftWall.position.x + 15, this.leftWall.position.y, -2);
        this.camera2.rotation.z = Math.PI / 0.6666;
        addPaddles(this, colorPlayer1, colorPlayer2);
        if (this.modeGame == "multiPlayerFour")
            addPaddlesMini(this, colorPlayer1, colorPlayer2);
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

                self.cleanupModel = function () {
                    model.traverse(function (node) {
                        if (node.isMesh) {
                            if (node.geometry) {
                                node.geometry.dispose();
                            }
                            if (node.material) {
                                if (Array.isArray(node.material)) {
                                    node.material.forEach(mat => {
                                        if (mat.map) mat.map.dispose();
                                        mat.dispose();
                                    });
                                } else {
                                    if (node.material.map) node.material.map.dispose();
                                    node.material.dispose();
                                }
                            }
                        }
                    });
                    self.scene.remove(model);
                };
        });
        if (isMobileDevice())
            cameraMobile(this);
        else
        {
            document.getElementById("button-controller-right").style.display = "none";
            document.getElementById("button-controller-left").style.display = "none";
        }
        eventListener(this);

		startCountdown(this);
    }

	getGameContainerDimensions() {
        let width = this.container.clientWidth;
        let height = this.container.clientHeight;
        return { width, height };
    }

    update() {
        if (this.gameState == "pause")
        {
            if (this.animationFrameId)
                cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
            if (this.superPower == "isSuperPower")
            {
                this.fullSizePowerBar = fullSizePowerBar();
                this.emptySizePowerBar = emptySizePowerBar();
                this.sizeOfStep = sizeOfStep(this.fullSizePowerBar ,this.emptySizePowerBar);
            }

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
            if (this.modeGame == "multiPlayerFour")
            {
                // Limiter le mouvement des raquettes mini dans les limites visibles
                if (this.leftPaddleMini.position.y > ((15 - (this.wallThickness / 2)) - (3 / 2))) {
                    this.leftPaddleMini.position.y = ((15 - (this.wallThickness / 2)) - (3 / 2)); // Ajuster la position
                }
                if (this.leftPaddleMini.position.y < (-15 + (this.wallThickness / 2) + (3 / 2))) {
                    this.leftPaddleMini.position.y = (-15 + (this.wallThickness / 2) + (3 / 2)); // Ajuster la position
                }
                if (this.rightPaddleMini.position.y > ((15 - (this.wallThickness / 2)) - (3 / 2))) {
                    this.rightPaddleMini.position.y = ((15 - (this.wallThickness / 2)) - (3 / 2)); // Ajuster la position
                }
                if (this.rightPaddleMini.position.y < (-15 + (this.wallThickness / 2) + (3 / 2))) {
                    this.rightPaddleMini.position.y = (-15 + (this.wallThickness / 2) + (3 / 2)); // Ajuster la position
                }
            }

            // Déplacement de la balle
            this.ball.position.x += this.ballVelocity.x;
            this.ball.position.y += this.ballVelocity.y;

            if (this.ballReplica)
            {
                this.ballReplica.position.x += this.ballVelocityReplica.x;
                this.ballReplica.position.y += this.ballVelocityReplica.y;
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
            this.renderer.render(this.scene, this.activeCamera);
        }
    }

    launch() {
        this.gameState = "pause";

        const animate = () => {
            this.animationFrameId = requestAnimationFrame(animate);
            this.update();
            return;
        };

        animate();
    }

    start() {
        if (this.gameState === "running") {
            console.warn("Game is already running!");
            return;
        }
    
        if (this.gameState !== "stopped")
            this.gameState = "running";
    
        const animate = () => {
            if (this.gameState === "stopped") {
                return; // Arrête l'animation si le jeu est mis en pause ou arrêté
            }
            this.animationFrameId = requestAnimationFrame(animate);
            this.update();
        };
    
        animate();
    }

    stop() {
        if (this.gameState === "stopped") {
            console.warn("Game is already stopped!");
            return;
        }
    
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
        this.gameState = "stopped";
    }

    pause() {
        if (this.gameState === "stopped") return ;
        if (this.gameState !== "running") {
            console.warn("Game is not running, cannot pause!");
            return;
        }
    
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
        this.gameState = "paused";
    }

    destroy() {
        // 1. Arrêter les animations
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
        this.gameState = "stopped";

        cleanupScene(this.scene)

        if (this.scene.background && this.scene.background.isCubeTexture) {
            this.scene.background.dispose();
            this.scene.background = null;
        }

        // Nettoyer les lumières
        this.scene.traverse((node) => {
            if (node.isLight && node.shadow && node.shadow.map) {
                node.shadow.map.dispose();
            }
        });

        if (this.cleanupModel) {
            this.cleanupModel();
            this.cleanupModel = null;
        }

        // 5. Supprimer les écouteurs d'événements
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
            this.moveInterval = null;
        }

        // 6. Nettoyer les caméras
        this.camera;
        this.camera2;
        this.activeCamera;

        // 7. Réinitialiser les propriétés liées au jeu
        this.ballVelocity = {};
        this.keys = {};
        this.directionPower = "";
        this.ballReplica = null;
        this.dimensions = { width: 0, height: 0 };

        // 8. Supprimer les références du DOM
        if (this.containerProgressBarLeft)
            this.containerProgressBarLeft.remove();
        if (this.containerProgressBarRight)
            this.containerProgressBarRight.remove();
        if (this.scoreContainer)
            this.scoreContainer.remove();
    }
}