import unittest
from state import *
from engine import *
from constant import *

class TestState(unittest.TestCase):

    def test_player(self):
        player = Player(1, 'suspect')
        assert player.player_id == 1
        assert player.suspect_name == 'suspect'
        assert player.space == None
        assert player.cards == []

    def test_room(self):
        room = Room('room')
        assert room.name == 'room'
        assert room.suspect == None
        assert room.weapon == None

    def test_hallway(self):
        hallway = Hallway('hallway')
        assert hallway.name == 'hallway'

    def test_game(self):
        # create game
        engine = Engine()
        engine.set_suspect_names()
        engine.set_weapon_names()
        engine.set_room_names()

        player_num = 6
        test_num = 1

        for player_id in range(player_num):
            engine.add_player(player_id, DEFAULT_SUSPECT_NAMES[player_id])

        engine.finish_setup()

        # test move player
        engine.move_player(player_id=0, space_x=1, space_y=1)

        # test get player location
        for player_id_to_show in range(test_num):
            location = engine.get_player_location(player_id=player_id_to_show)
            print(f'Player {player_id_to_show} at {location}')

        # test get player cards
        for player_id_to_show in range(test_num):
            cards = engine.get_player_cards(player_id=player_id_to_show)
            print(f'Player {player_id_to_show} has cards {cards}')

        # test get weapon location
        for weapon_name in DEFAULT_WEAPON_NAMES[:test_num]:
            location = engine.get_weapon_location(weapon_name)
            print(f'{weapon_name} at {location}')
            assert location == None

        # test get suspect location
        for suspect_name in DEFAULT_SUSPECT_NAMES[:test_num]:
            location = engine.get_suspect_location(suspect_name)
            print(f'{suspect_name} at {location}')

        # test make suggestion
        engine.make_suggestion(player_id=0, suspect_name=PEACOCK, weapon_name=CANDLESTICK)

        # test get weapon location
        for weapon_name in DEFAULT_WEAPON_NAMES[:test_num]:
            location = engine.get_weapon_location(weapon_name)
            print(f'{weapon_name} at {location}')

        # test correct accusation
        envolope = engine.game.envolope
        msg = engine.make_accusation(player_id=0, suspect_name=envolope.suspect.name, weapon_name=envolope.weapon.name, room_name=envolope.room.name)
        assert msg == CORRECT_SUGGESTION


if __name__ == '__main__':
    unittest.main()
