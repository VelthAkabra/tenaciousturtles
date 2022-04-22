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

    allRoomSet = getRoomSet();
    allWeaponSet = getWeaponSet();
    
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
                throw new Error("getPlayerById Error: The player" + cardPlayerId + " from card: " +
                cardName + " does not exist");
            }
            
        }

        cards.add(cardObj);

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