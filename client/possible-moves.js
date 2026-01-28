//calculate every possible moves and store them into a dictonary containing each piece's accesible square 
function possibleMoves() {
    let dicMoves = {};

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let moves = [];

            if (curBoard[i][j][0] === '♜') {
                for (k = i+1; k < 8; k++) {
                    if (curBoard[k][j][0] === '') moves.push([k,j]);
                    else {
                        if (curBoard[k][j][1] != whoseTurn) moves.push([k,j]);
                        break;
                    }
                }
                for (k = i-1; k >= 0; k--) {
                    if (curBoard[k][j][0] === '') moves.push([k,j]);
                    else {
                        if (curBoard[k][j][1] != whoseTurn) moves.push([k,j]);
                        break;
                    }
                }
                for (k = j+1; k < 8; k++) {
                    if (curBoard[i][k][0] === '') moves.push([i,k]);
                    else {
                        if (curBoard[i][k][1] != whoseTurn) moves.push([i,k]);
                        break;
                    }
                }
                for (k = j-1; k >= 0; k--) {
                    if (curBoard[i][k][0] === '') moves.push([i,k]);
                    else {
                        if (curBoard[i][k][1] != whoseTurn) moves.push([i,k]);
                        break;
                    }
                }
            }

            else if (curBoard[i][j][0] === '♟') {
                if (curBoard[i][j][1] === 'w') {
                    if (i > 1 && curBoard[i-1][j][0] === '') {
                        moves.push([i-1,j]);
                        if (curBoard[i][j][2] && curBoard[i-2][j][0] === '') {
                            moves.push([i-2,j]);
                        }
                    }
                    if (i-1 >= 0 && j-1 >= 0 && tabPieces.includes(curBoard[i-1][j-1][0]) && curBoard[i-1][j-1][1] === 'b') {
                        moves.push([i-1,j-1]);
                    }
                    if (i-1 >=0 && j+1 <= 7 && tabPieces.includes(curBoard[i-1][j+1][0]) && curBoard[i-1][j+1][1] === 'b') {
                        moves.push([i-1,j+1]);
                    }
                }
                else {
                    if (i < 7 && curBoard[i+1][j][0] === '') {
                        moves.push([i+1,j]);
                        if (curBoard[i][j][2] && curBoard[i+2][j][0] === '') {
                            moves.push([i+2,j]);
                        }
                    }
                    if (i+1 <= 7 && j-1 >= 0 && tabPieces.includes(curBoard[i+1][j-1][0]) && curBoard[i+1][j-1][1] === 'w') {
                        moves.push([i+1,j-1]);
                    }
                    if (i+1 <= 7 && j+1 <= 7 && tabPieces.includes(curBoard[i+1][j+1][0]) && curBoard[i+1][j+1][1] === 'w') {
                        moves.push([i+1,j+1]);
                    }
                }
            }

            else if (curBoard[i][j][0] === '♞') {
                let knightMoves = [[i+2,j+1], [i+2,j-1], [i-2,j+1], [i-2,j-1],
                                   [i+1,j+2], [i+1,j-2], [i-1,j+2], [i-1,j-2]];
                for (k = 0; k < knightMoves.length; k++) {
                    let ni = knightMoves[k][0];
                    let nj = knightMoves[k][1];
                    if (ni >= 0 && ni < 8 && nj >= 0 && nj < 8 && (curBoard[ni][nj][0] === '' || (curBoard[ni][nj] != '' && curBoard[ni][nj][1] != whoseTurn))) {
                        moves.push([ni,nj]);
                    }
                }
            }

            else if (curBoard[i][j][0] === '♝') {
                for (k = 1; i+k < 8 && j+k < 8; k++) {
                    if (curBoard[i+k][j+k][0] === '') moves.push([i+k,j+k]);
                    else {
                        if (curBoard[i+k][j+k][1] != whoseTurn) {
                            moves.push([i+k,j+k]);
                        }
                        break;
                    }
                }
                for (k = 1; i+k < 8 && j-k >= 0; k++) {
                    if (curBoard[i+k][j-k][0] === '') moves.push([i+k,j-k]);
                    else {
                        if (curBoard[i+k][j-k][1] != whoseTurn) {
                            moves.push([i+k,j-k]);
                        }
                        break;
                    }
                }
                for (k = 1; i-k >= 0 && j+k < 8; k++) {
                    if (curBoard[i-k][j+k][0] === '') moves.push([i-k,j+k]);
                    else {
                        if (curBoard[i-k][j+k][1] != whoseTurn) {
                            moves.push([i-k,j+k]);
                        }
                        break;
                    }
                }
                for (k = 1; i-k >= 0 && j-k >= 0; k++) {
                    if (curBoard[i-k][j-k][0] === '') moves.push([i-k,j-k]);
                    else {
                        if (curBoard[i-k][j-k][1] != whoseTurn) {
                            moves.push([i-k,j-k]);
                        }
                        break;
                    }
                }
            }
            else if (curBoard[i][j][0] === '♛') {
                //rook-like moves
                for (k = i+1; k < 8; k++) {
                    if (curBoard[k][j][0] === '') moves.push([k,j]);
                    else {
                        if (curBoard[k][j][1] != whoseTurn) moves.push([k,j]);
                        break;
                    }
                }
                for (k = i-1; k >= 0; k--) {
                    if (curBoard[k][j][0] === '') moves.push([k,j]);
                    else {
                        if (curBoard[k][j][1] != whoseTurn) moves.push([k,j]);
                        break;
                    }
                }
                for (k = j+1; k < 8; k++) {
                    if (curBoard[i][k][0] === '') moves.push([i,k]);
                    else {
                        if (curBoard[i][k][1] != whoseTurn) moves.push([i,k]);
                        break;
                    }
                }
                for (k = j-1; k >= 0; k--) {
                    if (curBoard[i][k][0] === '') moves.push([i,k]);
                    else {
                        if (curBoard[i][k][1] != whoseTurn) moves.push([i,k]);
                        break;
                    }
                }

                //bishop-like moves
                for (k = 1; i+k < 8 && j+k < 8; k++) {
                    if (curBoard[i+k][j+k][0] === '') moves.push([i+k,j+k]);
                    else {
                        if (curBoard[i+k][j+k][1] != whoseTurn) {
                            moves.push([i+k,j+k]);
                        }
                        break;
                    }
                }
                for (k = 1; i+k < 8 && j-k >= 0; k++) {
                    if (curBoard[i+k][j-k][0] === '') moves.push([i+k,j-k]);
                    else {
                        if (curBoard[i+k][j-k][1] != whoseTurn) {
                            moves.push([i+k,j-k]);
                        }
                        break;
                    }
                }
                for (k = 1; i-k >= 0 && j+k < 8; k++) {
                    if (curBoard[i-k][j+k][0] === '') moves.push([i-k,j+k]);
                    else {
                        if (curBoard[i-k][j+k][1] != whoseTurn) {
                            moves.push([i-k,j+k]);
                        }
                        break;
                    }
                }
                for (k = 1; i-k >= 0 && j-k >= 0; k++) {
                    if (curBoard[i-k][j-k][0] === '') moves.push([i-k,j-k]);
                    else {
                        if (curBoard[i-k][j-k][1] != whoseTurn) {
                            moves.push([i-k,j-k]);
                        }
                        break;
                    }
                }
            }

            dicMoves[[i,j]] = moves;
        }
    }

    return dicMoves;
}

