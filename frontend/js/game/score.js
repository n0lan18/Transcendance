
export function getScores(Game)
{
    const scores = Game.scoreContainer.textContent.split(" - ");
    return {
        leftPlayerScore: parseInt(scores[0]),
        rightPlayerScore: parseInt(scores[1])
    };
}

function updateScores(Game, leftScore, rightScore) {
    Game.scoreContainer.textContent = `${leftScore} - ${rightScore}`;
}

export function incrementLeftScore(Game) {
    const scores = getScores(Game);
    scores.leftPlayerScore++;
    updateScores(Game, scores.leftPlayerScore, scores.rightPlayerScore);
}

export function incrementRightScore(Game) {
    const scores = getScores(Game);
    scores.rightPlayerScore++;
    updateScores(Game, scores.leftPlayerScore, scores.rightPlayerScore);        
}