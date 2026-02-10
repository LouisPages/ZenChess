import chess
import chess.engine
import random
from .botclass import Bot

max_depth_to_explore = 3

MAXSCORE = 999999
MINSCORE = -999999
dicScore = {'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 8, 'K': 0}

def order_moves(board):
    legal_moves = list(board.legal_moves)
    random.shuffle(legal_moves)

    def move_priority(move):
        score = 0
        if board.is_castling(move): score += 20
        if board.is_capture(move): score += 10
        board.push(move)
        if board.is_check(): score += 5
        board.pop()
        return score
    
    return sorted(legal_moves, key=move_priority, reverse=True)

def evaluate_board(board):
    score = 0
    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece is not None:
            if piece.color == board.turn:
                score += dicScore[str(piece).upper()]
            else:
                score -= dicScore[str(piece).upper()]
    return score

    # code to test the code with stockfish's evaluation
    # engine = chess.engine.SimpleEngine.popen_uci("C:/Users/loupa/Downloads/stockfish-windows-x86-64-avx2/stockfish/stockfish-windows-x86-64-avx2.exe")
    # info = engine.analyse(board, chess.engine.Limit(time=0.1))
    # engine.quit()

    # score = info['score'].relative.score()
    # if score is not None:
    #     print(score/100)
    #     return score/100
    # return MAXSCORE * (1 if info['score'].relative.mate() > 0 else -1)

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