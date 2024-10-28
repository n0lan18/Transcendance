import * as THREE from 'three';

export function createWall(Game, width, height, position, wallHeight) {
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
	wall.castShadow = true;
	wall.receiveShadow = true;
	wall.position.set(position.x, position.y, position.z);
	Game.scene.add(wall);
	return wall;
}