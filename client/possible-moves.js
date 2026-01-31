//calculate every possible moves and store them into a dictonary containing each piece's accesible square 
function possibleMoves() {

    let dicMoves = {};
    let disallowKingSquare = {};

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let moves = [];
            let disallowKing = [];

            if (curBoard[i][j][0] === '♜') {
                for (k = i+1; k < 8; k++) {
                    if (curBoard[k][j][0] === '') {
                        disallowKing.push([k,j]);
                        if (curBoard[i][j][1] === whoseTurn) {
                            moves.push([k,j]);
                        }
                    }
                    else {
                        disallowKing.push([k,j]);
                        if (curBoard[i][j][1] === whoseTurn && curBoard[k][j][1] !== whoseTurn) {
                            moves.push([k,j]);
                        }
                        if (curBoard[k][j][0] === '♚') disallowKing.push([k+1,j]);
                        break;
                    }
                }
                for (k = i-1; k >= 0; k--) {
                    if (curBoard[k][j][0] === '') {
                        disallowKing.push([k,j]);
                        if (curBoard[i][j][1] === whoseTurn) {
                            moves.push([k,j]);
                        }
                    }
                    else {
                        disallowKing.push([k,j]);
                        if (curBoard[i][j][1] === whoseTurn && curBoard[k][j][1] !== whoseTurn) {
                            moves.push([k,j]);
                        }
                        if (curBoard[k][j][0] === '♚') disallowKing.push([k-1,j]);
                        break;
                    }
                }
                for (k = j+1; k < 8; k++) {
                    if (curBoard[i][k][0] === '') {
                        disallowKing.push([i,k]);
                        if (curBoard[i][j][1] === whoseTurn) {
                            moves.push([i,k]);
                        }
                    }
                    else {
                        disallowKing.push([i,k]);
                        if (curBoard[i][j][1] === whoseTurn && curBoard[i][k][1] !== whoseTurn) {
                            moves.push([i,k]);
                        }
                        if (curBoard[i][k][0] === '♚') disallowKing.push([i,k+1]);
                        break;
                    }
                }
                for (k = j-1; k >= 0; k--) {
                    if (curBoard[i][k][0] === '') {
                        disallowKing.push([i,k]);
                        if (curBoard[i][j][1] === whoseTurn) {
                            moves.push([i,k]);
                        }
                    }
                    else {
                        disallowKing.push([i,k]);
                        if (curBoard[i][j][1] === whoseTurn && curBoard[i][k][1] !== whoseTurn) {
                            moves.push([i,k]);
                        }
                        if (curBoard[i][k][0] === '♚') disallowKing.push([i,k-1]);
                        break;
                    }
                }
            }

            else if (curBoard[i][j][0] === '♟') {
                if (curBoard[i][j][1] === 'w') {
                    if (i-1 >= 0 && j-1 >= 0) {
                        disallowKing.push([i-1,j-1]);
                    }
                    if (i-1 >=0 && j+1 <= 7) {
                        disallowKing.push([i-1,j+1]);
                    }
                    if (curBoard[i][j][1] === whoseTurn) {
                        if (i > 0 && curBoard[i-1][j][0] === '') {
                            moves.push([i-1,j]);
                            if (curBoard[i][j][2] && i > 1 && curBoard[i-2][j][0] === '') {
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
                    if (lastMove != null && i === 3 && lastMove[0] === '♟' && lastMove[1][0] === '1' && lastMove[2][0] === '3') {
                        if (j > 0 && lastMove[1][1] === String(j-1)) moves.push([i-1,j-1]);
                        if (j < 7 && lastMove[1][1] === String(j+1)) moves.push([i-1,j+1]);
                    }
                }
                else {
                    if (i+1 <= 7 && j-1 >= 0) {
                        disallowKing.push([i+1,j-1]);
                    }
                    if (i+1 <= 7 && j+1 <= 7) {
                        disallowKing.push([i+1,j+1]);
                    }
                    if (curBoard[i][j][1] === whoseTurn) {
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
                    if (lastMove != null && i === 4 && lastMove[0] === '♟' && lastMove[1][0] === '6' && lastMove[2][0] === '4') {
                        if (j > 0 && lastMove[1][1] === String(j-1)) moves.push([i+1,j-1]);
                        if (j < 7 && lastMove[1][1] === String(j+1)) moves.push([i+1,j+1]);
                    }
                }
            }

            else if (curBoard[i][j][0] === '♞') {
                let knightMoves = [[i+2,j+1], [i+2,j-1], [i-2,j+1], [i-2,j-1],
                                   [i+1,j+2], [i+1,j-2], [i-1,j+2], [i-1,j-2]];
                for (k = 0; k < knightMoves.length; k++) {
                    let ni = knightMoves[k][0];
                    let nj = knightMoves[k][1];
                    if (ni >= 0 && ni < 8 && nj >= 0 && nj < 8) {
                        disallowKing.push([ni,nj]);
                        if (curBoard[i][j][1] === whoseTurn && (curBoard[ni][nj][0] === '' || (curBoard[ni][nj] != '' && curBoard[ni][nj][1] != whoseTurn))) {
                            moves.push([ni,nj]);
                        }
                    }
                }
            }

            else if (curBoard[i][j][0] === '♝') {
                for (k = 1; i+k < 8 && j+k < 8; k++) {
                    if (curBoard[i+k][j+k][0] === '') {
                        disallowKing.push([i+k,j+k]);
                        if (curBoard[i][j][1] === whoseTurn) {
                            moves.push([i+k,j+k]);
                        }
                    }
                    else {
                        disallowKing.push([i+k,j+k]);
                        if (curBoard[i][j][1] === whoseTurn && curBoard[i+k][j+k][1] !== whoseTurn) {
                            moves.push([i+k,j+k]);
                        }
                        if (curBoard[i+k][j+k][0] === '♚') disallowKing.push([i+k+1,j+k+1]);
                        break;
                    }
                }
                for (k = 1; i+k < 8 && j-k >= 0; k++) {
                    if (curBoard[i+k][j-k][0] === '') {
                        disallowKing.push([i+k,j-k]);
                        if (curBoard[i][j][1] === whoseTurn) {
                            moves.push([i+k,j-k]);
                        }
                    }
                    else {
                        disallowKing.push([i+k,j-k]);
                        if (curBoard[i][j][1] === whoseTurn && curBoard[i+k][j-k][1] !== whoseTurn) {
                            moves.push([i+k,j-k]);
                        }
                        if (curBoard[i+k][j-k][0] === '♚') disallowKing.push([i+k+1,j-k-1]);
                        break;
                    }
                }
                for (k = 1; i-k >= 0 && j+k < 8; k++) {
                    if (curBoard[i-k][j+k][0] === '') {
                        disallowKing.push([i-k,j+k]);
                        if (curBoard[i][j][1] === whoseTurn) {
                            moves.push([i-k,j+k]);
                        }
                    }
                    else {
                        disallowKing.push([i-k,j+k]);
                        if (curBoard[i][j][1] === whoseTurn && curBoard[i-k][j+k][1] !== whoseTurn) {
                            moves.push([i-k,j+k]);
                        }
                        if (curBoard[i-k][j+k][0] === '♚') disallowKing.push([i-k-1,j+k+1]);
                        break;
                    }
                }
                for (k = 1; i-k >= 0 && j-k >= 0; k++) {
                    if (curBoard[i-k][j-k][0] === '') {
                        disallowKing.push([i-k,j-k]);
                        if (curBoard[i][j][1] === whoseTurn) {
                            moves.push([i-k,j-k]);
                        }
                    }
                    else {
                        disallowKing.push([i-k,j-k]);
                        if (curBoard[i][j][1] === whoseTurn && curBoard[i-k][j-k][1] !== whoseTurn) {
                            moves.push([i-k,j-k]);
                        }
                        if (curBoard[i-k][j-k][0] === '♚') disallowKing.push([i-k-1,j-k-1]);
                        break;
                    }
                }
            }
            else if (curBoard[i][j][0] === '♛') {
                for (k = i+1; k < 8; k++) {
                    if (curBoard[k][j][0] === '') {
                        disallowKing.push([k,j]);
                        if (curBoard[i][j][1] === whoseTurn) {
                            moves.push([k,j]);
                        }
                    }
                    else {
                        disallowKing.push([k,j]);
                        if (curBoard[i][j][1] === whoseTurn && curBoard[k][j][1] !== whoseTurn) {
                            moves.push([k,j]);
                        }
                        if (curBoard[k][j][0] === '♚') disallowKing.push([k+1,j]);
                        break;
                    }
                }
                for (k = i-1; k >= 0; k--) {
                    if (curBoard[k][j][0] === '') {
                        disallowKing.push([k,j]);
                        if (curBoard[i][j][1] === whoseTurn) {
                            moves.push([k,j]);
                        }
                    }
                    else {
                        disallowKing.push([k,j]);
                        if (curBoard[i][j][1] === whoseTurn && curBoard[k][j][1] !== whoseTurn) {
                            moves.push([k,j]);
                        }
                        if (curBoard[k][j][0] === '♚') disallowKing.push([k-1,j]);
                        break;
                    }
                }
                for (k = j+1; k < 8; k++) {
                    if (curBoard[i][k][0] === '') {
                        disallowKing.push([i,k]);
                        if (curBoard[i][j][1] === whoseTurn) {
                            moves.push([i,k]);
                        }
                    }
                    else {
                        disallowKing.push([i,k]);
                        if (curBoard[i][j][1] === whoseTurn && curBoard[i][k][1] !== whoseTurn) {
                            moves.push([i,k]);
                        }
                        if (curBoard[i][k][0] === '♚') disallowKing.push([i,k+1]);
                        break;
                    }
                }
                for (k = j-1; k >= 0; k--) {
                    if (curBoard[i][k][0] === '') {
                        disallowKing.push([i,k]);
                        if (curBoard[i][j][1] === whoseTurn) {
                            moves.push([i,k]);
                        }
                    }
                    else {
                        disallowKing.push([i,k]);
                        if (curBoard[i][j][1] === whoseTurn && curBoard[i][k][1] !== whoseTurn) {
                            moves.push([i,k]);
                        }
                        if (curBoard[i][k][0] === '♚') disallowKing.push([i,k-1]);
                        break;
                    }
                }

                for (k = 1; i+k < 8 && j+k < 8; k++) {
                    if (curBoard[i+k][j+k][0] === '') {
                        disallowKing.push([i+k,j+k]);
                        if (curBoard[i][j][1] === whoseTurn) {
                            moves.push([i+k,j+k]);
                        }
                    }
                    else {
                        disallowKing.push([i+k,j+k]);
                        if (curBoard[i][j][1] === whoseTurn && curBoard[i+k][j+k][1] !== whoseTurn) {
                            moves.push([i+k,j+k]);
                        }
                        if (curBoard[i+k][j+k][0] === '♚') disallowKing.push([i+k+1,j+k+1]);
                        break;
                    }
                }
                for (k = 1; i+k < 8 && j-k >= 0; k++) {
                    if (curBoard[i+k][j-k][0] === '') {
                        disallowKing.push([i+k,j-k]);
                        if (curBoard[i][j][1] === whoseTurn) {
                            moves.push([i+k,j-k]);
                        }
                    }
                    else {
                        disallowKing.push([i+k,j-k]);
                        if (curBoard[i][j][1] === whoseTurn && curBoard[i+k][j-k][1] !== whoseTurn) {
                            moves.push([i+k,j-k]);
                        }
                        if (curBoard[i+k][j-k][0] === '♚') disallowKing.push([i+k+1,j-k-1]);
                        break;
                    }
                }
                for (k = 1; i-k >= 0 && j+k < 8; k++) {
                    if (curBoard[i-k][j+k][0] === '') {
                        disallowKing.push([i-k,j+k]);
                        if (curBoard[i][j][1] === whoseTurn) {
                            moves.push([i-k,j+k]);
                        }
                    }
                    else {
                        disallowKing.push([i-k,j+k]);
                        if (curBoard[i][j][1] === whoseTurn && curBoard[i-k][j+k][1] !== whoseTurn) {
                            moves.push([i-k,j+k]);
                        }
                        if (curBoard[i-k][j+k][0] === '♚') disallowKing.push([i-k-1,j+k+1]);
                        break;
                    }
                }
                for (k = 1; i-k >= 0 && j-k >= 0; k++) {
                    if (curBoard[i-k][j-k][0] === '') {
                        disallowKing.push([i-k,j-k]);
                        if (curBoard[i][j][1] === whoseTurn) {
                            moves.push([i-k,j-k]);
                        }
                    }
                    else {
                        disallowKing.push([i-k,j-k]);
                        if (curBoard[i][j][1] === whoseTurn && curBoard[i-k][j-k][1] !== whoseTurn) {
                            moves.push([i-k,j-k]);
                        }
                        if (curBoard[i-k][j-k][0] === '♚') disallowKing.push([i-k-1,j-k-1]);
                        break;
                    }
                }
            }

            dicMoves[[i,j]] = moves;
            disallowKingSquare[[i,j]] = disallowKing;
        }
    }

    return [dicMoves, disallowKingSquare];
}

function isSquareUnderAttack(ni, nj, byWho, disallowKingSquare) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            disallowSquares = disallowKingSquare[[i,j]];
            if (curBoard[i][j][1] === byWho) {
                for (let move of disallowSquares) {
                    if (move[0] === ni && move[1] === nj) return true
                }
            }
        }
    }

    return false;
}

