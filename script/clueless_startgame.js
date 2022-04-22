$(document).ready(function () {

    $("#start_btn").click(function () {

        async function fetchStartGame() {
            let startGameUrl = 'https://clue-app-service-windows.azurewebsites.net/api/GameSessions/' +
                gameId + '/start';

            let response = await fetch(startGameUrl, {
                method: 'PUT',
                redirect: 'error',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + accessToken
                },
                body: ''
            });

            if (!response.ok) {
                const message = `An error has occured: ${response.status} - ${response.statusText}`;
                throw new Error(message);
            }

            let responseJson = await response.json();
            return responseJson;

        }

        fetchStartGame().then(responseJson => {
            // console.log(responseJson);
            // sessionStorage.setItem('gameStartedJson', JSON.stringify(responseJson));
        }).catch(e => {
            console.error('fetchStartGame Error:' + e.name + ': ' + e.message);
            addToLog("Game start failed!");
        });

    });

});

connection.on("GameHasStarted", function (message) {
    // console.log(message);

    sessionStorage.setItem('gameSessionJsonAfterStart', JSON.stringify(message));

    addToLog("This game session has started!");

    if (isHost) {
        $('#start_btn').addClass('d-none');
    }

    getRoomSet();
    getWeaponSet();
    displayRoomNames();

    let publicCards = message.gameSession.publicCards;

    gameStarted = true;

    // Temporary extract cards for each player
    // depends on 'allCards' returned in 'gameSession' JSON from server
    message.gameSession.allCards.forEach(cardJson => {
        let cardId = cardJson.id;
        let cardName = cardJson.name;
        let cardPlayerJson = cardJson.player;
        let cardPlayerId = null;
        if (cardPlayerJson) {
            cardPlayerId = cardPlayerJson.id;
        }

        let cardObj = null;
        let isExtraCard = false;

        if (publicCards.length > 0) {
            publicCards.forEach(publicCard => {
                if (publicCard.id == cardId) {
                    isExtraCard = true;
                    addExtraCardToBox(cardName);
                }
            });
        }

        if (cardJson.character) {
            cardObj = new CharacterCard(cardId, cardName, cardPlayerId, isExtraCard, cardJson.characterId);
        }
        else if (cardJson.room) {
            cardObj = new RoomCard(cardId, cardName, cardPlayerId, isExtraCard, cardJson.roomId);
        }
        else if (cardJson.weapon) {
            cardObj = new WeaponCard(cardId, cardName, cardPlayerId, isExtraCard, cardJson.weaponId);
        }
        else {
            throw new Error("gameSession.allCards Error: The card" + cardId + ": " +
                cardName + " doesn't have a type (Character, Room, or Weapon)");
        }

        if (cardPlayerId) {
            let playerObj = getPlayerById(cardPlayerId);

            if (playerObj) {
                playerObj.addCard(cardObj);
            }
            else {
                throw new Error("getPlayerById Error: The player " + cardPlayerId + " from card: " +
                    cardName + " does not exist");
            }

        }

        cards.add(cardObj);

        // Temporarily highlight ajacent hallways adjacent to center
        // TODO: move to after it's the player's ture
        // TODO: compute or receive the available areas

        let coordSet = new Set([[1, 2], [2, 1], [3, 2], [2, 3]]);

        highlighSpaces(coordSet);

        // Temporarily enable accuse button
        // TODO: move to after it's the player's turn
        $('#accuseBtn').removeClass('disabled');

    });

    // Temporary showing extra cards, need changes
    // TODO: Implement Card class first


    // console.assert(publicCards,
    //     "GameHasStarted Error: Public (Extra) Cards Not Received!");

    // if (publicCards.length > 0) {
    //     publicCards.forEach(element => {
    //         if (element.roomId) {
    //             addExtraCardToBox(element.room.name);
    //         }
    //         else if (element.weaponId) {
    //             addExtraCardToBox(element.weapon.name);
    //         }
    //         else {
    //             addExtraCardToBox(element.character.name);
    //         }
    //     });
    // }
});


function getWeaponSet() {
    let gameSessionJsonAfterStart = getGameSessionJsonAfterStart().gameSession; // After host starts game, gameSession json format changes

    let weaponList = gameSessionJsonAfterStart.weapons;

    if (weaponList.length === 6) {
        allWeaponSet = new Set(weaponList);
    }
    else {
        console.error("getWeaponSet Error: Number of weapons is not 6.");
    }
}

function getRoomSet() {
    let gameSessionJsonAfterStart = getGameSessionJsonAfterStart().gameSession; // After host starts game, gameSession json format changes

    let boardRoomList = gameSessionJsonAfterStart.board;
    // Format: {id: 64, x: 0, y: 0, room: {id: 1, name: "Study Room"}, players: [], isHallway: false}

    if (boardRoomList.length >= 9) {

        allBoardRoomSet = new Set();
        allRoomSet = new Set();

        boardRoomList.forEach(boardRoom => {
            if (boardRoom.room) {
                allBoardRoomSet.add(boardRoom);
                allRoomSet.add(boardRoom.room);
            }

            // else {
            //     console.log("getRoomSet: boardRoom format error. ID: " + boardRoom.id);
            // }
        });

        console.log("getRoomSet: Room list saved.");
    }
    else {
        console.error("getRoomSet: Number of rooms < 9");
    }
}

function displayRoomNames() {
    if (allBoardRoomSet.size == 9) {

        allBoardRoomSet.forEach(boardRoom => {
            let spacecontent_texts_id = "spacecontent_texts-" + boardRoom.x + boardRoom.y;

            let roomName = boardRoom.room.name;
            if (roomName.length > 6) {
                roomName = roomName.slice(0, 6) + "- " + roomName.slice(6);
            }

            $("#" + spacecontent_texts_id).html();
        });
    }
    else {
        console.error('displayRoomNames Error: board size is not 9');
    }
}