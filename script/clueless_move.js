var movedSteps = 0;

/**
 * 
 * @param {*} spaceSet Set of coordinates in the form of [x,y]
 */
function highlighSpaces(spaceSet) {
    spaceSet.forEach(coordinates => {

        console.assert(isRoom(coordinates) || isHallway(coordinates),
            "highlighSpaces Error: " + coordinates + " is invalid");

        let tileId = "tile-" + coordinates[0] + coordinates[1];
        $("#" + tileId).animate({
            borderColor: "lime",
            borderWidth: "3px"
        });

        // let border_original_color = $("#" + tileId).css("border-color");
        // let border_original_width = $("#" + tileId).css("border-width");
        // let border_original_style = $("#" + tileId).css("border-style");


        $("#" + tileId).hover(function () {
            // alert(coordinates);
            // $(this).animate({
            //     outlineColor: "blue"
            // }, 1)

            $("#" + tileId).css("border-color", "blue");
        }, function () {
            // $(this).animate({
            //     outlineColor: "lime"
            // }, 1)
            $("#" + tileId).css("border-color", "lime");
        });

        // let spacecontentId = "spacecontent-" + coordinates[0] + coordinates[1];

        $("#" + tileId).click(function () {
            clickSpace(coordinates, spaceSet);
        });

        // $("#" + spacecontentId).click(function() { 
        //     clickSpace(coordinates); 
        // });


    });
}

function stopHighlighSpaces(spaceSet) {

    spaceSet.forEach(coordinates => {

        console.assert(isRoom(coordinates) || isHallway(coordinates),
            "stopHighlighSpaces Error: " + coordinates + " is invalid");

        let tileId = "tile-" + coordinates[0] + coordinates[1];
        $("#" + tileId).css("border-color", "black");
        $("#" + tileId).css("border-width", "1px");

        $("#" + tileId).off("mouseenter mouseleave");

        $("#" + tileId).off('click');

    });
}

function clickSpace(coordinates, spaceSet) {

    let success = false;

    // TODO: assert it's the player's turn
    if (!gameStarted) {
        console.error("clickSpace Error: Game has not started by host.");
        return false;
    }


    async function fetchMove() {
        let moveUrl = 'https://clue-app-service-windows.azurewebsites.net/api/GameSessions/' +
            gameId + '/move';

        let coordJson = JSON.stringify({ 'x': coordinates[0], 'y': coordinates[1] });
        console.log(coordJson);

        let response = await fetch(moveUrl, {
            method: 'PUT',
            redirect: 'error',
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: coordJson
        });

        if (!response.ok) {
            const message = `fetchMove Error: ${response.status} - ${response.statusText}`;
            throw new Error(message);
        }

        let responseJson = await response.json();
        return responseJson;

    }

    fetchMove().then(responseJson => {
        console.log(responseJson);

        stopHighlighSpaces(spaceSet);

        currentPlayObj.moveToken(coordinates);

        addToLog("You have moved to " + getRoomNameByCoord(coordinates));

        success = true;


        // Temporary
        // TODO: Remove

        if (isRoom(currentPlayObj.getToken().getCoordinates()) && (currentPlayObj.getToken().getCoordinates()[0] != 2 ||
            currentPlayObj.getToken().getCoordinates()[1] != 2)) {

            $("#suggestModal").modal('show');

            let selectWeaponElement = document.getElementById('suggest-weapon-select');
            let selectSuspectElement = document.getElementById('suggest-character-select');

            allCharSet.forEach(character => {

                // Must use character.character.id, character.character.name, etc, for accusation
                let newOptionId = "suggest-select-character-entry-" + character.character.id;
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

                let newOptionId = "suggest-select-weapon-entry-" + weapon.id;
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
        }

        $("#suggestSubmitBtn").click(function() {
            $("#suggestModal").modal('hide');
            let charChoiceValue = document.getElementById('suggest-character-select').value;
            let weaponChoiceValue = document.getElementById('suggest-weapon-select').value;
            let roomName = getRoomNameByCoord(currentPlayObj.getToken().getCoordinates());

            let roomValue = null;
            allRoomSet.forEach(room => {
                if (room.name == roomName) {
                    roomValue = room.id;
                }
            });

            let notYetDisproved = true;

            cards.forEach(card => {
                if (card instanceof RoomCard) {
                    if (card.getName() == roomName && card.getPlayerId() &&
                        card.getPlayerId() != currentPlayerId && notYetDisproved) {
                        notYetDisproved = false;
                        addToLog(getPlayerById(card.getPlayerId()).getName() + " disproved your suggestion!");
                        addToLog("He/She has the card " + roomName);
                    }
                }

                else if (card instanceof WeaponCard) {
                    if (card.weaponId == weaponChoiceValue && card.getPlayerId() &&
                        card.getPlayerId() != currentPlayerId && notYetDisproved) {
                        notYetDisproved = false;
                        addToLog(getPlayerById(card.getPlayerId()).getName() + " disproved your suggestion!");
                        addToLog("He/She has the card " + card.getName());
                    }
                }

                else if (card instanceof CharacterCard) {
                    if (card.characterId == charChoiceValue && card.getPlayerId() &&
                        card.getPlayerId() != currentPlayerId && notYetDisproved) {
                        notYetDisproved = false;
                        addToLog(getPlayerById(card.getPlayerId()).getName() + " disproved your suggestion!");
                        addToLog("He/She has the card " + card.getName());
                    }
                }
            })
        })

        // End of to-be-removed part

    }).catch(e => {
        console.error('fetchMove Error:' + e.name + ': ' + e.message);
        addToLog("Move to " + getRoomNameByCoord(coordinates) + " failed!");
    });

    return success;
}


connection.on("PlayerHasMoved", function (message) {
    console.log(message);

    // Temporary, TODO: remove
    movedSteps++;
    // End of to-be-removed

    sessionStorage.setItem('PlayerHasMovedBroadcast', message);

    let movedPlayerId = message.player.id;

    if (movedPlayerId != currentPlayerId) {
        let toSpaceX = message.toRoom.x;
        let toSpaceY = message.toRoom.y;
        let toCoord = [toSpaceX, toSpaceY];

        let movedPlayer = getPlayerById(movedPlayerId);
        movedPlayer.moveToken(toCoord);

        addToLog(getPlayerById(movedPlayerId).getName() + " has moved to " + getRoomNameByCoord(toCoord));

        // Temporary, need to change
        // TODO: Remove all following
        stopHighlighSpaces(new Set([toCoord]));

        if (movedSteps == 4) {
            highlighSpaces(ajacentSpaceCoordSet(currentPlayObj.getToken().getCoordinates()));
        }

    }

    else {

        

    }

});