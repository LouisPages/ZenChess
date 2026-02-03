#random ai for now in order to test the interaction bewteen the flask server and the front

import random

def get_random_move(legal_moves):
    print(legal_moves);
    return legal_moves[random.randint(0,len(legal_moves)-1)]