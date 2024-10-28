import * as THREE from 'three';

export function addLights(Game) {
	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(0, -15, 50);
	directionalLight.castShadow = true;
	directionalLight.castShadow = true; // La lumière doit générer des ombrages
	directionalLight.shadow.camera.near = 0.1; // Distance minimale de la caméra d'ombrage
	directionalLight.shadow.camera.far = 100; // Distance maximale de la caméra d'ombrage
	directionalLight.shadow.camera.left = -50; // Dimensions de la caméra d'ombrage
	directionalLight.shadow.camera.right = 50;
	directionalLight.shadow.camera.top = 50;
	directionalLight.shadow.camera.bottom = -50;

	// Ajuster la résolution de la carte d'ombre (permet d'obtenir des ombrages plus nets)
	directionalLight.shadow.mapSize.width = 1024;
	directionalLight.shadow.mapSize.height = 1024;
	Game.scene.add(directionalLight);
}