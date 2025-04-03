import { getScores, incrementLeftScore, incrementRightScore } from "./score.js";
import { InfoDataMatchTournamentFinale, InfoDataSimpleMatch, InfoDataMatchTournament, sizeOfAdvance, putHistoryMatches, putWinnerMatchTournament, getUserInfo } from "../utils.js";
import { startCountdown } from "./countdown.js";
import { loadFinishPage } from "./finishPage.js";
import { loadFinishPageTournament } from "./finishPage-tournament.js";
import { loadFinishPageTournamentWin } from "./finishPage-tournament-win.js";
import { closeGameSocket } from "../websocket.js";

export async function handleCollisions(Game) {
	if (Game.ball.position.y > 13.5 || Game.ball.position.y < -13.5) {
		Game.ballVelocity.y = -Game.ballVelocity.y;
	}

	if (Game.ballReplica)
	{
		if (Game.ballReplica.position.y > 13.5 || Game.ballReplica.position.y < -13.5) {
			Game.ballVelocityReplica.y = -Game.ballVelocityReplica.y;
		}
	}
	// Vérification de la collision avec la raquette gauche
	if (Game.ball.position.x - 1 < Game.leftPaddle.position.x + 0.25 &&
		Game.ball.position.x + 1 > Game.leftPaddle.position.x - 0.25 &&
		Game.ball.position.y < Game.leftPaddle.position.y + 3 &&
		Game.ball.position.y > Game.leftPaddle.position.y - 3)
	{
		Game.ball.position.x = Game.leftPaddle.position.x + 1.25;
		paddleCollision(Game.leftPaddle, "left", Game);

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
		}
	}

	// Vérification de la collision avec la raquette droite
	if (Game.ball.position.x - 1 < Game.rightPaddle.position.x + 0.25 &&
		Game.ball.position.x + 1 > Game.rightPaddle.position.x - 0.25 &&
		Game.ball.position.y < Game.rightPaddle.position.y + 3 &&
		Game.ball.position.y > Game.rightPaddle.position.y - 3)
	{
		Game.ball.position.x = Game.rightPaddle.position.x - 1.25;
		paddleCollision(Game.rightPaddle, "right", Game);

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
		}
	}

	if (Game.modeGame == "multiPlayerFour")
		{
			// Vérification de la collision avec la raquette gauche
			if (Game.ball.position.x - 1 < Game.leftPaddleMini.position.x + 0.25 &&
				Game.ball.position.x + 1 > Game.leftPaddleMini.position.x - 0.25 &&
				Game.ball.position.y < Game.leftPaddleMini.position.y + 1.5 &&
				Game.ball.position.y > Game.leftPaddleMini.position.y - 1.5)
			{
				// Détecter si la balle frappe le côté avant ou arrière
				if (Game.ballVelocity.x < 0) { // La balle va vers la gauche
					Game.ball.position.x = Game.leftPaddleMini.position.x + 1.25; // Côté avant
				} else { // La balle revient de l'autre côté
					Game.ball.position.x = Game.leftPaddleMini.position.x - 1.25; // Côté arrière
				}
		
				// Appliquer la logique de collision
				paddleMiniCollision(Game.leftPaddleMini, "left", Game);
			}
		
			// Vérification de la collision avec la raquette droite
			if (Game.ball.position.x - 1 < Game.rightPaddleMini.position.x + 0.25 &&
				Game.ball.position.x + 1 > Game.rightPaddleMini.position.x - 0.25 &&
				Game.ball.position.y < Game.rightPaddleMini.position.y + 1.5 &&
				Game.ball.position.y > Game.rightPaddleMini.position.y - 1.5)
			{
				// Détecter si la balle frappe le côté avant ou arrière
				if (Game.ballVelocity.x > 0) { // La balle va vers la droite
					Game.ball.position.x = Game.rightPaddleMini.position.x - 1.25; // Côté avant
				} else { // La balle revient de l'autre côté
					Game.ball.position.x = Game.rightPaddleMini.position.x + 1.25; // Côté arrière
				}
		
				// Appliquer la logique de collision
				paddleMiniCollision(Game.rightPaddleMini, "right", Game);
			}
		}

	if (Game.ballReplica && (Game.ballReplica.position.x > 25 || Game.ballReplica.position.x < -25))
	{
		Game.scene.remove(Game.ballReplica);
		Game.scene.remove(Game.trailReplica);
	}

	// Réinitialisation si la balle sort des limites latérales
	if (Game.ball.position.x > 25 || Game.ball.position.x < -25) {
		if (Game.numberPaddelCollision > Game.echangeLongueur)
			Game.echangeLongueur = Game.numberPaddelCollision;
		Game.scene.remove(Game.ballReplica);
		Game.scene.remove(Game.trail);
		let xBall = 0;
		if (Game.ball.position.x > 25)
		{
			xBall = 0.1;
			incrementLeftScore(Game);
			let widthLeft = parseInt(window.getComputedStyle(Game.containerProgressBarLeft).width);
			let containerWidth = Game.containerProgressBarLeft.parentElement.offsetWidth;
			let newWidthpx = widthLeft + Game.sizeOfStep * 5;
			let newWidthPercent = (newWidthpx / containerWidth) * 100;
			Game.containerProgressBarLeft.style.width = newWidthPercent + '%';
		}
		else if (Game.ball.position.x < -25)
		{
			xBall = -0.1;
			incrementRightScore(Game);
			let widthRight = parseInt(window.getComputedStyle(Game.containerProgressBarRight).width);
			let containerWidth = Game.containerProgressBarRight.parentElement.offsetWidth;
			let newWidthpx = widthRight + Game.sizeOfStep * 5;
			let newWidthPercent = (newWidthpx / containerWidth) * 100;
			Game.containerProgressBarRight.style.width = newWidthPercent + '%';
		}
		changeColorIfBarIsFull(Game);
		let scores = getScores(Game);
		Game.pause();
		if (scores.leftPlayerScore >= 5 || scores.rightPlayerScore >= 5)
		{
			Game.endMatch = new Date();
			Game.ballVelocity.x = 0;
			Game.ballVelocity.y = 0;
			let isWin;
			let scoresText = scores.leftPlayerScore + "-" + scores.rightPlayerScore;
			let timeMatch = Game.endMatch - Game.startMatch;

			let winner;
			if (scores.leftPlayerScore >= 5)
				winner = Game.username1;
			else
				winner = Game.username2;
			let userInfo = await getUserInfo();
			if (userInfo.username == Game.username1 || userInfo.username == Game.username2)
				await putHistoryMatches(Game.username1, Game.heroPowerPlayer1, Game.username2, Game.heroPowerPlayer2, scoresText, Game.numberGameBreaker, Game.echangeLongueur, timeMatch, winner, Game.superPower)
			if (scores.leftPlayerScore >= 5)
			{
				if (Game.modeGame == "tournament-multi-local")
					await putWinnerMatchTournament(Game.username1)
				isWin = true;
			}
			else
			{
				if (Game.modeGame == "tournament-multi-local")
					await putWinnerMatchTournament(Game.username2)
				isWin = false;
			}
			if (Game.modeGame == "tournament-multi-local")
			{
				if (Game.numberPlayers == 2)
				{
					InfoDataMatchTournamentFinale(Game.username1, Game.username2, Game.numberPlayers, scores.leftPlayerScore, scores.rightPlayerScore);
					loadFinishPageTournament();
				}
				else
				{
					InfoDataMatchTournament(Game.username1, Game.username2, Game.numberPlayers, scores.leftPlayerScore, scores.rightPlayerScore)
					loadFinishPageTournamentWin();
				}
			}
			else
			{
				InfoDataSimpleMatch(scores.leftPlayerScore, scores.rightPlayerScore, isWin, Game.modeGame, Game.isplayer1);
				if (Game.modeGame === "Online")
					closeGameSocket(Game.socket);
				loadFinishPage();
			}
		}
		else
			startCountdown(Game);
		Game.ball.position.set(0, 1, 1);
		Game.leftPaddle.position.set(-23.5, 1, 0.5);
		Game.rightPaddle.position.set(23.5, 1, 0.5);
		if (Game.modeGame == "multiPlayerFour")
		{
			Game.leftPaddleMini.position.set(-10.5 , 1, 0.5);
			Game.rightPaddleMini.position.set(10.5 , 1, 0.5);
		}
		Game.numberPaddelCollision = 0;
		Game.ballVelocity = {x: xBall, y: 0.02};		
	}
}

