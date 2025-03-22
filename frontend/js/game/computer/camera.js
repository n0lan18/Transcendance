import * as THREE from 'three';
import { createWall } from "../items/wall.js";

export function cameraClassicPong(Game)
{
	Game.scene.remove(Game.bottomWall);
	Game.bottomWall = createWall(Game, 50, Game.wallThickness, { x: 0, y: -15, z: (1 / 2) }, 1);
	Game.changeCamera = 0;
	Game.activeCamera = Game.camera;
}

export function thirdPersonCamera(Game)
{
	Game.scene.remove(Game.bottomWall);
	Game.bottomWall = createWall(Game, 50, Game.wallThickness, { x: 0, y: -15, z: (Game.wallHeight / 2) }, Game.wallHeight);
	Game.changeCamera++;
	Game.activeCamera = Game.camera2;
}

export function multiplayerCamera(Game)
{
	Game.changeCamera = 5;
	Game.camera = new THREE.PerspectiveCamera(75, Game.dimensions.width / Game.dimensions.height, 0.1, 1000)
	Game.camera.position.set(Game.leftWall.position.x - 5, Game.leftWall.position.y , 11.8);
	Game.camera.lookAt(Game.leftWall.position.x + 15, Game.leftWall.position.y, -2);
	Game.camera.rotation.z = Math.PI / 0.66666;

	Game.camera2 = new THREE.PerspectiveCamera(75, Game.dimensions.width / Game.dimensions.height, 0.1, 1000)
	Game.camera2.position.set(Game.rightWall.position.x + 5, Game.rightWall.position.y , 11.8);
	Game.camera2.lookAt(Game.rightWall.position.x - 15, Game.rightWall.position.y, -2);
	Game.camera2.rotation.z = Math.PI / -0.66666;
}