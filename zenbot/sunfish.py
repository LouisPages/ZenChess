#bot inspired by sunfish
#https://github.com/thomasahle/sunfish

import chess
import random
from .botclass import Bot

#opening book
import chess.polyglot
book = chess.polyglot.open_reader("zenbot/opening_book/gm2001.bin")


max_depth_to_explore = 3
quiescience_max_depth = 6
MAXSCORE = 9999999
MINSCORE = -9999999


#piece value
pc = {"P": 100, "N": 280, "B": 320, "R": 479, "Q": 929, "K": 60000}

#piece-square tables
pst = {
    'P': [   0,   0,   0,   0,   0,   0,   0,   0,
            78,  83,  86,  73, 102,  82,  85,  90,
             7,  29,  21,  44,  40,  31,  44,   7,
           -17,  16,  -2,  15,  14,   0,  15, -13,
           -26,   3,  10,   9,   6,   1,   0, -23,
           -22,   9,   5, -11, -10,  -2,   3, -19,
           -31,   8,  -7, -37, -36, -14,   3, -31,
             0,   0,   0,   0,   0,   0,   0,   0],
    'N': [ -66, -53, -75, -75, -10, -55, -58, -70,
            -3,  -6, 100, -36,   4,  62,  -4, -14,
            10,  67,   1,  74,  73,  27,  62,  -2,
            24,  24,  45,  37,  33,  41,  25,  17,
            -1,   5,  31,  21,  22,  35,   2,   0,
           -18,  10,  13,  22,  18,  15,  11, -14,
           -23, -15,   2,   0,   2,   0, -23, -20,
           -74, -23, -26, -24, -19, -35, -22, -69],
    'B': [ -59, -78, -82, -76, -23,-107, -37, -50,
           -11,  20,  35, -42, -39,  31,   2, -22,
            -9,  39, -32,  41,  52, -10,  28, -14,
            25,  17,  20,  34,  26,  25,  15,  10,
            13,  10,  17,  23,  17,  16,   0,   7,
            14,  25,  24,  15,   8,  25,  20,  15,
            19,  20,  11,   6,   7,   6,  20,  16,
            -7,   2, -15, -12, -14, -15, -10, -10],
    'R': [  35,  29,  33,   4,  37,  33,  56,  50,
            55,  29,  56,  67,  55,  62,  34,  60,
            19,  35,  28,  33,  45,  27,  25,  15,
             0,   5,  16,  13,  18,  -4,  -9,  -6,
           -28, -35, -16, -21, -13, -29, -46, -30,
           -42, -28, -42, -25, -25, -35, -26, -46,
           -53, -38, -31, -26, -29, -43, -44, -53,
           -30, -24, -18,   5,  -2, -18, -31, -32],
    'Q': [   6,   1,  -8,-104,  69,  24,  88,  26,
            14,  32,  60, -10,  20,  76,  57,  24,
            -2,  43,  32,  60,  72,  63,  43,   2,
             1, -16,  22,  17,  25,  20, -13,  -6,
           -14, -15,  -2,  -5,  -1, -10, -20, -22,
           -30,  -6, -13, -11, -16, -11, -16, -27,
           -36, -18,   0, -19, -15, -15, -21, -38,
           -39, -30, -31, -13, -31, -36, -34, -42],
    'K': [   4,  54,  47, -99, -99,  60,  83, -62,
           -32,  10,  55,  56,  56,  55,  10,   3,
           -62,  12, -57,  44, -67,  28,  37, -31,
           -55,  50,  11,  -4, -19,  13,   0, -49,
           -55, -43, -52, -28, -51, -47,  -8, -50,
           -47, -42, -43, -79, -64, -32, -29, -32,
            -4,   3, -14, -50, -57, -18,  13,   4,
            17,  30,  -3, -14,   6,  -1,  40,  18],
}

#transposition table
tt = {}


def flip_square(square):
    return square ^ 56

def get_piece_symbol(piece):
    piece_map = {
        chess.PAWN: 'P',
        chess.KNIGHT: 'N',
        chess.BISHOP: 'B',
        chess.ROOK: 'R',
        chess.QUEEN: 'Q',
        chess.KING: 'K'
    }
    return piece_map[piece.piece_type]

#simply evaluate the board with piece-square tables
#evaluation is right only in "quiescience"
def evaluate_board(board):
    outcome = board.outcome()
    if outcome is not None:
        if outcome.winner is not None:
            if outcome.winner == board.turn:
                return MAXSCORE
            else:
                return MINSCORE

    score = 0
    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece is not None:
            table_square = square if piece.color == chess.WHITE else flip_square(square)
            piece_symbol = get_piece_symbol(piece)
            to_add = pc[piece_symbol] + pst[piece_symbol][table_square]
            if piece.color == chess.WHITE: score += to_add
            else: score -= to_add
    
    return score

#evaluate the board until quiescience is reached
def quiescience(board, alpha, beta, depth=quiescience_max_depth):
    if depth==0: return evaluate_board(board) 

    stand_eval = evaluate_board(board)
    if stand_eval >= beta: return beta
    if stand_eval > alpha: alpha = stand_eval

    for move in board.legal_moves:
        if board.is_capture(move) or move.promotion:
            board.push(move)
            score = -quiescience(board, -beta, -alpha, depth-1)
            board.pop()

            if score >= beta: return beta
            alpha = max(alpha, score)

    return alpha

#order_moves to improve pruning by first exploring promosing moves
def order_moves(board):
    moves = list(board.legal_moves)

    def move_value(move):
        score = 0
        if board.is_capture(move):
            captured = board.piece_at(move.to_square)
            if captured:
                score += 10*pc[captured.symbol().upper()]
        if move.promotion:
            score += pc[get_piece_symbol(board.piece_at(move.to_square))]
        board.push(move)
        if board.is_check():
            score += 10000
        board.pop()
        return score
    
    return sorted(moves, key=move_value, reverse=True)


def alphabeta(board, depth, alpha, beta):
    if depth == 0 or board.is_game_over():
        return quiescience(board, alpha, beta), None
    
    killer_move = None
    #look if the position has already been analysed with max depth
    fen = board.fen()
    if fen in tt:
        stored_depth, stored_score, stored_move = tt[fen]
        if stored_depth >= depth:
            return stored_score, stored_move
        
        #event if we did not explore the current position with max depth, the stored_move
        #diserve not to be put aside, and might be a good move
        killer_move = stored_move

    best_score = MINSCORE
    best_move = None

    #order moves with the killer_move in top
    moves = order_moves(board)
    if killer_move and killer_move in moves:
        moves.remove(killer_move)
        moves.insert(0, killer_move)
    
    for move in moves:
        board.push(move)
            
        score, _ = alphabeta(board, depth-1, -beta, -alpha)
        score = -score #negamax, we switched side
        board.pop()

        if score > best_score:
            best_score = score
            best_move = move

        if score >= beta:
            break
        alpha = max(alpha, score)

    tt[fen] = depth, best_score, best_move
    
    return best_score, best_move

class SunfishBot(Bot):
    def playmove(self, curboard):
        #first we check for book responses
        book_tmp = list(book.find_all(curboard))
        book_responses = list(filter(lambda x: x.weight >  0.2*book_tmp[0].weight, book_tmp))
        if len(book_responses) > 0:
            entry = random.choice(book_responses)
            return entry.move
        
        _, best_move = alphabeta(curboard, max_depth_to_explore, MINSCORE, MAXSCORE)
        return best_move