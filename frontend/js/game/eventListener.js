import { cameraClassicPong, thirdPersonCamera, multiplayerCamera } from "./computer/camera.js";
import { isMobileDevice, sizeOfAdvance } from '../utils.js';
import { pausePage } from "./pause.js";
import { startCountdown } from "./countdown.js";
import { fullScreen } from "./fullscreen.js";

export function eventListener(Game)
{
	resizeWindow(Game);
	fullScreenEvent(Game);
	pauseGame(Game);
	specialShotSmartphone(Game);
	specialShotComputerPlayer2(Game);
	pauseButtonSmartphone(Game);
	cameraChangement(Game);
	specialShotComputerPlayer1(Game);
}

function fullScreenEvent(Game)
{
	document.addEventListener("fullscreenchange", () => {
		if (!document.fullscreenElement)
		{
			Game.pause();
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
			if (isMobileDevice())
				return;
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
		if (event.key === 'Shift' && Game.modeGame !== "Online")
		{
			if (Game.gameState === "stopped") return;
			if (Game.gameState === "countdown") return;
			if (Game.gameState !== "paused" )
			{
				Game.pause()
				pausePage(Game);
			}
			else
			{
				Game.gameState = "countdown";
				const backgroundPauseCountdownContainer = document.getElementById("background-pause");
				const pauseContainer = document.getElementById("countdown");
				if (backgroundPauseCountdownContainer)
					backgroundPauseCountdownContainer.remove();
				if (pauseContainer)
					pauseContainer.remove();
				startCountdown(Game);
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
		const specialShotSmartphonePlayer1 = document.getElementById("special-shot-button")
		if (specialShotSmartphonePlayer1)
		{
			specialShotSmartphonePlayer1.addEventListener("click", () => {
				if (sizeOfAdvance(Game.fullSizePowerBar, parseInt(window.getComputedStyle(Game.containerProgressBarLeft).width)) == 0)
					{
						Game.numberGameBreaker++;
						Game.powerPlayer1 = "active";
						const gameBreakerLeft = document.getElementById("power-container-left");
						Game.containerProgressBarLeft.style.backgroundColor = "green";
						gameBreakerLeft.style.color = "grey";
						Game.containerProgressBarLeft.style.width = Game.sizeOfStep + 'px';
					}
			});
		}

		const specialShotSmartphonePlayer2 = document.getElementById("special-shot-button-right")
		if (specialShotSmartphonePlayer2)
		{
			specialShotSmartphonePlayer2.addEventListener('click', () => {
				if (sizeOfAdvance(Game.fullSizePowerBar, parseInt(window.getComputedStyle(Game.containerProgressBarRight).width)) == 0)
					{
						Game.numberGameBreaker++;
						Game.powerPlayer2 = "active";
						const gameBreakerRight = document.getElementById("power-container-right");
						Game.containerProgressBarRight.style.backgroundColor = "green";
						gameBreakerRight.style.color = "grey";
						Game.containerProgressBarRight.style.width = Game.sizeOfStep + 'px';
					}
			})
		}
	}
}

function specialShotComputerPlayer1(Game)
{
	if (Game.superPower == "isSuperPower")
	{
		window.addEventListener('keypress', (event) => {
			if (event.key === " " && (Game.modeGame != "Online" || (Game.modeGame == "Online" && Game.isplayer1)))
			{
				if (sizeOfAdvance(Game.fullSizePowerBar, parseInt(window.getComputedStyle(Game.containerProgressBarLeft).width)) == 0)
				{
					Game.numberGameBreaker++;
					Game.powerPlayer1 = "active";
					const gameBreakerLeft = document.getElementById("power-container-left");
					Game.containerProgressBarLeft.style.backgroundColor = "green";
					gameBreakerLeft.style.color = "grey";
					Game.containerProgressBarLeft.style.width = Game.sizeOfStep + '%';

					if (Game.isplayer1 && Game.modeGame == "Online")	 {  
						let message = {
							type: "update_ball",
							player: "player1",
							collision: "collision",
							position: { x: Game.ball.position.x, y: Game.ball.position.y },
							velocity: { x: Game.ballVelocity.x, y: Game.ballVelocity.y },
							superpowerleft: parseFloat(Game.containerProgressBarLeft.style.width),
							superpowerright: null
						};
						Game.socket.send(JSON.stringify(message));
						console.log("Envoi WebSocket :", message);
					}
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
			if (event.key === "0" && (Game.modeGame != "Online" || (Game.modeGame == "Online" && !Game.isplayer1)))
			{
				if (sizeOfAdvance(Game.fullSizePowerBar, parseInt(window.getComputedStyle(Game.containerProgressBarRight).width)) == 0)
				{
					Game.numberGameBreaker++;
					Game.powerPlayer2 = "active";
					const gameBreakerRight = document.getElementById("power-container-right");
					Game.containerProgressBarRight.style.backgroundColor = "green";
					gameBreakerRight.style.color = "grey";
					Game.containerProgressBarRight.style.width = Game.sizeOfStep + '%';

					if (!Game.isplayer1 && Game.modeGame == "Online")	 {
						let message = {
							type: "update_ball",
							player: "player2",
							collision: "collision",
							position: { x: Game.ball.position.x, y: Game.ball.position.y },
							velocity: { x: Game.ballVelocity.x, y: Game.ballVelocity.y },
							superpowerleft: null,
							superpowerright: parseFloat(Game.containerProgressBarRight.style.width)
						};
						Game.socket.send(JSON.stringify(message));
						console.log("Envoi WebSocket :", message);
					}
				}
			}
		});
	}
}

function pauseButtonSmartphone(Game)
{
	const pauseButtonSmart = document.getElementById("pause-button");
	if (pauseButtonSmart)
		pauseButtonSmart.addEventListener('click', () => pauseSmartphone(Game));
	const pauseButtonSmart2 = document.getElementById("pause-button-right");
	if (pauseButtonSmart2)
		pauseButtonSmart2.addEventListener('click', () => pauseSmartphone(Game));

	window.addEventListener('click', (event) => {
		if (event.target.id == "background-pause")
			pauseSmartphone(Game);
	})
}

function pauseSmartphone(Game)
{
	if (Game.gameState === "stopped") return;
	if (Game.gameState === "countdown") return;
	if (Game.gameState !== "paused")
	{
		Game.pause()
		pausePage(Game);
	}
	else
	{
		Game.gameState = "countdown";
		const backgroundPauseCountdownContainer = document.getElementById("background-pause");
		const pauseContainer = document.getElementById("countdown");
		if (backgroundPauseCountdownContainer)
			backgroundPauseCountdownContainer.remove();
		if (pauseContainer)
			pauseContainer.remove();
		startCountdown(Game);
	}	
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