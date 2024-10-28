import * as THREE from 'three';

export function addGround(Game, color)
{
        const geometry = new THREE.PlaneGeometry(Game.width, Game.height);
        const material = new THREE.MeshStandardMaterial({ color: color });
        const ground = new THREE.Mesh(geometry, material);
        ground.position.y = 0;
        ground.receiveShadow = true;
        Game.scene.add(ground);
}