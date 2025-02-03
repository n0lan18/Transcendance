import * as THREE from 'three';
import { createWall } from '../items/wall.js';

export function cameraMobile(Game)
{
	Game.scene.remove(Game.topWall);
	Game.topWall = createWall(Game, 50, Game.wallThickness, { x: 0, y: 15, z: (1 / 2) }, 1);
	Game.camera = new THREE.PerspectiveCamera(75, Game.dimensions.width / Game.dimensions.height, 0.1, 1000);
	Game.camera.position.set(0, 0 , 50);
	Game.camera.lookAt(0, 0, 0);
	Game.camera.position.z = 23;
	Game.activeCamera = Game.camera;
}