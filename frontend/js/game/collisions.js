import { getScores, incrementLeftScore, incrementRightScore } from "./score.js";
import { sizeOfAdvance } from "../utils.js";
import { invisible } from "./characters/invisible.js";
import { timeLaps } from "./characters/time-laps.js";

export function handleCollisions(Game) {
	if (Game.ball.position.y > 13.5 || Game.ball.position.y < -13.5) {
		Game.ballVelocity.y = -Game.ballVelocity.y;
	}
	// Vérification de la collision avec la raquette gauche
	if (Game.ball.position.x - 1 < Game.leftPaddle.position.x + 0.25 &&
		Game.ball.position.x + 1 > Game.leftPaddle.position.x - 0.25 &&
		Game.ball.position.y < Game.leftPaddle.position.y + 3 &&
		Game.ball.position.y > Game.leftPaddle.position.y - 3)
	{
		Game.ball.position.x = Game.leftPaddle.position.x + 1.25;
		paddleCollision(Game.leftPaddle, "left", Game);
	}

	// Vérification de la collision avec la raquette droite
	if (Game.ball.position.x - 1 < Game.rightPaddle.position.x + 0.25 &&
		Game.ball.position.x + 1 > Game.rightPaddle.position.x - 0.25 &&
		Game.ball.position.y < Game.rightPaddle.position.y + 3 &&
		Game.ball.position.y > Game.rightPaddle.position.y - 3)
	{
		Game.ball.position.x = Game.rightPaddle.position.x - 1.25;
		paddleCollision(Game.rightPaddle, "right", Game);
	}

	// Réinitialisation si la balle sort des limites latérales
	if (Game.ball.position.x > 25 || Game.ball.position.x < -25) {
		if (Game.ball.position.x > 25)
		{
			incrementLeftScore(Game);
			let widthLeft = parseInt(window.getComputedStyle(Game.containerProgressBarLeft).width);
			let newWidth = widthLeft + Game.sizeOfStep * 5;
			Game.containerProgressBarLeft.style.width = newWidth + 'px';	
		}
		else if (Game.ball.position.x < -25)
		{
			incrementRightScore(Game);
			let widthRight = parseInt(window.getComputedStyle(Game.containerProgressBarRight).width);
			let newWidth = widthRight + Game.sizeOfStep * 5;
			Game.containerProgressBarRight.style.width = newWidth + 'px';
		}
		changeColorIfBarIsFull(Game);
		let scores = getScores(Game);
		if (scores.leftPlayerScore === 5 || scores.rightPlayerScore === 5)
		{
			Game.ballVelocity.x = 0;
			Game.ballVelocity.y = 0;
			Game.gamePaused = true;
		}
		Game.ball.position.set(0, 1, 1);
		Game.numberPaddelCollision = 0;
		if (!Game.gamePaused)
			Game.ballVelocity = {x: 0.1, y: 0.1};
	}
}

function paddleCollision(paddle, direction, Game)
{
	Game.numberPaddelCollision++;
	if (Game.numberPaddelCollision > 10)
		Game.ballVelocity.x += 0.1;
	let impactPoint = Game.ball.position.y - paddle.position.y;
	if (direction === "left" && Game.powerPlayer1 === "active")
	{
		Game.powerPlayer1 = "inactive";
		console.log("PROUT");
		console.log(Game.heroPowerPlayer1);
		if (Game.heroPowerPlayer1 == "Invisible")
			invisible(Game, "left");
/*		else if (this.heroPowerPlayer1 == "Super strength")
		
		else if (this.heroPowerPlayer1 == "Duplication")
*/	}
	if (direction === "right" && Game.powerPlayer1 === "active" && Game.heroPowerPlayer1 === "Time laps")
		timeLaps(Game, "left");
	if (direction === "left" && Game.powerPlayer2 === "active" && Game.heroPowerPlayer2 === "Time laps")
		timeLaps(Game, "right");
	if (direction === "right" && Game.powerPlayer2 === "active")
	{
		Game.powerPlayer2 = "inactive";
		if (Game.heroPowerPlayer2 == "Invisible")
			invisible(Game, "right");
	}

	let realImpactPoint = impactPoint;
	if (impactPoint < 0)
		impactPoint = impactPoint * -1;
	let normalizedImpact = impactPoint / (paddle.geometry.parameters.height / 2);
	Game.ballVelocity.x = -Game.ballVelocity.x;
	let widthLeft = parseInt(window.getComputedStyle(Game.containerProgressBarLeft).width);
	let widthRight = parseInt(window.getComputedStyle(Game.containerProgressBarRight).width);
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
		adjustBallY(Game, realImpactPoint, normalizedImpact, 0.15);
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
		adjustBallY(Game, realImpactPoint, normalizedImpact, 0.13)
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

function changeColorIfBarIsFull(Game)
{
	const gameBreakerLeft = document.getElementById("power-container-left");
	const gameBreakerSmartphone = document.getElementById("special-shot-button");
	const gameBreakerRight = document.getElementById("power-container-right");
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
		Game.containerProgressBarRight.style.backgroundColor = "red";
		gameBreakerRight.style.color = "white";
	}
	else
	{
		Game.containerProgressBarRight.style.backgroundColor = "green";
		gameBreakerRight.style.color = "grey";
	}
}

function adjustBallY(Game, realImpactPoint, normalizedImpact, value)
{
	if (realImpactPoint > 0)
		Game.ballVelocity.y = (normalizedImpact * value);
	else
		Game.ballVelocity.y = (normalizedImpact * value) * -1;
}