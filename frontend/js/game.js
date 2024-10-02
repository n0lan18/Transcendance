

export class Game {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
		this.dimensions = this.getGameContainerDimensions();
        this.camera = new THREE.PerspectiveCamera(75, this.dimensions.width / this.dimensions.height, 0.1, 1000);
		this.camera.position.z = 20;

		this.ballVelocity = { x: 0.1, y: 0.1 };
        this.paddleSpeed = 0.2;
        this.keys = {};

        this.init();
    }

    init() {
        this.renderer.setSize(this.dimensions.width, this.dimensions.height);
        this.container.appendChild(this.renderer.domElement);

		console.log("kk width" + this.dimensions.width);
		console.log("kk height" + this.dimensions.height);
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

		this.start();
    }

	getGameContainerDimensions() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        return { width, height };
    }

	getGameObjectDimensions() {
		const scaleFactor = 18;
        const width = this.container.clientWidth / scaleFactor;
        const height = this.container.clientHeight / scaleFactor;
        return { width, height };
    }

    addWalls() {
        const createWall = (width, height, position) => {
            const geometry = new THREE.BoxGeometry(width, height, 1);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const wall = new THREE.Mesh(geometry, material);
            wall.position.set(position.x, position.y, 0.5);
            this.scene.add(wall);
            return wall;
        };
		const wallThickness = 0.3;
        this.leftWall = createWall(wallThickness, 45, { x: -25, y: 0 });
        this.rightWall = createWall(wallThickness, 45, { x: 25, y: 0 });
        this.topWall = createWall(45, wallThickness, { x: 0, y: 15 });
        this.bottomWall = createWall(45, wallThickness, { x: 0, y: -15 });
    }

    addPaddles() {
        const createPaddle = (x) => {
			const paddleWidth = 0.5;
			const paddleHeight = 6;
            const paddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, 0.5);
            const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
            const paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
            paddle.position.set(x, 0, 0.5);
            this.scene.add(paddle);
            return paddle;
        };

        this.leftPaddle = createPaddle(-23.5);
        this.rightPaddle = createPaddle(23.5);
    }

	addLines() {
		const createLines = (width, height, position) => {
            const geometry = new THREE.BoxGeometry(width, height, 0);
            const material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
            const line = new THREE.Mesh(geometry, material);
            line.position.set(position.x, position.y, 0);
            this.scene.add(line);
            return line;
        };
		const wallThickness = 0.3;
        this.centerLine = createLines(wallThickness, 30, { x: 0, y: 0 });
		this.rightSquare = createLines(wallThickness, 30, { x: 10, y: 0 });
		this.leftSquare = createLines(wallThickness, 30, { x: -10, y: 0 });
		this.squareLine = createLines(20, wallThickness, { x: 0, y: 0 });
	}

    addBall() {
		const ballRadius = 1;
        const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
        const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
        this.ball.position.set(0, 0, 0.5);
        this.scene.add(this.ball);
    }

    update() {
        // Déplacement des raquettes
        if (this.keys['w']) this.leftPaddle.position.y += this.paddleSpeed; // Up
        if (this.keys['s']) this.leftPaddle.position.y -= this.paddleSpeed; // Down
        if (this.keys['ArrowUp']) this.rightPaddle.position.y += this.paddleSpeed; // Up
        if (this.keys['ArrowDown']) this.rightPaddle.position.y -= this.paddleSpeed; // Down

    	// Limiter le mouvement des raquettes dans les limites visibles
    	if (this.leftPaddle.position.y > 15) {
    	    this.leftPaddle.position.y = 15; // Ajuster la position
    	}
    	if (this.leftPaddle.position.y < -15) {
    	    this.leftPaddle.position.y = -15; // Ajuster la position
    	}
    	if (this.rightPaddle.position.y > 15) {
    	    this.rightPaddle.position.y = 15; // Ajuster la position
    	}
    	if (this.rightPaddle.position.y < -15) {
    	    this.rightPaddle.position.y = -15; // Ajuster la position
    	}

        // Déplacement de la balle
        this.ball.position.x += this.ballVelocity.x;
        this.ball.position.y += this.ballVelocity.y;

        // Gestion des collisions
        this.handleCollisions();
        this.renderer.render(this.scene, this.camera);
    }

    handleCollisions() {
        if (this.ball.position.y > 15 || this.ball.position.y < -15) {
            this.ballVelocity.y = -this.ballVelocity.y;
        }

    	// Vérification de la collision avec la raquette gauche
    	if (this.ball.position.x < this.leftPaddle.position.x + 0.5 &&
    	    this.ball.position.x > this.leftPaddle.position.x - 0.5 &&
    	    this.ball.position.y < this.leftPaddle.position.y + 1.5 &&
    	    this.ball.position.y > this.leftPaddle.position.y - 1.5) {
    	    this.ballVelocity.x = -this.ballVelocity.x; // Inverser la direction x de la balle
    	}

		// Vérification de la collision avec la raquette droite
		if (this.ball.position.x < this.rightPaddle.position.x + 0.5 &&
			this.ball.position.x > this.rightPaddle.position.x - 0.5 &&
			this.ball.position.y < this.rightPaddle.position.x + 1.5 &&
			this.ball.position.y > this.rightPaddle.position.x - 1.5) {
			this.ballVelocity.x = -this.ballVelocity.x; // Inverser la direction x de la balle
		}

		// Réinitialisation si la balle sort des limites latérales
		if (this.ball.position.x > 25 || this.ball.position.x < -25) {
			this.ball.position.set(0, 0, 0); // Réinitialiser la position de la balle au centre
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