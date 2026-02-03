//function designed to send moves that the bot can play so that it can choose it randomly
//todo after: only send curBoard and use python-chess module
async function playZenBotMove(dicBotPossibleMoves) {
    let movesToSend = getMovesToSend(dicBotPossibleMoves);
    let chosenMove = await getZenBotMove(movesToSend);
    
    toMove = [chosenMove[0][0], chosenMove[0][1]]
    makeMove(chosenMove[1][0], chosenMove[1][1]);
    refreshBoard();
    whoseTurn = nextPlayer()

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

//prepare the data to send
function getMovesToSend(dicBotPossibleMoves) {
    let movesToSend = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (curBoard[i][j][1] === botColor) {
                dicBotPossibleMoves[[i,j]].forEach(element => {
                    movesToSend.push([[i,j],element]);
                });
            }
        }
    }
    return movesToSend;
}

//send the data and receive ZenBot's move 
async function getZenBotMove(movesToSend) {
    console.log("coucou ", movesToSend);
    try {
        const response = await fetch('/zenbot/get-bot-move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                legalMoves: movesToSend
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