function isPiecePinned(pieceI, pieceJ, moveI, moveJ) {
    let tempBoard = JSON.parse(JSON.stringify(curBoard));
    let pieceData = tempBoard[pieceI][pieceJ];
    tempBoard[moveI][moveJ] = pieceData;
    tempBoard[pieceI][pieceJ] = [''];
    
    let kingI, kingJ;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (tempBoard[i][j][0] === '♚' && tempBoard[i][j][1] === whoseTurn) {
                kingI = i;
                kingJ = j;
                break;
            }
        }
    }
    
    let originalBoard = curBoard;
    curBoard = tempBoard;
    let [_, disallowKingSquare] = possibleMoves();
    curBoard = originalBoard;
    
    return isSquareUnderAttack(kingI, kingJ, nextPlayer(whoseTurn), disallowKingSquare);
}

function filterPinnedMoves(dicMoves) {
    let filteredMoves = {};
    for (let key in dicMoves) {
        let [i, j] = key.split(',').map(x => parseInt(x));
        if (curBoard[i][j][1] === whoseTurn && curBoard[i][j][0] !== '♚') {
            let validMoves = [];
            for (let move of dicMoves[key]) {
                if (!isPiecePinned(i, j, move[0], move[1])) {
                    validMoves.push(move);
                }
            }
            filteredMoves[key] = validMoves;
        } else {
            filteredMoves[key] = dicMoves[key];
        }
    }
    return filteredMoves;
}

