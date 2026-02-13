#with raw_data_position, I only used 100 fen positions to train
#now it's time to do it with a lot more of data
#the chessData.csv is from https://www.kaggle.com/datasets/ronakbadhe/chess-evaluations

import pandas as pd
import numpy as np
import chess
from prepare_data import board_to_tensor
import re

data = pd.read_csv("C:/Users/loupa/Downloads/archive/chessData.csv", nrows=1000000)

print(len(data))
print("\n")
print(data.head())

#handles evaluation mate type
def clean_evaluation(eval_value):
    try:
        return float(eval_value)
    except (ValueError, TypeError):
        eval_str = str(eval_value).lower()
        if 'mate' in eval_str or '#' in eval_str:
            match = re.search(r'[-+]?\d+', eval_str)
            if match:
                moves_to_mate = int(match.group())
                return 10000 if moves_to_mate > 0 else -10000
        return None

def fen_to_tensor_batch(data):
    tensors = []
    evaluations = []
    
    for i, row in data.iterrows():
        try:
            fen = row['FEN']
            eval_raw = row['Evaluation']
            eval_score = clean_evaluation(eval_raw)
            if eval_score is None:
                continue
            board_from_fen = chess.Board(fen)
            tensor = board_to_tensor(board_from_fen)
            assert tensor.shape == (17, 8, 8)
            tensors.append(tensor)
            evaluations.append(eval_score)
            print(f"\r{i+1} / 1000000 done", end='')
        except:
            continue
    
    return np.array(tensors, dtype=np.float32), np.array(evaluations, dtype=np.float32)

X, Y = fen_to_tensor_batch(data)

np.save('zenbot/eval_nn/saved-data/X_data.npy', X)
np.save('zenbot/eval_nn/saved-data/Y_data.npy', Y)