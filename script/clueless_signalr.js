var hubURL = "https://clue-app-service-windows.azurewebsites.net/gameSessionHub";
const connection = new signalR.HubConnectionBuilder()
    .withUrl(hubURL).configureLogging(signalR.LogLevel.Information).build();

connection.onclose(async () => {
    await connectToHub();
});

connection.on("PlayerJoinedGame", function (message) {
    // console.log(message);

    // let gameId = message.gameSessionId;
    let playerId = message.playerId;
    // let userDisplayName = message.userDisplayName;

    if (playerId != currentPlayerId) {
        addPlayerToListBox(playerId, 'Player ' + playerId, '');
        addToLog('Player ' + playerId + ' has joined the game session.');

        if (isHost) {
            numberOfOtherJoinedPlayers++;

            if ((!$("#start_btn").hasClass("disabled")) &&
                (numberOfOtherReadyPlayers != numberOfOtherJoinedPlayers)) {
                $("#start_btn").addClass("disabled");
                $("#start_btn").off("click");
            }
        }
    }

});

connection.on("PlayerSelectedCharacter", function (message) {
    // console.log(message);

    // let gameId = message.gameSessionId;
    let playerId = message.playerId;
    let characterId = message.characterId;

    if (playerId != currentPlayerId) {

        if (isHost) {
            numberOfOtherReadyPlayers++;
        }

        var playerCharName = getCharName(characterId);
        var playerCharColor = getCharColor(characterId);

        deleteAvailChar(characterId);

        if ($('#selectCharModal').hasClass('show')) {
            let selectCharOptionElement = document.getElementById('selectCharOption-' + characterId);
            if (selectCharOptionElement) {
                selectCharOptionElement.parentElement.removeChild(selectCharOptionElement);
            }
        }

        addToLog('Character "' + playerCharName + '" has been selected by player ' + playerId + '.');

        let anotherPlayerObj = new Player(playerId, playerCharName, playerCharColor);
        player_obj_list.push(anotherPlayerObj);

    }
});

connection.on("GameCanStart", function (message) {
    // console.log(message);

    if (isHost) {
        if ($("#start_btn").hasClass("disabled") &&
            (numberOfOtherReadyPlayers == numberOfOtherJoinedPlayers) &&
            characterSelected && (numberOfOtherReadyPlayers >= 2)) {

            $("#start_btn").removeClass("disabled");

            $("#start_btn").click(function () {
                hostStartsGame();
            });
        }
    }

});

async function connectToHub() {
    try {
        await connection.start();
        console.log("SignalR Connected.");

        await connection.invoke("JoinGameSessionEvents", gameId);
        console.log("JoinGameSessionEvents has been invoked.");
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
}