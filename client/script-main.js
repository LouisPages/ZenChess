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


//create the board with empty cases
function initBoard() {
    squares = "";
    colorSquare = {0: "bright", 1: "dark"};
    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j+=2) {
            squares += "<div class='square square-" + colorSquare[(i+j) % 2] + "' id='square" + String(i) + String(j) + "'></div>\n";
            squares += "<div class='square square-" + colorSquare[(i+1+j) % 2] + "' id='square" + String(i) + String(j+1) + "'></div>\n";
        }
    }
    chessBoard = document.getElementById("chess-board");
    chessBoard.innerHTML = squares;
    initPieces();
}

//add pieces on the board
function initPieces() {
    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            divPiece = document.getElementById("square" + String(i) + String(j));
            if (i === 6 || i === 7) {
                divPiece.innerHTML = "<span class='prevent-select white-piece'>" + curBoard[i][j][0] + "</span>";
            }
            else {
                divPiece.innerHTML = "<span class='prevent-select'>" + curBoard[i][j][0] + "</span>";
            }
            if (curBoard[i][j] != '' ) divPiece.classList.add("pointer");
        }
    }
    truc = possibleMoves();
}

window.onload = initBoard();