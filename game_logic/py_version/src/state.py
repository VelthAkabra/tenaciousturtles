'''
Nine rooms, six weapons, and six people as in the board game
'''
import random
from constant import *

class Space:
    '''
    Base class for all spaces
    '''
    def __init__(self, name):
        self.name = name
        self.occupants = set([])
        self.connections = set([])

    def is_room(self):
        raise NotImplementedError

    def is_available(self):
        raise NotImplementedError

    def add_suspect(self, suspect):
        self.occupants.add(suspect)

    def remove_suspect(self, suspect):
        self.occupants.remove(suspect)

    def add_connection(self, space):
        self.connections.add(space)
        

class Room(Space):
    '''
    Rooms are spaces
    '''
    def __init__(self, name):
        super().__init__(name)
        self.suspect = None
        self.weapon = None
        
    def is_room(self):
        return True

    def is_available(self):
        return True

class Hallway(Space):
    '''
    Hallways are spaces
    '''
    def __init__(self, name):
        super().__init__(name)
        
    def is_room(self):
        return False

    def is_available(self):
        return len(self.occupants) == 0

# class StartLocation(Space):
#     '''
#     Start locations are spaces
#     '''
#     def __init__(self, name, connected_spaces):
#         super().__init__(name, connected_spaces)
        
#     def is_available(self):
#         return len(self.occupants) == 0

class Weapon:
    def __init__(self, name):
        self.name = name
    
class Player:
    def __init__(self, player_id, suspect_name, space):
        self.suspect_name = suspect_name
        self.player_id = player_id
        self.space = space
        self.cards = []
        self.others_cards = []

    def set_cards(self, cards):
        self.cards = cards

    def update_others_cards(self, card):
        self.others_cards.append(card)

class Suggestion:
    def __init__(self, suspect_name, weapon_name, room_name):
        self.suspect_name = suspect_name
        self.weapon_name = weapon_name
        self.room_name = room_name

    def is_same(self, suggestion):
        return self.suspect_name == suggestion.suspect_name and \
            self.weapon_name == suggestion.weapon_name and \
            self.room_name == suggestion.room_name

class GameState:

    def __init__(self, players, suspect_names, weapon_names, room_names, map):
        self.players = players
        self.suspect_names = suspect_names
        self.weapon_names = weapon_names
        self.room_names = room_names
        self.map = map

        self.set_solution()

    def set_solution(self):
        self.solution = Suggestion(random.choice(self.suspect_names),
                                   random.choice(self.weapon_names),
                                   random.choice(self.room_names))

    # def add_player(self, player):
    #     self.players.append(player)
    #     self.suspects.append(player.suspect_name)

    def move_player(self, player, next_space):
        prev_space = player.space
        prev_space.remove_suspect(player)
        next_space.add_suspect(player)

    def make_suggestion(self, player, suspect, weapon):
        room = player.space

        if not room.is_room():
            return ILLEGAL_MOVE

        suggestion = Suggestion(suspect, weapon, room)
        if suggestion.is_same(self.solution):
            return CORRECT_SUGGESTION

        else:
            for other_player in self.players:
                other_player_cards = other_player.cards
                shared_cards = [card for card in other_player_cards if card in [suspect, weapon, room]]

                if len(shared_cards)>0:
                    # Choose a random card to response with
                    selected_shared_card = random.choice(shared_cards)
                    player.update_others_cards(selected_shared_card)
                    return RESPONDED_SUGGESTION

            return UNRESPONDED_SUGGESTION

    def make_accusation(self, player, suspect, weapon, room):
        accusation = Suggestion(suspect, weapon, room)
        if accusation.is_same(self.solution):
            return CORRECT_SUGGESTION
        else:
            return INCORRECT_SUGGESTION