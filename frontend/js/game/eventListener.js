import * as THREE from 'three';
import { cameraClassicPong, thirdPersonCamera, multiplayerCamera } from "./computer/camera.js";
import { sizeOfAdvance } from '../utils.js';

export function eventListener(Game)
{
	orientationChange(Game);
	resizeWindow(Game);
	pauseGame(Game);
	specialShotSmartphone(Game);
	pauseButtonSmartphone(Game);
	cameraChangement(Game);
	specialShotComputerPlayer1(Game);
}

function orientationChange(Game)
{
	window.addEventListener('orientationchange', () => {
		Game.dimensions = Game.getGameContainerDimensions();
		Game.renderer.setSize(Game.dimensions.width, Game.dimensions.height);
		Game.camera.aspect = Game.dimensions.width / Game.dimensions.height;
		Game.camera.updateProjectionMatrix();
	});
}

function resizeWindow(Game)
{
	let isResizing = false;
	window.addEventListener('resize', () => {
		Game.dimensions = Game.getGameContainerDimensions();
		if (!isResizing) {
			Game.gamePaused = true; // Mettre le jeu en pause
			cancelAnimationFrame(Game.animationFrameId); // Annuler l'animation en cours
		}
		isResizing = true;
		clearTimeout(Game.resizeTimeout);
		Game.resizeTimeout = setTimeout(() => {
			Game.dimensions = Game.getGameContainerDimensions();
			Game.camera.aspect = Game.dimensions.width / Game.dimensions.height;
			Game.camera.updateProjectionMatrix();
			Game.renderer.setSize(Game.dimensions.width, Game.dimensions.height);
			const newHeight = Game.dimensions.width / (16 / 9);
			if (Game.dimensions.width < 768)
				Game.container.style.height = `250px`;
			else if (Game.dimensions.width <= 1024)
				Game.container.style.height = `500px`;
			else
				Game.container.style.height = `${newHeight}px`;
			Game.gamePaused = false;
			Game.start();
			isResizing = false;
		}, 100);
	});
}

function pauseGame(Game)
{
	window.addEventListener('keydown', (event) => {
		if (event.key === 'Escape')
		{
			Game.gamePaused = !Game.gamePaused;
			if (Game.gamePaused)
				cancelAnimationFrame(Game.animationFrameId);
			else
				Game.start();
		}
		else
			Game.keys[event.key] = true;
	});
	window.addEventListener('keyup', (event) => {
		Game.keys[event.key] = false;
	});
}

function specialShotSmartphone(Game)
{
	window.addEventListener('touchstart', (event) => {
		if (event.target.id === "special-shot-button")
		{
			if (sizeOfAdvance(Game.fullSizePowerBar, parseInt(window.getComputedStyle(Game.containerProgressBarLeft).width)) == 0)
			{
				const gameBreakerLeft = document.getElementById("power-container-left");
				Game.containerProgressBarLeft.style.backgroundColor = "green";
				gameBreakerLeft.style.color = "grey";
				Game.containerProgressBarLeft.style.width = Game.sizeOfStep + 'px';
			}
		}
	});
}

function specialShotComputerPlayer1(Game)
{
	window.addEventListener('keypress', (event) => {
		if (event.key === " ")
		{
			if (sizeOfAdvance(Game.fullSizePowerBar, parseInt(window.getComputedStyle(Game.containerProgressBarLeft).width)) == 0)
			{
				Game.powerPlayer1 = "active";
				const gameBreakerLeft = document.getElementById("power-container-left");
				Game.containerProgressBarLeft.style.backgroundColor = "green";
				gameBreakerLeft.style.color = "grey";
				Game.containerProgressBarLeft.style.width = Game.sizeOfStep + 'px';
			}
		}
	});
}

function specialShotComputerPlayer2(Game)
{
	window.addEventListener('keypress', (event) => {
		if (event.key === "0")
		{
			if (sizeOfAdvance(Game.fullSizePowerBar, parseInt(window.getComputedStyle(Game.containerProgressBarRight).width)) == 0)
			{
				Game.powerPlayer2 = "active";
				const gameBreakerLeft = document.getElementById("power-container-right");
				Game.containerProgressBarRight.style.backgroundColor = "green";
				gameBreakerLeft.style.color = "grey";
				Game.containerProgressBarRight.style.width = Game.sizeOfStep + 'px';
			}
		}
	});
}

function pauseButtonSmartphone(Game)
{
	window.addEventListener('touchstart', (event) => {
		if (event.target.id === "pause-button")
		{
			Game.gamePaused = !Game.gamePaused;
			if (Game.gamePaused)
				cancelAnimationFrame(Game.animationFrameId);
			else
				Game.start();
		}
	});
}

function cameraChangement(Game)
{
	window.addEventListener('keypress', (event) => {
		if (event.key === 'v' && !Game.gamePaused)
		{
			if (Game.changeCamera === 0)
			{
				if (Game.modeGame === "soloPlayer")
					thirdPersonCamera(Game);
				else if (Game.modeGame === "multiplayerGame")
					multiplayerCamera(Game);
			}
			else
				cameraClassicPong(Game);
		}
	});
}