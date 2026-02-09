//function designed to send moves that the bot can play so that it can choose it randomly
async function playZenBotMove(zenBotMode) {
    let chosenMove = await getZenBotMove(zenBotMode);
    
    toMove = [chosenMove[0][0], chosenMove[0][1]]
    makeMove(chosenMove[1][0], chosenMove[1][1]);
    refreshBoard();
    whoseTurn = nextPlayer(whoseTurn);

    //!!!!!TODO: put this code in one function cause repeated 4 times
    let [mate, kingPos] = mateCheck();
    if (mate) {
        kingCheck = true;
        //change the color of the king's square to red
        mateKingSquare = document.getElementById("square-" + String(kingPos[0]) + String(kingPos[1]));
        mateKingSquare.classList.add('square-red');
    } else {
        kingCheck = false;
    }

    let [dicMovesCheck, disallowKingSquareCheck] = possibleMoves();
    dicMovesCheck = addPossibleMovesKing(dicMovesCheck, disallowKingSquareCheck);
    dicMovesCheck = filterPinnedMoves(dicMovesCheck);
    let gameOver = checkCheckMate(dicMovesCheck, kingPos);
}


//send the data and receive ZenBot's move
async function getZenBotMove(mode) {
    try {
        const response = await fetch('/zenbot/get-bot-move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                curBoard : curBoard,
                mode : mode,
                whoseTurn : whoseTurn,
                castleAvailable: castle,
                lastMove: lastMove
            })
        })

        const data = await response.json();

        if (data.success) {
            return data.move
        }
        else {
            console.log("Error : ", data.error);
        }
    }
    catch (error) {
        console.log("Error : ", data.error)
    }
}