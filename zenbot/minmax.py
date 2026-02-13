import chess
import chess.engine
import random
from .botclass import Bot
# from .eval_zenbot import get_eval

#opening book
import chess.polyglot
book = chess.polyglot.open_reader("zenbot/opening.bin")


max_depth_to_explore = 4
MAXSCORE = 999999
MINSCORE = -999999

#peSTO evaluation tables
#piece values for middlegame and endgame
mg_value = [82, 337, 365, 477, 1025, 0]  # P, N, B, R, Q, K
eg_value = [94, 281, 297, 512, 936, 0]

#piece-square tables for middlegame
mg_pawn_table = [
    0,   0,   0,   0,   0,   0,  0,   0,
    98, 134,  61,  95,  68, 126, 34, -11,
    -6,   7,  26,  31,  65,  56, 25, -20,
    -14,  13,   6,  21,  23,  12, 17, -23,
    -27,  -2,  -5,  12,  17,   6, 10, -25,
    -26,  -4,  -4, -10,   3,   3, 33, -12,
    -35,  -1, -20, -23, -15,  24, 38, -22,
    0,   0,   0,   0,   0,   0,  0,   0,
]

mg_knight_table = [
    -167, -89, -34, -49,  61, -97, -15, -107,
    -73, -41,  72,  36,  23,  62,   7,  -17,
    -47,  60,  37,  65,  84, 129,  73,   44,
    -9,  17,  19,  53,  37,  69,  18,   22,
    -13,   4,  16,  13,  28,  19,  21,   -8,
    -23,  -9,  12,  10,  19,  17,  25,  -16,
    -29, -53, -12,  -3,  -1,  18, -14,  -19,
    -105, -21, -58, -33, -17, -28, -19,  -23,
]

mg_bishop_table = [
    -29,   4, -82, -37, -25, -42,   7,  -8,
    -26,  16, -18, -13,  30,  59,  18, -47,
    -16,  37,  43,  40,  35,  50,  37,  -2,
    -4,   5,  19,  50,  37,  37,   7,  -2,
    -6,  13,  13,  26,  34,  12,  10,   4,
    0,  15,  15,  15,  14,  27,  18,  10,
    4,  15,  16,   0,   7,  21,  33,   1,
    -33,  -3, -14, -21, -13, -12, -39, -21,
]

mg_rook_table = [
    32,  42,  32,  51, 63,  9,  31,  43,
    27,  32,  58,  62, 80, 67,  26,  44,
    -5,  19,  26,  36, 17, 45,  61,  16,
    -24, -11,   7,  26, 24, 35,  -8, -20,
    -36, -26, -12,  -1,  9, -7,   6, -23,
    -45, -25, -16, -17,  3,  0,  -5, -33,
    -44, -16, -20,  -9, -1, 11,  -6, -71,
    -19, -13,   1,  17, 16,  7, -37, -26,
]

mg_queen_table = [
    -28,   0,  29,  12,  59,  44,  43,  45,
    -24, -39,  -5,   1, -16,  57,  28,  54,
    -13, -17,   7,   8,  29,  56,  47,  57,
    -27, -27, -16, -16,  -1,  17,  -2,   1,
    -9, -26,  -9, -10,  -2,  -4,   3,  -3,
    -14,   2, -11,  -2,  -5,   2,  14,   5,
    -35,  -8,  11,   2,   8,  15,  -3,   1,
    -1, -18,  -9,  10, -15, -25, -31, -50,
]

mg_king_table = [
    -65,  23,  16, -15, -56, -34,   2,  13,
    29,  -1, -20,  -7,  -8,  -4, -38, -29,
    -9,  24,   2, -16, -20,   6,  22, -22,
    -17, -20, -12, -27, -30, -25, -14, -36,
    -49,  -1, -27, -39, -46, -44, -33, -51,
    -14, -14, -22, -46, -44, -30, -15, -27,
    1,   7,  -8, -64, -43, -16,   9,   8,
    -15,  36,  12, -54,   8, -28,  75,  14,
]

