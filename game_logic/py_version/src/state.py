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

    def is_same(self, weapon):
        return self.name == weapon.name

class Suspect:
    def __init__(self, name):
        self.name = name

    def is_same(self, suspect):
        return self.name == suspect.name
    
class Player:
    def __init__(self, player_id, suspect_name):
        self.player_id = player_id
        self.suspect_name = suspect_name
        self.space = None
        self.cards = []
        self.known_others_cards = []

    def set_susept(self, suspect_name):
        self.suspect_name = suspect_name

    def set_cards(self, cards):
        self.cards = cards

    def set_space(self, space):
        self.space = space

    def update_known_others_cards(self, card):
        self.known_others_cards.append(card)


class Suggestion:

    def __init__(self, suspect, weapon, room):
        self.suspect = suspect
        self.weapon = weapon
        self.room = room
    
    def is_same(self, suggestion):
        return self.suspect.is_same(suggestion.suspect) \
            and self.weapon.is_same(suggestion.weapon) \
            and self.room.is_same(suggestion.room)

class Game:

    def __init__(self, players_dict, suspects, weapons, rooms, map_dict, envolope):
        self.players_dict = players_dict
        self.suspect= suspects
        self.weapon = weapons
        self.room = rooms
        self.map_dict = map_dict
        self.envolope = envolope

    def move_player(self, player_id, next_space):
        player = self.players_dict[player_id]
        prev_space = player.space
        prev_space.remove_suspect(player)
        next_space.add_suspect(player)

        return f'Moved {player.suspect_name} from {prev_space.name} to {next_space.name}'

    def make_suggestion(self, player_id, suspect, weapon):
        player = self.players_dict[player_id]
        room = player.space

        if not room.is_room():
            return ILLEGAL_MOVE

        suggestion = Suggestion(suspect, weapon, room)
        if suggestion.is_same(self.envolope):
            return CORRECT_SUGGESTION

        else:
            for other_player in self.players_dict.values():
                other_player_cards = other_player.cards
                shared_cards = [card for card in other_player_cards if card in [suspect, weapon, room]]

                if len(shared_cards)>0:
                    # Choose a random card to response with
                    selected_shared_card = random.choice(shared_cards)
                    player.update_known_others_cards(selected_shared_card)
                    return RESPONDED_SUGGESTION

            return UNRESPONDED_SUGGESTION

    def make_accusation(self, suspect, weapon, room):
        accusation = Suggestion(suspect, weapon, room)
        if accusation.is_same(self.solution):
            return CORRECT_SUGGESTION
        else:
            return INCORRECT_SUGGESTION