function paddleMiniCollision(paddle, direction, Game)
{
	if (Game.originalBallVelocityX != 0)
		{
			Game.ballVelocity.x = Game.originalBallVelocityX;
			Game.originalBallVelocityX = 0;
		}
		Game.directionPower = direction;
		Game.numberPaddelCollision++;
		if (Game.numberPaddelCollision > 10)
			Game.ballVelocity.x += 0.1;
		let impactPoint = Game.ball.position.y - paddle.position.y;
	
		let realImpactPoint = impactPoint;
		if (impactPoint < 0)
			impactPoint = impactPoint * -1;
		let normalizedImpact = impactPoint / (paddle.geometry.parameters.height / 2);
		Game.ballVelocity.x = -Game.ballVelocity.x;
		let widthLeft;
		let widthRight;
		if (Game.containerProgressBarLeft && Game.containerProgressBarRight)
		{
			widthLeft = parseInt(window.getComputedStyle(Game.containerProgressBarLeft).width);
			widthRight = parseInt(window.getComputedStyle(Game.containerProgressBarRight).width);
		}
		let defensePoint = 0;
		if (Game.ballVelocity.x < 30)
			defensePoint = Game.sizeOfStep / 2;
		else if (Game.ballVelocity.x >= 30 && Game.ballVelocity.x < 35)
			defensePoint = Game.sizeOfStep;
		else
			defensePoint = Game.sizeOfStep * 2;
		if ((impactPoint >= 1 && impactPoint <= 2))
		{
			adjustBallY(Game, realImpactPoint, normalizedImpact, 0.15)
			let increment = Game.sizeOfStep / 2 + defensePoint;
			if (direction === "left")
			{
				let newWidth = widthLeft + increment;
				Game.containerProgressBarLeft.style.width = newWidth + 'px';
			}
			else
			{
				let newWidth = widthRight + increment;
				Game.containerProgressBarRight.style.width = newWidth + 'px';
			}
		}
		else if ((impactPoint >= 0.5 && impactPoint < 1))
		{
			adjustBallY(Game, realImpactPoint, normalizedImpact, 0.13);
			let increment = Game.sizeOfStep + defensePoint;
			if (direction === "left")
				Game.ballVelocity.x = 0.30;
			else
				Game.ballVelocity.x = -0.30;
			if (direction === "left")
			{
				let newWidth = widthLeft + increment;
				Game.containerProgressBarLeft.style.width = newWidth + 'px';
			}
			else
			{
				let newWidth = widthRight + increment;
				Game.containerProgressBarRight.style.width = newWidth + 'px';
			}
		}
		else if (impactPoint < 0.5)
		{
			adjustBallY(Game, realImpactPoint, normalizedImpact, 0.10)
			let increment = Game.sizeOfStep * 2 + defensePoint;
			if (direction === "left")
				Game.ballVelocity.x = 0.38;
			else
				Game.ballVelocity.x = -0.38;
			if (direction === "left")
			{
				let newWidth = widthLeft + increment;
				Game.containerProgressBarLeft.style.width = newWidth + 'px';
			}
			else
			{
				let newWidth = widthRight + increment;
				Game.containerProgressBarRight.style.width = newWidth + 'px';
			}
		}
		else
		{
			if (direction === "left")
			{
				let newWidth = widthLeft + defensePoint;
				Game.containerProgressBarLeft.style.width = newWidth + 'px';
			}
			else
			{
				let newWidth = widthRight + defensePoint
				Game.containerProgressBarRight.style.width = newWidth + 'px';
			}
		}
		changeColorIfBarIsFull(Game);
}