#piece-square tables for endgame
eg_pawn_table = [
    0,   0,   0,   0,   0,   0,   0,   0,
    178, 173, 158, 134, 147, 132, 165, 187,
    94, 100,  85,  67,  56,  53,  82,  84,
    32,  24,  13,   5,  -2,   4,  17,  17,
    13,   9,  -3,  -7,  -7,  -8,   3,  -1,
    4,   7,  -6,   1,   0,  -5,  -1,  -8,
    13,   8,   8,  10,  13,   0,   2,  -7,
    0,   0,   0,   0,   0,   0,   0,   0,
]

eg_knight_table = [
    -58, -38, -13, -28, -31, -27, -63, -99,
    -25,  -8, -25,  -2,  -9, -25, -24, -52,
    -24, -20,  10,   9,  -1,  -9, -19, -41,
    -17,   3,  22,  22,  22,  11,   8, -18,
    -18,  -6,  16,  25,  16,  17,   4, -18,
    -23,  -3,  -1,  15,  10,  -3, -20, -22,
    -42, -20, -10,  -5,  -2, -20, -23, -44,
    -29, -51, -23, -15, -22, -18, -50, -64,
]

eg_bishop_table = [
    -14, -21, -11,  -8, -7,  -9, -17, -24,
    -8,  -4,   7, -12, -3, -13,  -4, -14,
    2,  -8,   0,  -1, -2,   6,   0,   4,
    -3,   9,  12,   9, 14,  10,   3,   2,
    -6,   3,  13,  19,  7,  10,  -3,  -9,
    -12,  -3,   8,  10, 13,   3,  -7, -15,
    -14, -18,  -7,  -1,  4,  -9, -15, -27,
    -23,  -9, -23,  -5, -9, -16,  -5, -17,
]

eg_rook_table = [
    13, 10, 18, 15, 12,  12,   8,   5,
    11, 13, 13, 11, -3,   3,   8,   3,
    7,  7,  7,  5,  4,  -3,  -5,  -3,
    4,  3, 13,  1,  2,   1,  -1,   2,
    3,  5,  8,  4, -5,  -6,  -8, -11,
    -4,  0, -5, -1, -7, -12,  -8, -16,
    -6, -6,  0,  2, -9,  -9, -11,  -3,
    -9,  2,  3, -1, -5, -13,   4, -20,
]

eg_queen_table = [
    -9,  22,  22,  27,  27,  19,  10,  20,
    -17,  20,  32,  41,  58,  25,  30,   0,
    -20,   6,   9,  49,  47,  35,  19,   9,
    3,  22,  24,  45,  57,  40,  57,  36,
    -18,  28,  19,  47,  31,  34,  39,  23,
    -16, -27,  15,   6,   9,  17,  10,   5,
    -22, -23, -30, -16, -16, -23, -36, -32,
    -33, -28, -22, -43,  -5, -32, -20, -41,
]

eg_king_table = [
    -74, -35, -18, -18, -11,  15,   4, -17,
    -12,  17,  14,  17,  17,  38,  23,  11,
    10,  17,  23,  15,  20,  45,  44,  13,
    -8,  22,  24,  27,  26,  33,  26,   3,
    -18,  -4,  21,  24,  27,  23,   9, -11,
    -19,  -3,  11,  21,  23,  16,   7,  -9,
    -27, -11,   4,  13,  14,   4,  -5, -17,
    -53, -34, -21, -11, -28, -14, -24, -43
]

#group tables by piece type
mg_tables = [mg_pawn_table, mg_knight_table, mg_bishop_table, mg_rook_table, mg_queen_table, mg_king_table]
eg_tables = [eg_pawn_table, eg_knight_table, eg_bishop_table, eg_rook_table, eg_queen_table, eg_king_table]

#game phase increments for each piece type (pawn, knight, bishop, rook, queen, king)
gamephase_inc = [0, 1, 1, 2, 4, 0]

def flip_square(square):
    return square ^ 56

