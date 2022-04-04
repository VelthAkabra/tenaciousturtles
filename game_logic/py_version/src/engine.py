'''
Nine rooms, six weapons, and six people as in the board game
'''
import random
from state import *
from constant import *

class Engine:
    def __init__(self):
        self.game_state = None
        self.suspect_names = []
        self.weapon_names = []
        self.room_names = []

        self.map = None
        self.player_ids = []

    def set_suspect_names(self, suspect_names=None):
        if suspect_names == None:
            suspect_names = [
                MUSTARD,
                SCARLET,
                PLUM,
                GREEN,
                WHITE,
                PEACOCK
            ]
        self.suspect_names = suspect_names

    def set_weapon_names(self, weapon_names=None):
        if weapon_names == None:
            weapon_names = [
                WRENCH,
                CANDLESTICK,
                REVOLVER,
                ROPE,
                LEAD_PIPE,
                KNIFE
            ]
        self.weapon_names = weapon_names
        
    def set_room_names(self, room_names=None):
        if room_names == None:
            room_names = [
                LIBRARY,
                STUDY,
                HALL,
                LOUNGE,
                DINING,
                KITCHEN,
                BALLROOM,
                CONSERVATORY,
                BILLIARD
            ]
        self.room_names = room_names

    def set_map(self):
        map = {}
        # create rooms
        for i in [1,3,5]:
            for j in [1,3,5]:
                map[(i,j)] = Room(self.room_names[i*j-1])

        # create hallways
        for i in [1,3,5]:
            for j in [2,4]:
                map[(i,j)] = Hallway('Hallway ' + str(i) + '-' + str(j))
        
        for i in [2,4]:
            for j in [1,3,5]:
                map[(i,j)] = Hallway('Hallway ' + str(i) + '-' + str(j))

        # add connections to neighboring rooms and hallways
        for i in [1,3,5]:
            for j in [1,2,3,4]:
                for k in [2,3,4,5]:
                    # by row
                    map[(i,j)].add_connection(map[(i,k)])
                    map[(i,k)].add_connection(map[(i,j)])
                    # by col
                    map[(j,i)].add_connection(map[(k,i)])
                    map[(k,i)].add_connection(map[(j,i)])

        all_spaces = map.values()
        return map, all_spaces

    def add_player(self, player_id):
        self.player_ids.append(player_id)

    def deal_cards(self):
        shuffled_suspect_names = random.shuffle(self.suspect_names)
        shuffled_weapon_names = random.shuffle(self.weapon_names)
        shuffled_room_names = random.shuffle(self.room_names)

        envelope = Suggestion(shuffled_suspect_names[0], shuffled_weapon_names[0], shuffled_room_names[0])
        remained_susept_names = shuffled_suspect_names[1:]
        remained_weapon_names = shuffled_weapon_names[1:]
        remained_room_names = shuffled_room_names[1:]

        all_card_names = remained_susept_names + remained_weapon_names + remained_room_names
        random.shuffle(all_card_names)

        card_per_player = len(all_card_names) // len(self.player_ids)
        for i in range(len(self.player_ids)):
            player_id = self.player_ids[i]
            player_cards = all_card_names[i*card_per_player:(i+1)*card_per_player]

    def finish_setup():        
        pass

    def start_game():
        pass

    def make_move():
        pass

    def make_suggestion():
        pass

    def make_accusation():
        pass

    def make_suggestion_response():
        pass

    def make_accusation_response():
        pass

    def make_suggestion_response_response():
        pass

    def make_accusation_response_response():
        pass

    def make_end_turn():
        pass

    def make_end_game():
        pass

    def make_disprove_suggestion():
        pass

    def make_disprove_accusation():
        pass

    def make_disprove_suggestion_response():
        pass

    def make_disprove_accusation_response():
        pass

    def make_disprove_suggestion_response_response():
        pass

    def make_disprove_accusation_response_response():
        pass

    def make_disprove_end_turn():
        pass

    def make_disprove_end_game():
        pass

    def make_disprove_player_move():
        pass

    def make_disprove_player_suggestion():
        pass

    def make_disprove_player_accusation():
        pass