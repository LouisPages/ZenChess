import chess
import sys
import numpy as np
from .botclass import Bot
from keras.models import load_model
from .eval_nn.prepare_data import board_to_tensor

model = load_model('zenbot/eval_nn/saved-data/chess_eval_model.keras')
Y_mean = np.load('zenbot/eval_nn/saved-data/Y_mean.npy')
Y_std = np.load('zenbot/eval_nn/saved-data/Y_std.npy')

def get_eval(curboard):
    curboard_tensor = board_to_tensor(curboard)
    curboard_batch = np.expand_dims(curboard_tensor, axis=0)
    shape_eval = model.predict(curboard_batch, verbose=0)
    eval = (shape_eval[0][0] * Y_std) + Y_mean
    print(eval)
    return eval

class EvalBot(Bot):
    def playmove(self, curboard):
        if curboard.turn:
            max = -99999
            best_move_white = None
            for candidate_move in list(curboard.legal_moves):
                curboard.push(candidate_move)
                eval = get_eval(curboard)
                curboard.pop()
                if eval > max:
                    max = eval
                    best_move_white = candidate_move

            return best_move_white
        else:
            min = 99999
            best_move_black = None
            for candidate_move in list(curboard.legal_moves):
                curboard.push(candidate_move)
                eval = get_eval(curboard)
                curboard.pop()
                if eval < min:
                    min = eval
                    best_move_black = candidate_move

            print(min)
            print(best_move_black)
            return best_move_black