function addPossibleMovesKing(dicMoves, disallowKingSquare) {
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
                        if (!isSquareUnderAttack(ni,nj,nextPlayer(whoseTurn), disallowKingSquare) && (curBoard[ni][nj][0] === '' || (curBoard[ni][nj][0] != '' && curBoard[ni][nj][1] != whoseTurn))) {
                            moves.push([ni,nj]);
                        }
                    }
                }

                if (curBoard[i][j][1] === 'w' && i === 7 && j === 4) {
                    if (castle['wright'] && curBoard[i][j+1][0] === '' && curBoard[i][j+2][0] === '' && curBoard[i][j+3][0] === '♜' && curBoard[i][j+3][1] === 'w' && !isSquareUnderAttack(i,j,nextPlayer(whoseTurn), disallowKingSquare) && !isSquareUnderAttack(i,j+1,nextPlayer(whoseTurn), disallowKingSquare) && !isSquareUnderAttack(i,j+2,nextPlayer(whoseTurn), disallowKingSquare)) {
                        moves.push([i,j+2]);
                    }
                    if (castle['wleft'] && curBoard[i][j-1][0] === '' && curBoard[i][j-2][0] === '' && curBoard[i][j-3][0] === '' && curBoard[i][j-4][0] === '♜'  && curBoard[i][j-4][1] === 'w' && !isSquareUnderAttack(i,j,nextPlayer(whoseTurn), disallowKingSquare) && !isSquareUnderAttack(i,j-1,nextPlayer(whoseTurn), disallowKingSquare) && !isSquareUnderAttack(i,j-2,nextPlayer(whoseTurn), disallowKingSquare)) {
                        moves.push([i,j-2]);
                    }
                }

                if (curBoard[i][j][1] === 'b' && i === 0 && j === 4) {
                    if (castle['bright'] && curBoard[i][j+1][0] === '' && curBoard[i][j+2][0] === '' && curBoard[i][j+3][0] === '♜' && curBoard[i][j+3][1] === 'b' && !isSquareUnderAttack(i,j,nextPlayer(whoseTurn), disallowKingSquare) && !isSquareUnderAttack(i,j+1,nextPlayer(whoseTurn), disallowKingSquare) && !isSquareUnderAttack(i,j+2,nextPlayer(whoseTurn), disallowKingSquare)) {
                        moves.push([i,j+2]);
                    }
                    if (castle['bleft'] && curBoard[i][j-1][0] === '' && curBoard[i][j-2][0] === '' && curBoard[i][j-3][0] === '' && curBoard[i][j-4][0] === '♜' && curBoard[i][j-4][1] === 'b' && !isSquareUnderAttack(i,j,nextPlayer(whoseTurn), disallowKingSquare) && !isSquareUnderAttack(i,j-1,nextPlayer(whoseTurn), disallowKingSquare) && !isSquareUnderAttack(i,j-2,nextPlayer(whoseTurn), disallowKingSquare)) {
                        moves.push([i,j-2]);
                    }
                }
                
                dicMoves[[i,j]] = moves;
            }
        }
    }

    return dicMoves;
}