function paddleCollision(paddle, direction, Game)
{
	if (Game.originalBallVelocityX != 0)
	{
		Game.ballVelocity.x = Game.originalBallVelocityX;
		Game.originalBallVelocityX = 0;
	}
	Game.directionPower = direction;
	Game.numberPaddelCollision++;
	if (Game.numberPaddelCollision > 10)
		Game.ballVelocity.x += 0.1;
	let impactPoint = Game.ball.position.y - paddle.position.y;

	let realImpactPoint = impactPoint;
	if (impactPoint < 0)
		impactPoint = impactPoint * -1;
	let normalizedImpact = impactPoint / (paddle.geometry.parameters.height / 2);
	Game.ballVelocity.x = -Game.ballVelocity.x;
	let widthLeft;
	let widthRight;
	if (Game.containerProgressBarLeft && Game.containerProgressBarRight)
	{
		widthLeft = parseFloat(window.getComputedStyle(Game.containerProgressBarLeft).width);
		widthRight = parseFloat(window.getComputedStyle(Game.containerProgressBarRight).width);
	}
	let defensePoint = 0;
	if (Game.ballVelocity.x < 30)
		defensePoint = Game.sizeOfStep / 2;
	else if (Game.ballVelocity.x >= 30 && Game.ballVelocity.x < 35)
		defensePoint = Game.sizeOfStep;
	else
		defensePoint = Game.sizeOfStep * 2;
	if ((impactPoint >= 1 && impactPoint <= 2))
	{
		adjustBallY(Game, realImpactPoint, normalizedImpact, 0.25)
		let increment = Game.sizeOfStep / 2 + defensePoint;
		if (direction === "left")
		{
			let containerWidth = Game.containerProgressBarLeft.parentElement.offsetWidth;
			let newWidthpx = widthLeft + increment;
			let newWidthPercent = (newWidthpx / containerWidth) * 100;
			Game.containerProgressBarLeft.style.width = newWidthPercent + '%';
		}
		else
		{
			let containerWidth = Game.containerProgressBarRight.parentElement.offsetWidth;
			let newWidthpx = widthRight + increment;
			let newWidthPercent = (newWidthpx / containerWidth) * 100;
			Game.containerProgressBarRight.style.width = newWidthPercent + '%';
		}
	}
	else if ((impactPoint >= 0.5 && impactPoint < 1))
	{
		adjustBallY(Game, realImpactPoint, normalizedImpact, 0.15);
		let increment = Game.sizeOfStep + defensePoint;
		if (direction === "left")
			Game.ballVelocity.x = 0.30;
		else
			Game.ballVelocity.x = -0.30;
		if (direction === "left")
		{
			let containerWidth = Game.containerProgressBarLeft.parentElement.offsetWidth;
			let newWidthpx = widthLeft + increment;
			let newWidthPercent = (newWidthpx / containerWidth) * 100;
			Game.containerProgressBarLeft.style.width = newWidthPercent + '%';
		}
		else
		{
			let containerWidth = Game.containerProgressBarRight.parentElement.offsetWidth;
			let newWidthpx = widthRight + increment;
			let newWidthPercent = (newWidthpx / containerWidth) * 100;
			Game.containerProgressBarRight.style.width = newWidthPercent + '%';
		}
	}
	else if (impactPoint < 0.5)
	{
		adjustBallY(Game, realImpactPoint, normalizedImpact, 0.13)
		let increment = Game.sizeOfStep * 2 + defensePoint;
		if (direction === "left")
			Game.ballVelocity.x = 0.38;
		else
			Game.ballVelocity.x = -0.38;
		if (direction === "left")
		{
			let containerWidth = Game.containerProgressBarLeft.parentElement.offsetWidth;
			let newWidthpx = widthLeft + increment;
			let newWidthPercent = (newWidthpx / containerWidth) * 100;
			Game.containerProgressBarLeft.style.width = newWidthPercent + '%';
		}
		else
		{
			let containerWidth = Game.containerProgressBarRight.parentElement.offsetWidth;
			let newWidthpx = widthRight + increment;
			let newWidthPercent = (newWidthpx / containerWidth) * 100;
			Game.containerProgressBarRight.style.width = newWidthPercent + '%';
		}
	}
	else
	{
		if (direction === "left")
		{
			let containerWidth = Game.containerProgressBarLeft.parentElement.offsetWidth;
			let newWidthpx = widthRight + defensePoint;
			let newWidthPercent = (newWidthpx / containerWidth) * 100;
			Game.containerProgressBarRight.style.width = newWidthPercent + '%';
		}
		else
		{
			let containerWidth = Game.containerProgressBarRight.parentElement.offsetWidth;
			let newWidthpx = widthRight + defensePoint;
			let newWidthPercent = (newWidthpx / containerWidth) * 100;
			Game.containerProgressBarRight.style.width = newWidthPercent + '%';
		}
	}
	changeColorIfBarIsFull(Game);
}

