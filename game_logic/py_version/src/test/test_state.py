import unittest
import state, engine, constant

class TestState(unittest.TestCase):

    def test_player(self):
        player = state.Player(1, 'suspect')
        assert player.player_id == 1
        assert player.suspect_name == 'suspect'
        assert player.space == None
        assert player.cards == []

    def test_room(self):
        room = state.Room('room')
        assert room.name == 'room'
        assert room.suspect == None
        assert room.weapon == None

    def test_hallway(self):
        hallway = state.Hallway('hallway')
        assert hallway.name == 'hallway'

if __name__ == '__main__':
    unittest.main()
