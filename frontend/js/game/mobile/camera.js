import * as THREE from 'three';

import { createWall } from '../items/wall.js';

export function cameraMobile(Game)
{
	Game.scene.remove(Game.bottomWall);
	Game.bottomWall = createWall(Game, 50, Game.wallThickness, { x: 0, y: -15, z: (Game.wallHeight / 2) }, Game.wallHeight);
	Game.changeCamera++;
	Game.camera = new THREE.PerspectiveCamera(75, Game.dimensions.width / Game.dimensions.height, 0.1, 1000);
	Game.camera.position.set(Game.leftWall.position.x - 5, Game.leftWall.position.y , 11.8);
	Game.camera.lookAt(Game.leftWall.position.x + 15, Game.leftWall.position.y, -2);
	Game.camera.rotation.z = Math.PI / 0.66666;
}