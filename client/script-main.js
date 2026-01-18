let curBoard = [
    [['♜', 'b'], ['♞', 'b'], ['♝', 'b'], ['♛', 'b'], ['♚', 'b'], ['♝', 'b'], ['♞', 'b'], ['♜', 'b']],
    [['♟', 'b', true], ['♟', 'b', true], ['♟', 'b', true], ['♟', 'b', true], ['♟', 'b', true], ['♟', 'b', true], ['♟', 'b', true], ['♟', 'b', true]],
    [[''], [''], [''], [''], [''], [''], [''], ['']],
    [[''], [''], [''], [''], [''], [''], [''], ['']],
    [[''], [''], [''], [''], [''], [''], [''], ['']],
    [[''], [''], [''], [''], [''], [''], [''], ['']],
    [['♟', 'w', true], ['♟', 'w', true], ['♟', 'w', true], ['♟', 'w', true], ['♟', 'w', true], ['♟', 'w', true], ['♟', 'w', true], ['♟', 'w', true]],
    [['♜', 'w'], ['♞', 'w'], ['♝', 'w'], ['♛', 'w'], ['♚', 'w'], ['♝', 'w'], ['♞', 'w'], ['♜', 'w']]
];
let whoseTurn = 'w';


//create the board with empty cases
function initBoard() {
    let squares = "";
    let colorSquare = {0: "bright", 1: "dark"};
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j+=2) {
            squares += "<div class='square selected-square square-" + colorSquare[(i+j) % 2] + "' id='square-" + String(i) + String(j) + "'></div>\n";
            squares += "<div class='square square-" + colorSquare[(i+1+j) % 2] + "' id='square-" + String(i) + String(j+1) + "'></div>\n";
        }
    }
    let chessBoard = document.getElementById("chess-board");
    chessBoard.innerHTML = squares;
    refreshBoard();
}

//refresh board with curBoard
function refreshBoard() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            divPiece = document.getElementById("square-" + String(i) + String(j));
            if (curBoard[i][j][0] != '') {
                divPiece.classList.add("pointer");
                if (curBoard[i][j][1] === 'w') {
                    divPiece.innerHTML = "<span class='prevent-select white-piece' id='piece-w" + String(i) + String(j) + "'>" + curBoard[i][j][0] + "</span>";  
                }
                else {
                    divPiece.innerHTML = "<span class='prevent-select' id='piece-b" + String(i) + String(j) + "'>"  + curBoard[i][j][0] + "</span>";
                }
            }
            else {
                divPiece.innerHTML = "<span class='prevent-select' id='piece-/" + String(i) + String(j) + "'>"  + curBoard[i][j][0] + "</span>";
            }
        }
    }
}

function playTurn(whoseTurn) {
    console.log(whoseTurn);
    let shownMoves = [];
    document.addEventListener('click', function(clicked) {
        //erase precedent legal moves that might have been displayed
        for (let x of shownMoves) {
            let divSquare = document.getElementById("square-" + String(x[0]) + String(x[1]));
            divSquare.innerHTML = "";
            divSquare.classList.remove("pointer");
        }
        
        //make legal moves appear if what has been clicked is a piece
        if (clicked.target.id.slice(0,5) === 'piece') {
            //check that the clicked piece belongs to the player whose turn it is to play
            if (clicked.target.id[6] === whoseTurn) {
                let i = clicked.target.id[7];
                let j = clicked.target.id[8];
                let dicMoves = possibleMoves();

                shownMoves = dicMoves[[i,j]];
                for (let x of dicMoves[[i,j]]) {
                    let divSquare = document.getElementById("square-" + String(x[0]) + String(x[1]));
                    divSquare.innerHTML = "<span class='prevent-select allowed-move' id='piece-" + whoseTurn + String(x[0]) + String(x[1]) + "'>•</span>";
                    divSquare.classList.add("pointer");
                }

                document.addEventListener('click', function(chosenMove) {
                    //a move has been chosen by the player
                    let newi = chosenMove.target.id[7];
                    let newj = chosenMove.target.id[8];
                    
                    if (JSON.stringify(dicMoves[[i,j]]).includes(JSON.stringify([parseInt(newi),parseInt(newj)]))) {
                        console.log("coucou");
                        //move it to its new square
                        let piece = curBoard[i][j][0];
                        if (piece === '♟') {
                            curBoard[newi][newj] = ['♟', whoseTurn, false];
                        }
                        else {
                            curBoard[newi][newj] = [piece, whoseTurn];
                        }

                        //remove the piece to its original square
                        curBoard[i][j] = [''];

                        //refresh the board
                        refreshBoard();
                        checkCheckMate();
                        playTurn(nextPlayer(whoseTurn));
                    }
                })
            }
        }
    });
}

//change player turn
function nextPlayer(whoseTurn) {
    return whoseTurn === 'w' ? 'b' : 'w';
}

function checkCheckMate() {

}

function main() {
    initBoard();
    refreshBoard();

    playTurn(whoseTurn);
}

window.onload = main();