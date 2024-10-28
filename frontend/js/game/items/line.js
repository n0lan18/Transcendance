import * as THREE from 'three';

export function addLines(Game)
{
	const createLines = (Game, width, height, position) => {
		const geometry = new THREE.BoxGeometry(width, height, 0);
		const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
		const line = new THREE.Mesh(geometry, material);
		line.position.set(position.x, position.y, 0.04);
		line.receiveShadow = true;
		Game.scene.add(line);
		return line;
	};
	const lineThickness = 0.5;
	const centerLineThickness = 0.7;
	Game.centerLine = createLines(Game, centerLineThickness, 30, { x: 0, y: 0 });
	Game.rightSquare = createLines(Game, lineThickness, 30, { x: 10, y: 0 });
	Game.leftSquare = createLines(Game, lineThickness, 30, { x: -10, y: 0 });
	Game.squareLine = createLines(Game, 20, lineThickness, { x: 0, y: 0 });
}