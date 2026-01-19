//calculate every possible moves and store them into a dictonary containing each piece's accesible square 
function possibleMoves() {
    let dicMoves = {};

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let moves = [];

            if (curBoard[i][j][0] === '♜') {
                for (k = i+1; k < 8; k++) {
                    if (curBoard[k][j][0] === '') {
                        moves.push([k,j]);
                    }
                    else break;
                }
                for (k = i-1; k >= 0; k--) {
                    if (curBoard[k][j][0] === '') {
                        moves.push([k,j]);
                    }
                    else break;
                }
                for (k = j+1; k < 8; k++) {
                    if (curBoard[i][k][0] === '') {
                        moves.push([i,k]);
                    }
                    else break;
                }
                for (k = j-1; k >= 0; k--) {
                    if (curBoard[i][k][0] === '') {
                        moves.push([i,k]);
                    }
                    else break;
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
                    if (tabPieces.includes(curBoard[i-1][j+1])) {
                        moves.push([i-1,j+1])
                    }
                    if (tabPieces.includes(curBoard[i-1][j-1])) {
                        moves.push([i-1,j-1])
                    }
                }
                else {
                    if (i < 7 && curBoard[i+1][j][0] === '') {
                        moves.push([i+1,j]);
                        if (curBoard[i][j][2] && curBoard[i+2][j][0] === '') {
                            moves.push([i+2,j]);
                        }
                    }
                    try {
                        if (tabPieces.includes(curBoard[i-1][j+1])) {
                            moves.push([i-1,j+1])
                        }
                    } catch(err) {console.log("no" + err);}
                    try {
                        if (tabPieces.includes(curBoard[i-1][j-1])) {
                            moves.push([i-1,j-1])
                        }
                    } catch(err) {console.log("no" + err);}
                }
            }

            else if (curBoard[i][j][0] === '♞') {
                let knightMoves = [[i+2,j+1], [i+2,j-1], [i-2,j+1], [i-2,j-1],
                                   [i+1,j+2], [i+1,j-2], [i-1,j+2], [i-1,j-2]];
                for (k = 0; k < knightMoves.length; k++) {
                    let ni = knightMoves[k][0];
                    let nj = knightMoves[k][1];
                    if (ni >= 0 && ni < 8 && nj >= 0 && nj < 8 && curBoard[ni][nj][0] === '') {
                        moves.push([ni,nj]);
                    }
                }
            }

            else if (curBoard[i][j][0] === '♝') {
                for (k = 1; i+k < 8 && j+k < 8; k++) {
                    if (curBoard[i+k][j+k][0] === '') {
                        moves.push([i+k,j+k]);
                    }
                    else break;
                }
                for (k = 1; i+k < 8 && j-k >= 0; k++) {
                    if (curBoard[i+k][j-k][0] === '') {
                        moves.push([i+k,j-k]);
                    }
                    else break;
                }
                for (k = 1; i-k >= 0 && j+k < 8; k++) {
                    if (curBoard[i-k][j+k][0] === '') {
                        moves.push([i-k,j+k]);
                    }
                    else break;
                }
                for (k = 1; i-k >= 0 && j-k >= 0; k++) {
                    if (curBoard[i-k][j-k][0] === '') {
                        moves.push([i-k,j-k]);
                    }
                    else break;
                }
            }
            else if (curBoard[i][j][0] === '♛') {
                //rook-like moves
                for (k = i+1; k < 8; k++) {
                    if (curBoard[k][j][0] === '') {
                        moves.push([k,j]);
                    }
                    else break;
                }
                for (k = i-1; k >= 0; k--) {
                    if (curBoard[k][j][0] === '') {
                        moves.push([k,j]);
                    }
                    else break;
                }
                for (k = j+1; k < 8; k++) {
                    if (curBoard[i][k][0] === '') {
                        moves.push([i,k]);
                    }
                    else break;
                }
                for (k = j-1; k >= 0; k--) {
                    if (curBoard[i][k][0] === '') {
                        moves.push([i,k]);
                    }
                    else break;
                }

                //bishop-like moves
                for (k = 1; i+k < 8 && j+k < 8; k++) {
                    if (curBoard[i+k][j+k][0] === '') {
                        moves.push([i+k,j+k]);
                    }
                    else break;
                }
                for (k = 1; i+k < 8 && j-k >= 0; k++) {
                    if (curBoard[i+k][j-k][0] === '') {
                        moves.push([i+k,j-k]);
                    }
                    else break;
                }
                for (k = 1; i-k >= 0 && j+k < 8; k++) {
                    if (curBoard[i-k][j+k][0] === '') {
                        moves.push([i-k,j+k]);
                    }
                    else break;
                }
                for (k = 1; i-k >= 0 && j-k >= 0; k++) {
                    if (curBoard[i-k][j-k][0] === '') {
                        moves.push([i-k,j-k]);
                    }
                    else break;
                }
            }

            else if (curBoard[i][j][0] === '♚') {
                let kingMoves = [[i+1,j], [i-1,j], [i,j+1], [i,j-1],
                                 [i+1,j+1], [i+1,j-1], [i-1,j+1], [i-1,j-1]];
                for (k = 0; k < kingMoves.length; k++) {
                    let ni = kingMoves[k][0];
                    let nj = kingMoves[k][1];
                    if (ni >= 0 && ni < 8 && nj >= 0 && nj < 8 && curBoard[ni][nj][0] === '') {
                        moves.push([ni,nj]);
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
            }

            dicMoves[[i,j]] = moves;
        }
    }
    return dicMoves;
}