function changeColorIfBarIsFull(Game)
{
	const gameBreakerLeft = document.getElementById("power-container-left");
	const gameBreakerSmartphone = document.getElementById("special-shot-button");
	const gameBreakerSmartphoneRight = document.getElementById("special-shot-button-right");
	const gameBreakerRight = document.getElementById("power-container-right");
	if (gameBreakerLeft && gameBreakerSmartphone && gameBreakerRight && gameBreakerSmartphoneRight)
	{
		if (sizeOfAdvance(Game.fullSizePowerBar, parseInt(window.getComputedStyle(Game.containerProgressBarLeft).width)) == 0)
		{
			gameBreakerSmartphone.style.color = "white";
			gameBreakerLeft.style.color = "white";
			Game.containerProgressBarLeft.style.backgroundColor = "red";
		}
		else
		{
			Game.containerProgressBarLeft.style.backgroundColor = "green";
			gameBreakerLeft.style.color = "grey";
			gameBreakerSmartphone.style.color = "grey";
		}
		if (sizeOfAdvance(Game.fullSizePowerBar, parseInt(window.getComputedStyle(Game.containerProgressBarRight).width)) == 0)
		{
			gameBreakerSmartphoneRight.style.color = "white";
			Game.containerProgressBarRight.style.backgroundColor = "red";
			gameBreakerRight.style.color = "white";
		}
		else
		{
			Game.containerProgressBarRight.style.backgroundColor = "green";
			gameBreakerRight.style.color = "grey";
			gameBreakerSmartphoneRight.style.color = "grey";
		}
	}
}

function adjustBallY(Game, realImpactPoint, normalizedImpact, value)
{
	if (realImpactPoint > 0)
		Game.ballVelocity.y = (normalizedImpact * value);
	else
		Game.ballVelocity.y = (normalizedImpact * value) * -1;
}