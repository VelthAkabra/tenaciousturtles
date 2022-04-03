#constants for suspect names
SUSPECT = 'Suspect'

MUSTARD = 'Colonel Mustard'
SCARLET = 'Miss Scarlet'
PLUM = 'Professor Plum'
GREEN = 'Mr Green'
WHITE = 'Mrs White'
PEACOCK = 'Mrs Peacock'

SUSPECTS = [
    MUSTARD,
    SCARLET,
    PLUM,
    GREEN,
    WHITE,
    PEACOCK
]

#constants for weapon names
WEAPON = 'Weapon'

ROPE = 'Rope'
LEAD_PIPE = 'Lead Pipe'
KNIFE = 'Knife'
WRENCH = 'Wrench'
CANDLESTICK = 'Candlestick'
REVOLVER = 'Revolver'

WEAPONS = [
    ROPE,
    LEAD_PIPE,
    KNIFE,
    WRENCH,
    CANDLESTICK,
    REVOLVER
]

#constants for rooms
ROOM = 'Room'
KITCHEN = 'Kitchen'
BALLROOM = 'Ballroom'
CONSERVATORY = 'Conservatory'
BILLIARD_ROOM = 'Billiard Room'
LIBRARY = 'Library'
STUDY = 'Study'
HALL = 'Hall'
LOUNGE = 'Lounge'
DINING_ROOM = 'Dining Room'

ROOMS = [
    KITCHEN,
    BALLROOM,
    CONSERVATORY,
    BILLIARD_ROOM,
    LIBRARY,
    STUDY,
    HALL,
    LOUNGE,
    DINING_ROOM
]


#constants for hallways
STUDY_LIBRARY = 'study-library hallway'
STUDY_HALL = 'study-hall hallway'
HALL_BILLIARD = 'hall-billiard hallway'
HALL_LOUNGE = 'hall-lounge hallway'
LOUNGE_DINING = 'lounge-dining hallway'
LIBRARY_CONSERVATORY = 'library-conservatory hallway'
LIBRARY_BILLIARD = 'library-billiard hallway'
BILLIARD_BALLROOM = 'billiard-ballroom hallway'
BILLIARD_DINING = 'billiard-dining hallway'
DINING_KITCHEN = 'dining-kitchen hallway'
CONSERVATORY_BALLROOM = 'conservatory-ballroom hallway'
BALLROOM_KITCHEN = "ballroom-kitchen hallway"

HALLWAYS = [
    STUDY_LIBRARY,
    STUDY_HALL,
    HALL_BILLIARD,
    HALL_LOUNGE,
    LOUNGE_DINING,
    LIBRARY_CONSERVATORY,
    LIBRARY_BILLIARD,
    BILLIARD_BALLROOM,
    BILLIARD_DINING,
    DINING_KITCHEN,
    CONSERVATORY_BALLROOM,
    BALLROOM_KITCHEN
]

#constants for turn state
AWAITING_MOVE = "Waiting for player to move"
AWAITING_SUGGESTION = "Waiting for player to make suggestion"
AWAITING_SUGGESTION_RESPONSE = "Waiting for response to player suggestion"
AWAITING_ACCUSATION_OR_END_TURN = \
    "Waiting for player to make accusation or end turn"