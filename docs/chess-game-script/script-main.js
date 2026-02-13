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

//board to test checkMate
// let curBoard = [
//     [['♜', 'b'], ['♞', 'b'], ['♝', 'b'], ['♛', 'b'], ['♚', 'b'], ['♝', 'b'], ['♞', 'b'], ['♜', 'b']],
//     [['♟', 'b', true], ['♟', 'b', true], ['♟', 'b', true], ['♟', 'b', true], ['♟', 'b', true], ['♟', 'b', true], ['♟', 'b', true], ['♟', 'b', true]],
//     [[''], [''], [''], [''], [''], [''], [''], ['']],
//     [[''], [''], [''], [''], [''], [''], [''], ['']],
//     [[''], [''], ['♝', 'w'], [''], [''], [''], [''], ['']],
//     [[''], [''], [''], [''], [''], ['♛', 'w'], [''], ['']],
//     [['♟', 'w', true], ['♟', 'w', true], ['♟', 'w', true], ['♟', 'w', true], ['♟', 'w', true], ['♟', 'w', true], ['♟', 'w', true], ['♟', 'w', true]],
//     [['♜', 'w'], ['♞', 'w'], ['♝', 'w'], [''], ['♚', 'w'], [''], ['♞', 'w'], ['♜', 'w']]
// ];


let whoseTurn = 'w';
let shownMoves = [];
let toMove = [];
let tabPieces = ['♜', '♛', '♚', '♝', '♞', '♟'];
let castle = {'wright': true, 'wleft': true, 'bright': true, 'bleft': true};
let dicPromotion = {quee: '♛', rook: '♜', bish: '♝', knig: '♞'};
let lastMove = null;
let kingCheck = false;
let promotionDone = false;
let mode = '';
let zenBotColor = ''; //initialized  in welcome.js
let zenBotMode = 'minmax';

//create the board with empty cases
function initBoard() {
    let squares = "";
    let colorSquare = {0: "bright", 1: "dark"};
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j+=2) {
            squares += "<div class='square square-" + colorSquare[(i+j) % 2] + "' id='square-" + String(i) + String(j) + "'></div>\n";
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
        divSquare.classList.remove("pointer");
        divSquare.classList.remove("allowed-move");
    }
    shownMoves = [];
    document.getElementById('svg-background').classList.remove('clip-board');
}

