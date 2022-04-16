'''
Nine rooms, six weapons, and six people as in the board game
'''
import copy
import random
from state import *
from constant import *

class Engine:
    def __init__(self):
        self.suspects = []
        self.weapons = []
        self.rooms = []

        self.map_dict = {}
        self.players_dict = {}
        self.suspect2player_dict = {}

        self.envolope = None
        self.game = None

    def set_suspect_names(self, suspect_names=None):
        if suspect_names == None:
            suspect_names = DEFAULT_SUSPECT_NAMES
        self.suspects = [Suspect(suspect_names[i]) for i in range(len(suspect_names))]

    def set_weapon_names(self, weapon_names=None):
        if weapon_names == None:
            weapon_names = DEFAULT_WEAPON_NAMES
        self.weapons = [Weapon(weapon_names[i]) for i in range(len(weapon_names))]
        
    def set_room_names(self, room_names=None):
        if room_names == None:
            room_names = DEFAULT_ROOM_NAMES
        self.rooms = [Room(room_names[i]) for i in range(len(room_names))]

    def set_map(self):
        map = self.map_dict
        # create rooms
        cnt = 0
        for i in [1,3,5]:
            for j in [1,3,5]:
                map[(i,j)] = self.rooms[cnt]
                cnt += 1

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

    def add_player(self, player_id, suspect_name):
        self.players_dict[player_id] = Player(player_id, suspect_name)
        self.suspect2player_dict[suspect_name] = player_id

    def deal_cards(self):
        shuffled_suspects = copy.deepcopy(self.suspects)
        shuffled_weapons = copy.deepcopy(self.weapons)
        shuffled_rooms = copy.deepcopy(self.rooms)

        random.shuffle(shuffled_suspects)
        random.shuffle(shuffled_weapons)
        random.shuffle(shuffled_rooms)

        self.envelope = Suggestion(shuffled_suspects[0], shuffled_weapons[0], shuffled_rooms[0])

        remained_susept_names = shuffled_suspects[1:]
        remained_weapon_names = shuffled_weapons[1:]
        remained_room_names = shuffled_rooms[1:]

        all_cards = remained_susept_names + remained_weapon_names + remained_room_names
        random.shuffle(all_cards)

        player_ids = list(self.players_dict.keys())
        card_per_player = len(all_cards) // len(player_ids)
        for i in range(len(player_ids)):
            player_id = player_ids[i]
            player_cards = all_cards[i*card_per_player:(i+1)*card_per_player]
            self.players_dict[player_id].set_cards(player_cards)

        # Deal remaining cards if there are any
        remaining_cards = all_cards[len(player_ids)*card_per_player:]
        if len(remaining_cards) > 0:
            for i in range(len(remaining_cards)):
                player_id = player_ids[i]
                additional_player_card = remaining_cards[i]
                player_cards = self.players_dict[player_id].get_cards()
                complete_player_cards = player_cards + [additional_player_card]
                self.players_dict[player_id].set_cards(complete_player_cards)

    # start at random location
    def set_all_players_start_space(self):
        all_hallways = [space for space in self.map_dict.values() if isinstance(space, Hallway)]
        random.shuffle(all_hallways)
        for player_id in self.players_dict.keys():
            player = self.players_dict[player_id]
            player.set_space(all_hallways[0])
            all_hallways[0].add_player(player)
            all_hallways.pop(0)

    def finish_setup(self):      
        self.set_map()
        self.deal_cards()  
        self.set_all_players_start_space()
        self.game = Game(self.players_dict,self.suspects,self.weapons,self.rooms,self.map_dict,self.envelope)

    def start_game():
        pass

    def move_player(self, player_id, space_x, space_y):
        msg = self.game.move_player(player_id, None, space_x, space_y)
        print(msg)
        return msg

    def make_suggestion(self, player_id, suspect_name, weapon_name):
        suspect = Suspect(suspect_name)
        weapon = Weapon(weapon_name)
        msg = self.game.make_suggestion(player_id, suspect, weapon)
        print(msg)
        return msg

    def make_accusation(self, player_id, suspect_name, weapon_name, room_name):
        suspect = Suspect(suspect_name)
        weapon = Weapon(weapon_name)
        room = Room(room_name)
        msg = self.game.make_accusation(suspect, weapon, room)
        print(msg)

        if msg == CORRECT_SUGGESTION:
            self.end_game()

        return msg

    def get_weapon_location(self, weapon_name):
        return self.game.get_weapon_location(weapon_name)

    def get_suspect_location(self, suspect_name):
        player = self.suspect2player_dict[suspect_name]
        return self.get_player_location(player)

    def get_player_location(self, player_id):
        return self.game.get_player_location(player_id)

    def get_player_cards(self, player_id):
        return self.game.get_player_cards(player_id)

    def get_player_known_others_cards(self, player_id):
        return self.game.get_player_known_others_cards(player_id)

    def end_game(self):
        print('Game over')
        pass