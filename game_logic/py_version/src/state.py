'''
Nine rooms, six weapons, and six people as in the board game
'''
import random
from constant import *

class Card:
    def __init__(self, name):
        self.name = name
    
    def equals(self, card):
        return self.name == card.name

class Space(Card):
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

    def add_player(self, player):
        self.occupants.add(player)

    def remove_player(self, player):
        self.occupants.remove(player)

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

class Weapon(Card):
    def __init__(self, name):
        self.name = name

class Suspect(Card):
    def __init__(self, name):
        self.name = name
    
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
    
    def equals(self, suggestion):
        return self.suspect.equals(suggestion.suspect) \
            and self.weapon.equals(suggestion.weapon) \
            and self.room.equals(suggestion.room)

class Game:

    def __init__(self, players_dict, suspects, weapons, rooms, map_dict, envolope):
        self.players_dict = players_dict
        self.suspect_name_2_player_dict = {Player.suspect_name: Player for player_id, Player in players_dict.items()}
        self.suspect= suspects
        self.weapon = weapons
        self.room = rooms
        self.map_dict = map_dict
        self.envolope = envolope

    def move_player(self, player_id, next_space=None, next_space_x=None, next_space_y=None):

        if next_space is None and next_space_x is not None and next_space_y is not None:
            if (next_space_x, next_space_y) not in self.map_dict:
                msg = ILLEGAL_MOVE
                return msg
            next_space = self.map_dict[(next_space_x, next_space_y)]
        elif next_space is None and next_space_x is None and next_space_y is None:
            msg = ILLEGAL_MOVE
            return msg

        if not next_space.is_available():
            msg = ILLEGAL_MOVE
            return msg

        player = self.players_dict[player_id]
        prev_space = player.space
        prev_space.remove_player(player)
        next_space.add_player(player)
        player.set_space(next_space)

        return f'Moved {player.suspect_name} from {prev_space.name} to {next_space.name}'

    def make_suggestion(self, player_id, suspect, weapon):
        player = self.players_dict[player_id]
        room = player.space

        if not room.is_room():
            return SUGGESSTION_FROM_HALLWAY

        print(f'{player.suspect_name} suggests {suspect.name} with {weapon.name} in {room.name}')

        suggestion = Suggestion(suspect, weapon, room)
        if suggestion.equals(self.envolope):
            return CORRECT_SUGGESTION

        else:
            suggested_player = self.suspect_name_2_player_dict[suspect.name]
            self.move_player(suggested_player.player_id, room)

            for other_player in self.players_dict.values():
                other_player_cards = other_player.cards
                shared_cards = [card for card in other_player_cards if card.equals(suspect) or card.equals(weapon) or card.equals(room)]

                if len(shared_cards)>0:
                    # Choose a random card to response with
                    selected_shared_card = random.choice(shared_cards)
                    player.update_known_others_cards(selected_shared_card)
                    return RESPONDED_SUGGESTION + f': player {other_player.suspect_name}' + ' has ' + selected_shared_card.name

            return UNRESPONDED_SUGGESTION

    def make_accusation(self, suspect, weapon, room):
        accusation = Suggestion(suspect, weapon, room)
        if accusation.equals(self.solution):
            return CORRECT_SUGGESTION
        else:
            return INCORRECT_SUGGESTION