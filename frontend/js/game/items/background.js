import * as THREE from 'three';

export function addBackground(Game) {
	const loader = new THREE.CubeTextureLoader();
	const texture = loader.load([
		'textures/sky/yonder_bk.jpg', //ok
		'textures/sky/yonder_ft.jpg', //ok
		'textures/sky/yonder_lf.jpg', //ok
		'textures/sky/yonder_rt.jpg', 
		'textures/sky/yonder_up.jpg', //ok
		'textures/sky/yonder_dn.jpg' //ok
	]);
	Game.scene.background = texture;
}