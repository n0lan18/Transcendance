import { cameraClassicPong, thirdPersonCamera, multiplayerCamera } from "./computer/camera.js";
import { sizeOfAdvance } from '../utils.js';
import { pausePage } from "./pause.js";
import { startCountdown } from "./countdown.js";
import { fullScreen } from "./fullscreen.js";

export function eventListener(Game)
{
	orientationChange(Game);
	resizeWindow(Game);
	fullScreenEvent(Game);
	pauseGame(Game);
	specialShotSmartphone(Game);
	specialShotComputerPlayer2(Game);
	pauseButtonSmartphone(Game);
	cameraChangement(Game);
	specialShotComputerPlayer1(Game);
}

function orientationChange(Game)
{
	window.addEventListener('orientationchange', () => {
		Game.gamePaused = !Game.gamePaused;
		if (Game.gamePaused)
		{
			cancelAnimationFrame(Game.animationFrameId);
			Game.animationFrameId = null;
		}
		else
		{
			if (!Game.animationFrameId)
				Game.start();
		}
	});
}

function fullScreenEvent(Game)
{
	document.addEventListener("fullscreenchange", () => {
		if (!document.fullscreenElement)
		{
			Game.gamePaused = true;
			fullScreen(Game);
		}
	});
}

function resizeWindow(Game)
{
	window.addEventListener('resize', () => {
		Game.dimensions = Game.getGameContainerDimensions();
		if (Game.dimensions.width == 0)
			return ;
		clearTimeout(Game.resizeTimeout);
		Game.resizeTimeout = setTimeout(() => {
			Game.dimensions = Game.getGameContainerDimensions();
			Game.camera.aspect = Game.dimensions.width / Game.dimensions.height;
			Game.camera.updateProjectionMatrix();
			Game.renderer.setSize(Game.dimensions.width, Game.dimensions.height);
			const newHeight = Game.dimensions.width / (16 / 9);
			if (Game.dimensions.width <= 1024)
				Game.container.style.height = `500px`;
			else
				Game.container.style.height = `${newHeight}px`;
		}, 100);
	});
}

function pauseGame(Game)
{
	window.addEventListener('keydown', (event) => {
		if (event.key === 'Shift')
		{
			Game.gamePaused = !Game.gamePaused;
			if (Game.gamePaused)
			{
				cancelAnimationFrame(Game.animationFrameId);
				pausePage(Game);
			}
			else
			{
				Game.gamePaused = !Game.gamePaused;
				const backgrondCountdownContainer = document.getElementById("background-pause");
				const pauseContainer = document.getElementById("countdown");
				if (backgrondCountdownContainer)
					backgrondCountdownContainer.remove();
				pauseContainer.remove();
				startCountdown(Game);
				Game.start();
			}
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
	if (Game.superPower == "isSuperPower")
	{
		window.addEventListener('touchstart', (event) => {
			if (event.target.id === "special-shot-button")
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
}

function specialShotComputerPlayer1(Game)
{
	if (Game.superPower == "isSuperPower")
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
}

function specialShotComputerPlayer2(Game)
{
	if (Game.superPower == "isSuperPower")
	{
		window.addEventListener('keypress', (event) => {
			if (event.key === "0" && Game.styleMatch == "multiplayer")
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
		if (event.key === 'v' || event.key === 'V')
		{
			if (Game.changeCamera === 0)
			{
				if (Game.modeGame === "soloPlayer" || Game.modeGame === "tournament")
					thirdPersonCamera(Game);
			}
			else
				cameraClassicPong(Game);
		}
	});
}