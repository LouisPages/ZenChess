#random ai for now in order to test the interaction bewteen the flask server and the front

import random
from .botclass import Bot

class RandomBot(Bot):
    def playmove(self, curboard):
        return random.choice(list(curboard.legal_moves))