#do the interaction bewteen the server and zenbot classes

from .minmax import *
from .randombot import *
from .eval_zenbot import *
from .sunfish import * 

dicPos = {'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7}



#function to convert a board stored with arrays, in a FEN board, then make a chess.Board out of it
def convert_board(curboard, whoseturn, castle_available, lastmove):
    piece_map = {
        ('♚', 'w'): 'K', ('♛', 'w'): 'Q', ('♜', 'w'): 'R', 
        ('♝', 'w'): 'B', ('♞', 'w'): 'N', ('♟', 'w'): 'P',
        ('♚', 'b'): 'k', ('♛', 'b'): 'q', ('♜', 'b'): 'r', 
        ('♝', 'b'): 'b', ('♞', 'b'): 'n', ('♟', 'b'): 'p',
    }
    
    fen_rows = []
    for row in curboard:
        fen_row = ""
        empty_count = 0
        
        for square in row:
            if square[0] == '':
                empty_count += 1
            else:
                if empty_count > 0:
                    fen_row += str(empty_count)
                    empty_count = 0
                piece = square[0]
                color = square[1]
                fen_row += piece_map[(piece, color)]
        
        if empty_count > 0:
            fen_row += str(empty_count)
        
        fen_rows.append(fen_row)
    
    position = '/'.join(fen_rows)
    
    active_color = whoseturn
    
    castling = ''
    if castle_available['wright']:
        castling += 'K'
    if castle_available['wleft']:
        castling += 'Q'
    if castle_available['bright']:
        castling += 'k'
    if castle_available['bleft']:
        castling += 'q'
    if not castling:
        castling = '-'
    
    en_passant = '-'
    if lastmove is not None:
        piece_info = lastmove[0]
        old_i, old_j = lastmove[1]
        new_i, new_j = lastmove[2]
        
        if piece_info[0] == '♟':
            if abs(new_i - old_i) == 2:
                ep_i = (old_i + new_i) // 2
                ep_j = new_j
                
                file = chr(ord('a') + ep_j)
                rank = str(8 - ep_i)
                en_passant = file + rank
    
    halfmove = '0'
    fullmove = '1'
    
    fen = f"{position} {active_color} {castling} {en_passant} {halfmove} {fullmove}"
    
    return chess.Board(fen)


def play_random(curboard, whoseturn, castle_available, lastmove):
    converted_curboard = convert_board(curboard, whoseturn, castle_available, lastmove)
    bot = RandomBot()
    move = str(bot.playmove(converted_curboard))

    movetosend = [[8 - int(move[1]), dicPos[move[0]]], [8 - int(move[3]), dicPos[move[2]]]]
    return movetosend


def play_minmax(curboard, whoseturn, castle_available, lastmove):
    converted_curboard = convert_board(curboard, whoseturn, castle_available, lastmove)
    bot = MinmaxBot()
    move = str(bot.playmove(converted_curboard))

    movetosend = [[8 - int(move[1]), dicPos[move[0]]], [8 - int(move[3]), dicPos[move[2]]]]
    return movetosend

def play_eval(curboard, whoseturn, castle_available, lastmove):
    converted_curboard = convert_board(curboard, whoseturn, castle_available, lastmove)
    bot = EvalBot()
    move = str(bot.playmove(converted_curboard))

    movetosend = [[8 - int(move[1]), dicPos[move[0]]], [8 - int(move[3]), dicPos[move[2]]]]
    return movetosend

def play_sunfish(curboard, whoseturn, castle_available, lastmove):
    converted_curboard = convert_board(curboard, whoseturn, castle_available, lastmove)
    bot = SunfishBot()
    move = str(bot.playmove(converted_curboard))

    movetosend = [[8 - int(move[1]), dicPos[move[0]]], [8 - int(move[3]), dicPos[move[2]]]]
    return movetosend