$(document).ready(function () {

    $("#accuseBtn").click(function () {
        $("#accuseModal").modal('show');
    });

});

$(document).on('show.bs.modal', '#accuseModal', function () {

    $('.modal-dialog').draggable({
        "handle": ".modal-header"
    });

    let selectWeaponElement = document.getElementById('accuse-weapon-select');
    let selectSuspectElement = document.getElementById('accuse-character-select');
    let selectRoomElement = document.getElementById('accuse-room-select');

    allCharSet.forEach(character => {

        // Must use character.character.id, character.character.name, etc, for accusation
        let newOptionId = "accuse-select-character-entry-" + character.character.id;
        if ($('#' + newOptionId).length) {

        }
        else {
            let newOption = document.createElement("option");
            newOption.setAttribute("id", newOptionId);
            newOption.value = character.character.id;
            newOption.text = character.character.name;
            selectSuspectElement.add(newOption);
        }

    });

    allWeaponSet.forEach(weapon => {

        let newOptionId = "accuse-select-weapon-entry-" + weapon.id;
        if ($('#' + newOptionId).length) {

        }
        else {
            let newOption = document.createElement("option");
            newOption.setAttribute("id", newOptionId);
            newOption.value = weapon.id;
            newOption.text = weapon.name;
            selectWeaponElement.add(newOption);
        }

    });

    allRoomSet.forEach(room => {

        let newOptionId = "accuse-select-room-entry-" + room.id;
        if ($('#' + newOptionId).length) {

        }
        else {
            let newOption = document.createElement("option");
            newOption.setAttribute("id", newOptionId);
            newOption.value = room.id;
            newOption.text = room.name;
            selectRoomElement.add(newOption);
        }

    });

    $("#accuseSubmitBtn").click(function () {

        console.assert(gameStarted, "accuseSubmitBtn clicked by mistake: Game has not been started by host.");

        let charChoiceValue = selectSuspectElement.value;
        let weaponChoiceValue = selectWeaponElement.value;
        let roomChoiceValue = selectRoomElement.value;

        let assucationJson = JSON.stringify({
            "roomId": roomChoiceValue, "characterId": charChoiceValue,
            "weaponId": weaponChoiceValue
        });

        console.log(assucationJson);

        // alert("You accused: Weapon id: " + weaponChoiceValue + " Character id: " + charChoiceValue +
        //     " Room id: " + roomChoiceValue);

        fetchAccuse(assucationJson).then(responseJson => {
            console.log(responseJson);
            // alert("Accusation Made!");
        }).catch(e => {
            console.error('fetchAccuse Error:' + e.name + ': ' + e.message);
            addToLog("Failed to make the accusation!");
        });


    });

});

async function fetchAccuse(assucationJson) {
    let accuseUrl = 'https://clue-app-service-windows.azurewebsites.net/api/GameSessions/' +
        gameId + '/accusation';

    let response = await fetch(accuseUrl, {
        method: 'PUT',
        redirect: 'error',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        body: assucationJson
    });

    if (!response.ok) {
        const message = `fetchAccuse Error: ${response.status} - ${response.statusText}`;
        throw new Error(message);
    }

    let responseJson = await response.json();
    return responseJson;

}

connection.on("PlayerMadeAnAccusation", function (message) {
    console.log(message);

    $("#accuseModal").modal('hide');
    $("#accuseResultModal").modal('show');

    $('.modal-dialog').draggable({
        "handle": ".modal-header"
    });

    let madeByPlayerId = message.player.id;

    let madeByPlayerName = getPlayerById(madeByPlayerId).getName();

    let accuesedCharId = message.characterId;
    let accusedWeaponId = message.weaponId;
    let accusedRoomId = message.roomId;

    let wasCorrect = message.wasCorrect;

    let accusedCharName = getCharNameByCharId(accuesedCharId);
    let accusedWeaponName = getWeaponNameById(accusedWeaponId);
    let accusedRoomName = getRoomNameById(accusedRoomId);

    if (madeByPlayerId != currentPlayerId) {

        $("#accuseResultModal_title").html(madeByPlayerName + " Made an Accusation");



    }

    else {
        $("#accuseResultModal_title").html("You Made an Accusation");
    }

    $("#accuseResultModal_room_name").html(accusedRoomName);
    $("#accuseResultModal_weapon_name").html(accusedWeaponName);
    $("#accuseResultModal_character_name").html(accusedCharName);

    if (wasCorrect) {
        $("#accuseResultModal_result").html("<strong>The accusation was correct!</strong>");

    }

    else {
        $("#accuseResultModal_result").html("<strong>The accusation was incorrect!</strong>");
        $("#accuseResultBtn").html("Continue");
        $("#accuseResultBtn").removeClass("d-none");

        $("#accuseResultBtn").click(function () {
            $("#accuseResultModal").modal('hide');
        });
    }

});