import numpy as np
import chess
import chess.engine
import time
from raw_data_position import positions

dic_piece_ind = {'P': 0, 'N': 1, 'B': 2, 'R': 3, 'Q': 4, 'K': 5}

def board_to_tensor(board):
    """
    Plane-representation of fen position:
    - Planes 0-5: white pieces (in the order : pawn, knight, bishop, rook, queen, king)
    - Planes 6-11: black pieces
    - Plane 12: turn (1 for white, 0 for black)
    - Plane 13: white castling kingside
    - Plane 14: white castling queenside
    - Plane 15: white castling kingside
    - Plane 16: white castling queenside
    """

    tensor = np.zeros((17,8,8), dtype=np.float32)

    for square in chess.SQUARES:
        piece = board.piece_at(square)
        
        if piece is not None:
            plane_ind = dic_piece_ind[board.piece_at(square).symbol().upper()]
            rank = chess.square_rank(square)
            file = chess.square_file(square)

            if board.piece_at(square).color:
                tensor[plane_ind][rank][file] = 1.0
            else:
                tensor[6 + plane_ind][rank][file] = 1.0

    tensor[12] = board.turn
    tensor[13] = board.has_kingside_castling_rights(chess.WHITE)
    tensor[14] = board.has_kingside_castling_rights(chess.WHITE)
    tensor[15] = board.has_kingside_castling_rights(chess.BLACK)
    tensor[16] = board.has_kingside_castling_rights(chess.BLACK)

    return tensor


def do_prepare_data():
    nsamples = len(positions)
    X = np.zeros((nsamples, 17, 8, 8))
    Y = np.zeros(nsamples)
    
    for i, fen in enumerate(positions, start=0):
        board = chess.Board(fen)

        X[i] = board_to_tensor(board)

        engine = chess.engine.SimpleEngine.popen_uci("C:/Users/loupa/Downloads/stockfish-windows-x86-64-avx2/stockfish/stockfish-windows-x86-64-avx2.exe")
        info = engine.analyse(board, chess.engine.Limit(depth=20))
        engine.quit()
        Y[i] = info['score'].relative.score()
        print("\r{} / 100 converted data".format(i+1), end='')

    np.save('zenbot/eval_nn/X_data.npy', X)
    np.save('zenbot/eval_nn/Y_data.npy', Y)

   

if __name__ == '__main__':
    do_prepare_data()