function makeMove(i,j) {
    return new Promise((resolve) => {
        let old_i = toMove[0];
        let old_j = toMove[1];
        let piece = curBoard[old_i][old_j][0]; 
        if (piece === '♟') {
            if (i === '0') {
                //white pawn promotion
                promotionDone = false;
                divProm = document.getElementById('w-pawn-promotion');
                divProm.style.display = "flex";
                divPromChoices = document.getElementById('w-promotion-choices');
                divPromChoices.style.left = String(80*j-320) + "px";
                document.addEventListener('click', function holdPromotion(clicked) {
                    if (clicked.target.id.slice(0,9) === 'promotion') {
                        promotionPiece = dicPromotion[clicked.target.id.slice(10,14)];
                        curBoard[i][j] = [promotionPiece, 'w'];
                        divProm.style.display = "none";
                        lastMove = ['♟', [old_i, old_j], [i,j]];
                        refreshBoard();
                        //check if the promotion makes a check
                        let [mate, kingPos] = mateCheck();
                        if (mate) {
                            kingCheck = true;
                            mateKingSquare = document.getElementById("square-" + String(kingPos[0]) + String(kingPos[1]));
                            mateKingSquare.classList.add('square-red');
                        }
                        let [dicMovesCheck, disallowKingSquareCheck] = possibleMoves();
                        dicMovesCheck = addPossibleMovesKing(dicMovesCheck, disallowKingSquareCheck);
                        dicMovesCheck = filterPinnedMoves(dicMovesCheck);
                        checkCheckMate(dicMovesCheck, kingPos);
                        document.removeEventListener('click', holdPromotion);
                        
                        promotionDone = true;
                        resolve(true);
                    }
                    if (clicked.target.id === "w-btn-cancel-promotion") {
                        curBoard[old_i][old_j] = ['♟', 'w', false];
                        whoseTurn = 'w';
                        divProm.style.display = "none";
                        refreshBoard();
                        document.removeEventListener('click', holdPromotion);
                        
                        resolve(true);
                    }
                });
            }
            else if (i === '7') {
                promotionDone = false;
                //black pawn promotion
                divProm = document.getElementById('b-pawn-promotion');
                divProm.style.display = "flex";
                divPromChoices = document.getElementById('b-promotion-choices');
                divPromChoices.style.left = String(80*(7-j)-320) + "px";
                document.addEventListener('click', function holdPromotion(clicked) {
                    if (clicked.target.id.slice(0,9) === 'promotion') {
                        promotionPiece = dicPromotion[clicked.target.id.slice(10,14)];
                        curBoard[i][j] = [promotionPiece, 'b'];
                        divProm.style.display = "none";
                        lastMove = ['♟', [old_i, old_j], [i,j]];
                        refreshBoard();
                        //check if the promotion makes a check
                        let [mate, kingPos] = mateCheck();
                        if (mate) {
                            kingCheck = true;
                            mateKingSquare = document.getElementById("square-" + String(kingPos[0]) + String(kingPos[1]));
                            mateKingSquare.classList.add('square-red');
                        }
                        let [dicMovesCheck, disallowKingSquareCheck] = possibleMoves();
                        dicMovesCheck = addPossibleMovesKing(dicMovesCheck, disallowKingSquareCheck);
                        dicMovesCheck = filterPinnedMoves(dicMovesCheck);
                        checkCheckMate(dicMovesCheck, kingPos);
                        document.removeEventListener('click', holdPromotion);
                        
                        promotionDone = true;
                        resolve(true);
                    }
                    if (clicked.target.id === "b-btn-cancel-promotion" || clicked.target.id(0,9) != 'promotion') {
                        curBoard[old_i][old_j] = ['♟', 'b', false];
                        whoseTurn = 'b';
                        divProm.style.display = "none";
                        refreshBoard();
                        document.removeEventListener('click', holdPromotion);
                        
                        resolve(true);
                    }
                });
            }
            else {
                if (curBoard[i][j][0] === '' && (parseInt(j)+1 === parseInt(old_j) || parseInt(j)-1 === parseInt(old_j))) {
                    if (parseInt(i)+1 === parseInt(old_i)) curBoard[old_i][j] = [''];
                    if (parseInt(i)-1 === parseInt(old_i)) curBoard[old_i][j] = [''];
                }
                curBoard[i][j] = ['♟', whoseTurn, false];
                lastMove = ['♟', [old_i, old_j], [i,j]];
                resolve(false);
            }
        }
        else {
            if (piece === '♚') {
                curBoard[i][j] = [piece, whoseTurn];
                //castle right
                if (j - toMove[1] === 2) {
                    curBoard[toMove[0]][parseInt(toMove[1])+1] = ['♜', whoseTurn];
                    curBoard[toMove[0]][7] = [''];
                    castle[whoseTurn + 'right'] = false;
                }
                //castle left
                else if (j - toMove[1] === -2) {
                    curBoard[toMove[0]][parseInt(toMove[1])-1] = ['♜', whoseTurn];
                    curBoard[toMove[0]][0] = [''];
                    castle[whoseTurn + 'left'] = false;
                }
                //normal move that then prevents castling
                else {
                    castle[whoseTurn + 'left'] = false;
                    castle[whoseTurn + 'right'] = false;
                }
                lastMove = ['♚', [old_i, old_j], [i, j]];
                document.getElementById('square-' + old_i + old_j).classList.remove('square-red');
            }
            if (piece === '♜') {
                //prevent castling with the rook that is about to move
                if (old_j === '0') castle[whoseTurn + 'left'] = false;
                if (old_j === '7') castle[whoseTurn + 'right'] = false;
            }
            curBoard[i][j] = [piece, whoseTurn];
            lastMove = [piece, [old_i, old_j], [i, j]];
            resolve(false);
        }
        
        let [kingI, kingJ] = findKing(whoseTurn);
        document.getElementById('square-' + String(kingI) + String(kingJ)).classList.remove('square-red');
        kingCheck = false;
        //remove the piece from its original square
        curBoard[toMove[0]][toMove[1]] = [''];
        toMove = [];
    });
}

