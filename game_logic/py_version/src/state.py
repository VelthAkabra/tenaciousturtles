'''
Nine rooms, six weapons, and six people as in the board game
'''

from constant import *

class Space:
    '''
    Base class for all spaces
    '''
    def __init__(self, name, connected_spaces):
        self.name = name
        self.connected_spaces = connected_spaces
        self.occupants = set([])

    def is_available(self):
        raise NotImplementedError

    def add_suspect(self, suspect):
        self.occupants.add(suspect)

    def remove_suspect(self, suspect):
        self.occupants.remove(suspect)
        

class Room(Space):
    '''
    Rooms are spaces
    '''
    def __init__(self, name, weapon, connected_spaces):
        super().__init__(name, connected_spaces)
        self.weapon = weapon
        
    def is_available(self):
        return True

class Hallway(Space):
    '''
    Hallways are spaces
    '''
    def __init__(self, name, connected_spaces):
        super().__init__(name, connected_spaces)
        
    def is_available(self):
        return len(self.occupants) == 0

class StartLocation(Space):
    '''
    Start locations are spaces
    '''
    def __init__(self, name, connected_spaces):
        super().__init__(name, connected_spaces)
        
    def is_available(self):
        return len(self.occupants) == 0

class Weapon:
    def __init__(self, name):
        self.name = name
    
class Player:
    def __init__(self, player_name, suspect_name, id):
        self.player_name = player_name
        self.suspect_name = suspect_name
        self.id = id
        self.cards = []

    def set_cards(self, cards):
        self.cards = cards

class GameState:

    def __init__(self, players, suspects, weapons, rooms):
        self.players = players
        self.suspects = suspects
        self.weapons = weapons
        self.rooms = rooms

