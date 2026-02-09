import chess
import enum
from .botclass import Bot

max_depth_to_explore = 3

class GameResult(enum.Enum):
    loss = 1
    draw = 2
    win = 3

def reverse_game_result(game_result):
    if game_result == GameResult.loss:
        return GameResult.win
    elif game_result == GameResult.win:
        return GameResult.loss
    else:
        return GameResult.draw

def evaluate_board(board):
    dicScore = {
        'P': 1,
        'N': 3,
        'B': 3,
        'R': 5,
        'Q': 8,
        'K': 0
    }

    score = 0
    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece is not None:
            if piece.color == board.turn:
                score += dicScore[str(piece).upper()]
            else:
                score -= dicScore[str(piece).upper()]
    return score

def best_result(curboard, depth=0, max_depth=max_depth_to_explore):
    outcome = curboard.outcome()
    if outcome is not None:
        if outcome.winner is not None:
            if outcome.winner == curboard.turn:
                return GameResult.win
            else:
                return GameResult.loss
        return GameResult.draw
    
    if depth >= max_depth:
        eval = evaluate_board(curboard)
        if eval >= 3:
            return GameResult.win
        elif eval <= -3:
            return GameResult.loss
        else:
            return GameResult.draw
        
    best_result_so_far = GameResult.loss
    for candidate_move in curboard.legal_moves:
        nextboard = curboard.copy()
        nextboard.push(candidate_move)
        possible_result = reverse_game_result(best_result(nextboard, depth+1, max_depth))
        if possible_result.value >= best_result_so_far.value:
            best_result_so_far = possible_result
    
    return best_result_so_far


class MinmaxBot(Bot):
    def playmove(self, curboard):
        winning_moves = []
        drawing_moves = []
        losing_moves = []
        for candidate_move in curboard.legal_moves:
            nextboard = curboard.copy()
            nextboard.push(candidate_move)
            best_opponent_result = best_result(nextboard)
            bot_best_result = reverse_game_result(best_opponent_result)
            if bot_best_result == GameResult.win:
                winning_moves.append(candidate_move)
            elif bot_best_result == GameResult.loss:
                losing_moves.append(candidate_move)
            else:
                drawing_moves.append(candidate_move)
            
        def eval_move(move):
            nextboard = curboard.copy()
            nextboard.push(move)
            return evaluate_board(nextboard)

        if winning_moves:
            best_winning_move = max(winning_moves, key=eval_move)
            return best_winning_move
        if drawing_moves:
            best_drawing_move = max(drawing_moves, key=eval_move)
            return best_drawing_move
        if losing_moves:
            best_losing_move = max(losing_moves, key=eval_move)
            return best_losing_move



if __name__ == "__main__":
    board = chess.Board()
    bot = MinmaxBot()
    
    for i in range(40):
        move = bot.playmove(board)
        print(f"Bot plays: {move}\n")
        board.push(move)
        print(board)
        print("\n\n")