def get_piece_type_index(piece):
    piece_map = {
        chess.PAWN: 0,
        chess.KNIGHT: 1,
        chess.BISHOP: 2,
        chess.ROOK: 3,
        chess.QUEEN: 4,
        chess.KING: 5
    }
    return piece_map[piece.piece_type]

def evaluate_board(board):
    mg = [0, 0]  # middlegame scores for white and black
    eg = [0, 0]  # endgame scores for white and black
    game_phase = 0
    
    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece is not None:
            piece_type = get_piece_type_index(piece)
            color_index = 0 if piece.color == chess.WHITE else 1
            
            table_square = square if piece.color == chess.WHITE else flip_square(square)
            
            mg[color_index] += mg_value[piece_type] + mg_tables[piece_type][table_square]
            eg[color_index] += eg_value[piece_type] + eg_tables[piece_type][table_square]
            
            game_phase += gamephase_inc[piece_type]
    
    side_to_move = 0 if board.turn == chess.WHITE else 1
    other_side = 1 - side_to_move
    
    mg_score = mg[side_to_move] - mg[other_side]
    eg_score = eg[side_to_move] - eg[other_side]
    
    mg_phase = min(game_phase, 24)
    eg_phase = 24 - mg_phase
    
    return (mg_score * mg_phase + eg_score * eg_phase) // 24

def order_moves(board):
    legal_moves = list(board.legal_moves)
    random.shuffle(legal_moves)
    def move_priority(move):
        score = 0
        if board.is_castling(move):
            # board.push(move)
            # if evaluate_board(board) <= 100:
            #     print("coucou")
            #     board.pop() 
            #     return [move]
            # else:
            score += 20
            # board.pop()
        if board.is_capture(move): score += 10
        board.push(move)
        if board.is_check(): score += 5
        board.pop()
        return score
    
    return sorted(legal_moves, key=move_priority, reverse=True)

def best_result(curboard, alpha, beta, depth=1, max_depth=max_depth_to_explore):
    outcome = curboard.outcome()
    if outcome is not None:
        if outcome.winner is not None:
            if outcome.winner == curboard.turn:
                return MAXSCORE
            else:
                return MINSCORE
        return 0
    
    if depth >= max_depth:
        return evaluate_board(curboard)
        
        
    best_result_so_far = MINSCORE
    for candidate_move in order_moves(curboard):
        nextboard = curboard.copy()
        nextboard.push(candidate_move)
        possible_result = -best_result(nextboard, alpha, beta, depth+1, max_depth)
        if possible_result >= best_result_so_far:
            best_result_so_far = possible_result
            
        
        if curboard.turn != chess.WHITE:
            if best_result_so_far > beta:
                beta = best_result_so_far
            outcome_for_black = -best_result_so_far
            if outcome_for_black < alpha:
                return best_result_so_far
            
        else:
            if best_result_so_far > alpha:
                alpha = best_result_so_far
            outcome_for_white = -best_result_so_far
            if outcome_for_white < beta:
                return best_result_so_far

    return best_result_so_far


class MinmaxBot(Bot):
    def playmove(self, curboard):
        #first we check for book responses
        book_responses = list(book.find_all(curboard))
        if len(book_responses) > 0:
            entry = random.choice(book_responses)
            return entry.move

        best_moves = []
        best_score = None
        alpha = MINSCORE
        beta = MINSCORE
        for candidate_move in order_moves(curboard):
            nextboard = curboard.copy()
            nextboard.push(candidate_move)
            best_opponent_result = best_result(nextboard, alpha, beta)
            our_best_result = -best_opponent_result
            if (not best_moves) or our_best_result > best_score:
                best_moves = [candidate_move]
                best_score = our_best_result
                if curboard.turn != chess.BLACK:
                    alpha = best_score
                else:
                    beta = best_score
            elif our_best_result == best_score:
                best_moves.append(candidate_move)
            
        print(evaluate_board(curboard))
        return random.choice(best_moves)


if __name__ == "__main__":
    board = chess.Board()
    bot = MinmaxBot()
    
    for i in range(40):
        move = bot.playmove(board)
        print(f"Bot plays: {move}\n")
        board.push(move)
        print(board)
        print("\n\n")