//check is a square is unavailable for the king because under attack by byWho
function isSquareUnderAttack(ni, nj, byWho, dicMoves) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            moves = dicMoves[[i,j]];
            if (curBoard[i][j][1] === byWho) {
                for (let move of moves) {
                    if (move[0] === ni && move[1] === nj) return true
                }
            }
        }
    }

    return false;
}

//add possible moves the king can make to dicMoves, using isSquareUnderAttack()
function addPossibleMovesKing(dicMoves) {
    let moves = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (curBoard[i][j][0] === '♚' && curBoard[i][j][1] === whoseTurn) {
                let kingMoves = [[i+1,j], [i-1,j], [i,j+1], [i,j-1],
                                 [i+1,j+1], [i+1,j-1], [i-1,j+1], [i-1,j-1]];
                for (k = 0; k < kingMoves.length; k++) {
                    let ni = kingMoves[k][0];
                    let nj = kingMoves[k][1];
                    if (ni >= 0 && ni < 8 && nj >= 0 && nj < 8) {
                        if (!isSquareUnderAttack(ni,nj,nextPlayer(whoseTurn), dicMoves) && (curBoard[ni][nj][0] === '' || (curBoard[ni][nj][0] != '' && curBoard[ni][nj][1] != whoseTurn))) {
                            moves.push([ni,nj]);
                        }
                    }
                }

                //castle for white
                if (curBoard[i][j][1] === 'w' && i === 7 && j === 4) {
                    if (castle['wright'] && curBoard[i][j+1][0] === '' && curBoard[i][j+2][0] === '' && curBoard[i][j+3][0] === '♜') {
                        moves.push([i,j+2]);
                    }
                    if (castle['wleft'] && curBoard[i][j-1][0] === '' && curBoard[i][j-2][0] === '' && curBoard[i][j-3][0] === '' && curBoard[i][j-4][0] === '♜') {
                        moves.push([i,j-2]);
                    }
                }

                //castle for black
                if (curBoard[i][j][1] === 'b' && i === 0 && j === 4) {
                    if (castle['bright'] && curBoard[i][j+1][0] === '' && curBoard[i][j+2][0] === '' && curBoard[i][j+3][0] === '♜') {
                        moves.push([i,j+2]);
                    }
                    if (castle['bleft'] && curBoard[i][j-1][0] === '' && curBoard[i][j-2][0] === '' && curBoard[i][j-3][0] === '' && curBoard[i][j-4][0] === '♜') {
                        moves.push([i,j-2]);
                    }
                }

                dicMoves[[i,j]] = moves;
            }
        }
    }

    return dicMoves;
}