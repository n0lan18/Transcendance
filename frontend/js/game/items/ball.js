import * as THREE from 'three';
import { isMobileDevice } from '../../utils.js';

export function addBall(Game) {
	const ballRadius = 1;
	const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
	const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffd000 });
	Game.ball = new THREE.Mesh(ballGeometry, ballMaterial);
	Game.ball.position.set(0, 1, 1);
	Game.ball.castShadow = true;
	createBallTrail(Game);
	Game.scene.add(Game.ball);
}

export function updateBallTrail(Game) {
	createBallTrail(Game);
		// Parcourir chaque particule et diminuer son opacité et sa taille
		for (let i = 0; i < Game.trailParticles.length; i++) {
			const particle = Game.trailParticles[i];

			// Réduire l'opacité progressivement
			particle.material.opacity -= 0.02;

			// Réduire la taille de la particule
				particle.scale.set(particle.scale.x * 0.9, particle.scale.y * 0.9, particle.scale.z * 0.9);

			// Si la particule est presque transparente, la supprimer
			if (particle.material.opacity <= 0) {
				Game.scene.remove(particle);
				Game.trailParticles.splice(i, 1);
				i--; // Ajuster l'indice après suppression
			}
		}
}

export function createBallTrail(Game) {
	const trailRadius = 0.9;
	const trailGeometry = new THREE.SphereGeometry(trailRadius, 16, 16);
	const trailMaterial = new THREE.MeshBasicMaterial({ color: 0xffd000, transparent: true, opacity: 0.6 });
	Game.trail = new THREE.Mesh(trailGeometry, trailMaterial);

	Game.trail.position.copy(Game.ball.position);
	Game.scene.add(Game.trail);
	Game.trailParticles.push(Game.trail);

	if (Game.ballReplica)
	{
		Game.trailReplica = Game.trail.clone();
		Game.trailReplica.position.copy(Game.ballReplica.position);
		Game.scene.add(Game.trailReplica);
		Game.trailParticles.push(Game.trailReplica);
	}
}