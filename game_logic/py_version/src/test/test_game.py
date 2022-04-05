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
        engine = Engine()
        engine.set_suspect_names()
        engine.set_weapon_names()
        engine.set_room_names()

        for player_id in range(6):
            engine.add_player(player_id, DEFAULT_SUSPECT_NAMES[player_id])

        engine.finish_setup()
        engine.move_player(player_id=0, space_x=1, space_y=1)
        engine.make_suggestion(player_id=0, suspect_name=PEACOCK, weapon_name=CANDLESTICK)

if __name__ == '__main__':
    unittest.main()
