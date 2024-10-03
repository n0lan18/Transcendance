

export class Game {
    constructor(containerId, modeGame) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
		this.dimensions = this.getGameContainerDimensions();
        this.width = 50;
        this.height = 30;
        this.camera = new THREE.OrthographicCamera(-this.width / 2, this.width / 2, this.height / 2, -this.height / 2, 1, 1000);
        this.camera2;
		this.camera.position.z = 20;
		this.ballVelocity = { x: 0.1, y: 0.1 };
        this.paddleSpeed = 0.2;
        this.keys = {};
        this.changeCamera = 0;

        this.init(modeGame);
    }

    init(modeGame) {
        this.renderer.setSize(this.dimensions.width, this.dimensions.height);
        this.container.appendChild(this.renderer.domElement);

		console.log("kk width" + this.dimensions.width);
		console.log("kk height" + this.dimensions.height);
        this.addGround();
        this.addWalls();
        this.addPaddles();
		this.addLines();
		this.addBall();

        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });
        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
        window.addEventListener('keypress', (event) => {
            if (event.key === 'v')
            {
                if (this.changeCamera === 0)
                {
                    if (modeGame === "soloPlayer")
                    {
                        this.changeCamera++;
                        this.camera = new THREE.PerspectiveCamera(75, this.dimensions.width / this.dimensions.height, 0.1, 1000);
                        this.camera.position.set(this.leftWall.position.x - 5, this.leftWall.position.y , 11.8);
                        this.camera.lookAt(this.leftWall.position.x + 15, this.leftWall.position.y, -2);
                        this.camera.rotation.z = Math.PI / 0.66666;
                    }
                    else if (modeGame === "multiplayerGame")
                    {
                        console.log("qqq");
                        this.changeCamera = 5;
                        this.camera = new THREE.PerspectiveCamera(75, this.dimensions.width / this.dimensions.height, 0.1, 1000)
                        this.camera.position.set(this.leftWall.position.x - 5, this.leftWall.position.y , 11.8);
                        this.camera.lookAt(this.leftWall.position.x + 15, this.leftWall.position.y, -2);
                        this.camera.rotation.z = Math.PI / 0.66666;

                        this.camera2 = new THREE.PerspectiveCamera(75, this.dimensions.width / this.dimensions.height, 0.1, 1000)
                        this.camera2.position.set(this.rightWall.position.x + 5, this.rightWall.position.y , 11.8);
                        this.camera2.lookAt(this.rightWall.position.x - 15, this.rightWall.position.y, -2);
                        this.camera2.rotation.z = Math.PI / -0.66666;
                    }
                }
                else if (this.changeCamera === 1)
                {                
                    this.changeCamera++;
                    this.camera = new THREE.PerspectiveCamera(75, this.dimensions.width / this.dimensions.height, 0.1, 1000);
                    this.camera.position.set(-35, -17, 15);
                    this.camera.lookAt(0, 0, 0);
                    this.camera.rotation.z = Math.PI / 0.55;
                }
                else
                {
                    this.changeCamera = 0;
                    this.camera = new THREE.OrthographicCamera(-this.width / 2, this.width / 2, this.height / 2, -this.height / 2, 1, 1000);
                    this.camera.position.z = 20;
                }
            }
        });

		this.start();
    }

	getGameContainerDimensions() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        return { width, height };
    }

    addGround() {
        const geometry = new THREE.PlaneGeometry(this.width, this.height);
        const material = new THREE.MeshBasicMaterial({ color: 0xff6600 });
        const ground = new THREE.Mesh(geometry, material);
        ground.position.y = 0;
        this.scene.add(ground);
    }

    addWalls() {
        const createWall = (width, height, position, wallHeight) => {
            const geometry = new THREE.BoxGeometry(width, height, wallHeight);
            const materials = [
                new THREE.MeshBasicMaterial({ color: 0xc4bb66 }), // Rouge
                new THREE.MeshBasicMaterial({ color: 0xc4bb66 }), // Rouge
                new THREE.MeshBasicMaterial({ color: 0x4263c5 }), // Bleu
                new THREE.MeshBasicMaterial({ color: 0x4263c5 }), // Bleu
                new THREE.MeshBasicMaterial({ color: 0x6ec466 }), // Vert
                new THREE.MeshBasicMaterial({ color: 0x6ec466 })  // Vert
            ];
            const wall = new THREE.Mesh(geometry, materials);
            wall.position.set(position.x, position.y, position.z);
            this.scene.add(wall);
            return wall;
        };
		const wallThickness = 1;
        const wallHeight = 4;
        this.leftWall = createWall(0, 31, { x: -25, y: 0, z: -(1 / 2) }, 1);
        this.rightWall = createWall(0, 31, { x: 25, y: 0, z: -(1 / 2) }, 1);
        this.topWall = createWall(50, wallThickness, { x: 0, y: 15, z: (wallHeight / 2) }, wallHeight);
        this.bottomWall = createWall(50, wallThickness, { x: 0, y: -15, z: (wallHeight / 2) }, wallHeight);
    }

    addPaddles() {
        const createPaddle = (x) => {
			const paddleWidth = 0.5;
			const paddleHeight = 6;
            const paddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, 2);
            // Création des matériaux pour chaque face
            const materials = [
                new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Rouge
                new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Rouge
                new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Bleu
                new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Bleu
                new THREE.MeshBasicMaterial({ color: 0xff00ff }), // Magenta
                new THREE.MeshBasicMaterial({ color: 0xff00ff })  // Magenta
            ];
            const paddle = new THREE.Mesh(paddleGeometry, materials);
            paddle.position.set(x, 1, 0.5);
            this.scene.add(paddle);
            return paddle;
        };

        this.leftPaddle = createPaddle(-23.5);
        this.rightPaddle = createPaddle(23.5);
    }

	addLines() {
		const createLines = (width, height, position) => {
            const geometry = new THREE.BoxGeometry(width, height, 0);
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const line = new THREE.Mesh(geometry, material);
            line.position.set(position.x, position.y, 0);
            this.scene.add(line);
            return line;
        };
		const lineThickness = 0.5;
        const centerLineThickness = 0.7
        this.centerLine = createLines(centerLineThickness, 30, { x: 0, y: 0 });
		this.rightSquare = createLines(lineThickness, 30, { x: 10, y: 0 });
		this.leftSquare = createLines(lineThickness, 30, { x: -10, y: 0 });
		this.squareLine = createLines(20, lineThickness, { x: 0, y: 0 });
	}

    addBall() {
		const ballRadius = 1;
        const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
        const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffd000 });
        this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
        this.ball.position.set(0, 1, 1);
        this.scene.add(this.ball);
    }

    update(modeGame) {
        // Déplacement des raquettes
        if (this.keys['w'] && this.changeCamera == 0) this.leftPaddle.position.y += this.paddleSpeed; // Up
        if (this.keys['a'] && this.changeCamera > 0) this.leftPaddle.position.y += this.paddleSpeed; //left
        if (this.keys['s'] && this.changeCamera == 0) this.leftPaddle.position.y -= this.paddleSpeed; // Down
        if (this.keys['d'] && this.changeCamera > 0) this.leftPaddle.position.y -= this.paddleSpeed; // right
        if (this.keys['ArrowUp'] && this.changeCamera == 0) this.rightPaddle.position.y += this.paddleSpeed; // Up
        if (this.keys['ArrowLeft'] && this.changeCamera > 0) this.rightPaddle.position.y -= this.paddleSpeed; // Left
        if (this.keys['ArrowRight'] && this.changeCamera > 0) this.rightPaddle.position.y += this.paddleSpeed; // Right
        if (this.keys['ArrowDown'] && this.changeCamera == 0) this.rightPaddle.position.y -= this.paddleSpeed; // Down

    	// Limiter le mouvement des raquettes dans les limites visibles
    	if (this.leftPaddle.position.y > (15 - (6 / 2))) {
    	    this.leftPaddle.position.y = (15 - (6 / 2)); // Ajuster la position
    	}
    	if (this.leftPaddle.position.y < (-15 + (6 / 2))) {
    	    this.leftPaddle.position.y = (-15 + (6 / 2)); // Ajuster la position
    	}
    	if (this.rightPaddle.position.y > (15 - (6 / 2))) {
    	    this.rightPaddle.position.y = (15 - (6 / 2)); // Ajuster la position
    	}
    	if (this.rightPaddle.position.y < (-15 + (6 / 2))) {
    	    this.rightPaddle.position.y = (-15 + (6 / 2)); // Ajuster la position
    	}

        // Déplacement de la balle
        this.ball.position.x += this.ballVelocity.x;
        this.ball.position.y += this.ballVelocity.y;

        // Gestion des collisions
        this.handleCollisions();
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

    handleCollisions() {
        if (this.ball.position.y > 13.5 || this.ball.position.y < -13.5) {
            this.ballVelocity.y = -this.ballVelocity.y;
        }

    	// Vérification de la collision avec la raquette gauche
    	if (this.ball.position.x - 1 < this.leftPaddle.position.x + 0.25 &&
    	    this.ball.position.x + 1 > this.leftPaddle.position.x - 0.25 &&
    	    this.ball.position.y < this.leftPaddle.position.y + 3 &&
    	    this.ball.position.y > this.leftPaddle.position.y - 3)
        {
    	    this.ballVelocity.x = -this.ballVelocity.x; // Inverser la direction x de la balle
    	}

		// Vérification de la collision avec la raquette droite
		if (this.ball.position.x - 1 < this.rightPaddle.position.x + 0.25 &&
			this.ball.position.x + 1 > this.rightPaddle.position.x - 0.25 &&
			this.ball.position.y < this.rightPaddle.position.y + 3 &&
			this.ball.position.y > this.rightPaddle.position.y - 3)
        {
			this.ballVelocity.x = -this.ballVelocity.x; // Inverser la direction x de la balle
		}

		// Réinitialisation si la balle sort des limites latérales
		if (this.ball.position.x > 25 || this.ball.position.x < -25) {
			this.ball.position.set(0, 1, 1); // Réinitialiser la position de la balle au centre
		}
    }

    start() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.update();
        };
        animate();
    }
}