document.addEventListener('click', function(clicked) {
    clearShownLegalMoves();
    refreshBoard();
    if (['piece','squar'].includes(clicked.target.id.slice(0,5))) {
        let [dicMoves, disallowKingSquare] = possibleMoves();
        dicMoves = addPossibleMovesKing(dicMoves, disallowKingSquare);
        dicMoves = filterPinnedMoves(dicMoves);
        let i = clicked.target.id[7];
        let j = clicked.target.id[8];
        shownMoves = dicMoves[[i,j]];
        
        if (clicked.target.classList.contains("allowed-move")) {
            //a legal square has been clicked on : move the piece to this square
            //first remove the pointer class
            divSquareMovedPiece = document.getElementById("square-" + String(toMove[0]) + String(toMove[1]));
            divSquareMovedPiece.classList.remove("pointer");
            
            makeMove(i,j).then((resPromise) => {
                if (!resPromise || (resPromise && promotionDone)) {
                    refreshBoard();
                    whoseTurn = nextPlayer(whoseTurn);
                
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

                    if (mode === "friend" && !gameOver) flipBoard();
                    if (mode === "zenbot" && !gameOver) {
                        playZenBotMove(zenBotMode);
                    }
                }
            });
        }
        else {      
            //fixed: Allow any piece to move if it has legal moves (filterPinnedMoves handles check restrictions)
            if ((mode === 'friend' || (mode === 'zenbot' && whoseTurn != zenBotColor)) && clicked.target.id.slice(0,5) === 'piece' && clicked.target.id[6] === whoseTurn && dicMoves[[i,j]].length != 0) {
                document.getElementById('svg-background').classList.add('clip-board');
                
                //make legal moves appear if what has been clicked is a piece belonging to the player whose turn it is to play
                for (let x of shownMoves) {
                    let divSquare = document.getElementById("square-" + String(x[0]) + String(x[1]));
                    divSquare.innerHTML = "<span class='square prevent-select allowed-move' id='piece-" + whoseTurn + String(x[0]) + String(x[1]) + "'>" + curBoard[String(x[0])][String(x[1])][0] + "</span>";
                    divSquare.classList.add("pointer");
                    divSquare.classList.add("allowed-move");
                    if (whoseTurn === 'b') divSquare.querySelector('span').classList.add("white-piece");
                }
                toMove = [i,j];
            }
        }
    }
}, true);

function findKing(color) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (curBoard[i][j][0] === '♚' && curBoard[i][j][1] === color) return [i,j];
        }
    }
}

//change player turn
function nextPlayer(whoseTurn) {
    return whoseTurn === 'w' ? 'b' : 'w'
}

//check if the king is in check
function mateCheck() {
    let [_, disallowKingSquare] = possibleMoves();
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (curBoard[i][j][0] === '♚' && curBoard[i][j][1] === whoseTurn) {
                return [isSquareUnderAttack(i, j, nextPlayer(whoseTurn), disallowKingSquare), [i,j]];
            }
        }
    }
}

//show a message if there is checkMate
function checkCheckMate(dicMoves, kingPos) {
    let kingKey = kingPos.join(',');
    
    if (dicMoves[kingKey] && dicMoves[kingKey].length === 0 && Object.keys(dicMoves).every(key => {
        let coords = key.split(',');
        if (curBoard[parseInt(coords[0])][parseInt(coords[1])][1] === whoseTurn) {
            return dicMoves[key].length === 0;
        }
        else return true;
    })) {
        if (kingCheck) {
            gameOverMessage(true, false);
            return true;
        }
        else {  
            gameOverMessage(false, false); 
            return true  
        }   
    }

    return false;
}


function flipBoard() {
    const board = document.getElementById('chess-board');
    if (board.style.transform === 'rotate(180deg)') {
        board.style.transform = 'rotate(0deg)';
        document.querySelectorAll('.square').forEach(square => {
            square.style.transform = 'rotate(0deg)';
        });
    } else {
        board.style.transform = 'rotate(180deg)';
        document.querySelectorAll('.square').forEach(square => {
            square.style.transform = 'rotate(180deg)';
        });
    }
}

function onload() {
    initBoard();
}

window.onload = onload();