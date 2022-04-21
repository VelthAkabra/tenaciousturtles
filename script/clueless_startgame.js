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
            sessionStorage.setItem('gameStartedJson', JSON.stringify(responseJson));
        }).catch(e => {
            console.error('fetchStartGame Error:' + e.name + ': ' + e.message);
            addToLog("Game start failed!");
        });

    });

});

connection.on("GameHasStarted", function (message) {
    // console.log(message);

    addToLog("This game session has started!");

    if (isHost) {
        $('#start_btn').addClass('d-none');
    }
    
    // Temporary showing extra cards, need changes
    // TODO: Implement Card class first

    let publicCards = message.gameSession.publicCards;

    console.assert(publicCards,
        "GameHasStarted Error: Public (Extra) Cards Not Received!");

    if (publicCards.length > 0) {
        publicCards.forEach(element => {
            if (element.roomId) {
                addExtraCardToBox(element.room.name);
            }
            else if (element.weaponId) {
                addExtraCardToBox(element.weapon.name);
            }
            else {
                addExtraCardToBox(element.character.name);
            }
        });
    }
});