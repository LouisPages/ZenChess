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
let shownMoves = [];
let toMove = [];


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

//erase legal moves that might have been displayed
function clearShownLegalMoves() {
    for (let x of shownMoves) {
        let divSquare = document.getElementById("square-" + String(x[0]) + String(x[1]));
        divSquare.innerHTML = "";
        divSquare.classList.remove("pointer");
        divSquare.classList.remove("allowed-move");
    }
    shownMoves = [];
}


document.addEventListener('click', function(clicked) {
        clearShownLegalMoves();

        let dicMoves = possibleMoves();
        let i = clicked.target.id[7];
        let j = clicked.target.id[8];
        shownMoves = dicMoves[[i,j]];
        
        if (clicked.target.classList.contains("allowed-move")) {
            //a legal square has been clicked on : move the piece to this square
            let piece = curBoard[toMove[0]][toMove[1]][0];
            if (piece === '♟') {
                curBoard[i][j] = ['♟', whoseTurn, false];
            }
            else {
                curBoard[i][j] = [piece, whoseTurn];
            }
            
            //remove the piece to its original square
            curBoard[toMove[0]][toMove[1]] = [''];

            toMove = [];
            
            //refresh the board
            refreshBoard();
            checkCheckMate();
            whoseTurn = nextPlayer(whoseTurn);
            console.log(whoseTurn);
        }
        else {      
            if (clicked.target.id.slice(0,5) === 'piece' && clicked.target.id[6] === whoseTurn) {
                //make legal moves appear if what has been clicked is a piece of the player whose turn is to play
                for (let x of dicMoves[[i,j]]) {
                    let divSquare = document.getElementById("square-" + String(x[0]) + String(x[1]));
                    divSquare.innerHTML = "<span class='prevent-select allowed-move' id='piece-" + whoseTurn + String(x[0]) + String(x[1]) + "'>•</span>";
                    divSquare.classList.add("pointer");
                    divSquare.classList.add("allowed-move");
                }
                toMove = [i,j];
            }
        }
            
        
});

//change player turn
function nextPlayer(whoseTurn) {
    return whoseTurn === 'w' ? 'b' : 'w'
}

function checkCheckMate() {

}

function main() {
    initBoard();
    refreshBoard();
}

window.onload = main();