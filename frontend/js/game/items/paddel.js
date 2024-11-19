import * as THREE from 'three';

export function addPaddles(Game, colorPlayer1, colorPlayer2)
{
	const createPaddle = (x, color) => {
		const paddleWidth = 0.5;
		const paddleHeight = 6;
		const paddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, 2);
		const originalColor = new THREE.Color(color);
		const brighterColor = originalColor.clone().multiplyScalar(1.4);
		const darkerColor = originalColor.clone().multiplyScalar(0.5);
		// Création des matériaux pour chaque face
		const materials = [
			new THREE.MeshBasicMaterial({ color: originalColor }),
			new THREE.MeshBasicMaterial({ color: originalColor }),
			new THREE.MeshBasicMaterial({ color: brighterColor}),
			new THREE.MeshBasicMaterial({ color: brighterColor }),
			new THREE.MeshBasicMaterial({ color: darkerColor }),
			new THREE.MeshBasicMaterial({ color: darkerColor })
		];
		const paddle = new THREE.Mesh(paddleGeometry, materials);
		paddle.castShadow = true;
		paddle.position.set(x, 1, 0.5);
		Game.scene.add(paddle);
		return paddle;
	};

	Game.leftPaddle = createPaddle(-23.5, colorPlayer1);
	Game.rightPaddle = createPaddle(23.5, colorPlayer2);
}

export function addPaddlesMini(Game, colorPlayer1, colorPlayer2)
{
	const createPaddle = (x, color) => {
		const paddleWidth = 0.5;
		const paddleHeight = 3;
		const paddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, 2);
		const originalColor = new THREE.Color(color);
		const brighterColor = originalColor.clone().multiplyScalar(1.4);
		const darkerColor = originalColor.clone().multiplyScalar(0.5);
		// Création des matériaux pour chaque face
		const materials = [
			new THREE.MeshBasicMaterial({ color: originalColor }),
			new THREE.MeshBasicMaterial({ color: originalColor }),
			new THREE.MeshBasicMaterial({ color: brighterColor}),
			new THREE.MeshBasicMaterial({ color: brighterColor }),
			new THREE.MeshBasicMaterial({ color: darkerColor }),
			new THREE.MeshBasicMaterial({ color: darkerColor })
		];
		const paddle = new THREE.Mesh(paddleGeometry, materials);
		paddle.castShadow = true;
		paddle.position.set(x, 1, 0.5);
		Game.scene.add(paddle);
		return paddle;
	};

	Game.leftPaddleMini = createPaddle(-10.5, colorPlayer1);
	Game.rightPaddleMini = createPaddle(10.5, colorPlayer2);
}