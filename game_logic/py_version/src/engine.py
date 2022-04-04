'''
Nine rooms, six weapons, and six people as in the board game
'''
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

        self.envolope = None
        self.game = None

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
        self.suspects = [Suspect(suspect_names[i]) for i in range(len(suspect_names))]

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
        self.weapons = [Weapon(weapon_names[i]) for i in range(len(weapon_names))]
        
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
        self.room_names = [Room(room_names[i]) for i in range(len(room_names))]

    def set_map(self):
        map = self.map
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

    def deal_cards(self):
        shuffled_suspect_names = random.shuffle(self.suspect_names)
        shuffled_weapon_names = random.shuffle(self.weapon_names)
        shuffled_room_names = random.shuffle(self.room_names)

        self.envelope = Suggestion(shuffled_suspect_names[0], shuffled_weapon_names[0], shuffled_room_names[0])

        remained_susept_names = shuffled_suspect_names[1:]
        remained_weapon_names = shuffled_weapon_names[1:]
        remained_room_names = shuffled_room_names[1:]

        all_card_names = remained_susept_names + remained_weapon_names + remained_room_names
        random.shuffle(all_card_names)

        card_per_player = len(all_card_names) // len(self.player_ids)
        for i in range(len(self.player_ids)):
            player_id = self.player_ids[i]
            player_cards = all_card_names[i*card_per_player:(i+1)*card_per_player]
            self.players_dict[player_id].set_cards(player_cards)

    def finish_setup(self):      
        self.set_map()
        self.deal_cards()  
        self.game = Game(self.players_dict,self.suspects,self.weapons,self.rooms,self.map_dict,self.envelope)

    def start_game():
        pass

    def move_player(self, player_id, space_x, space_y):
        if (space_x, space_y) not in self.map_dict:
            print(ILLEGAL_MOVE)
            return

        next_space = self.map_dict[(space_x, space_y)]
        if next_space.is_occupied():
            print(ILLEGAL_MOVE)
            return

        msg = self.game.move_player(player_id, next_space)
        print(msg)

    def make_suggestion(self, player_id, suspect_name, weapon_name):
        suspect = Suspect(suspect_name)
        weapon = Weapon(weapon_name)
        msg = self.game.make_suggestion(player_id, suspect, weapon)
        print(msg)

    def make_accusation(self, player_id, suspect_name, weapon_name, room_name):
        suspect = Suspect(suspect_name)
        weapon = Weapon(weapon_name)
        room = Room(room_name)
        msg = self.game.make_accusation(player_id, suspect, weapon, room)
        print(msg)

        if msg == CORRECT_SUGGESTION:
            self.game.end_game()

    def end_game(self):
        print('Game over')
        pass