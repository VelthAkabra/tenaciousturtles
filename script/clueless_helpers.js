// function addTokenToBoardByPlayerObj(player) {
//     if (player instanceof Player) {
//         var tokenColor = player.getToken().getColor();

//         if (tokenColor) {
//             addTokenToBoard(tokenColor, player.getToken().getCoordinates());
//             return true;
//         }
//         else {
//             console.error("addTokenToBoardByPlayerObj: player doesn't yet have a token color");
//         }
//     }
//     else {
//         console.error("addTokenToBoardByPlayerObj: argument is not an Player object");
//     }

//     return false;
// }

function updatePlayerInObjList(playerId, newCharName, newCharColor) {
    player_obj_list.forEach(player => {
        if (player.getId() == playerId) {
            player.setName(newCharName);
            player.setTokenColor(newCharColor);

            return true;
        }
    });
    return false;
}

// Use only for player to choose character "before host starts game"
function deleteAvailChar(characterId) {

    if (availCharSet.size > 0) {
        availCharSet.forEach(element => {
            if (element.id == characterId) {
                availCharSet.delete(element);

                return true;
            }
        })
    }
    return false;
}


function getGameSessionJson() {

    let gameSessionJson = JSON.parse(sessionStorage.getItem("gameSessionJson"));
    return gameSessionJson;
}

function getGameSessionJsonAfterStart() {
    let gameSessionJsonAfterStart = JSON.parse(sessionStorage.getItem("gameSessionJsonAfterStart"));
    return gameSessionJsonAfterStart;
}

function getCharacterSet() {
    let gameSessionJson = getGameSessionJson(); // Before host starts game

    let characterList = gameSessionJson.characters;

    if (characterList.length === 6) {
        return new Set(characterList);
    }
    else {
        return null;
    }
}

function getAvailableCharacterSet() {
    let gameSessionJson = getGameSessionJson();

    let characterList = gameSessionJson.characters;

    if (characterList.length === 6) {
        let availCharSet = new Set(characterList);
        availCharSet.forEach(element => {
            if (!element.isAvailable) {
                availCharSet.delete(element);
            }
        })

        return availCharSet;
    }
    else {
        return null;
    }
}

// Use only for player to choose character "before host starts game"
function getCharName(charSelectId) {
    playerCharName = '';
    allCharSet.forEach(element => {
        // Here use element.id instead of element.character.id for player's character selection
        if (element.id == charSelectId) {
            playerCharName = element.character.name;
        }
    })
    return playerCharName;
}

// Use only for player to choose character "before host starts game"
function getCharColor(charSelectId) {
    playerCharColor = '';
    allCharSet.forEach(element => {
        // Here use element.id instead of element.character.id for player's character selection
        if (element.id == charSelectId) {
            playerCharColor = element.character.color;
        }
    })
    return playerCharColor;
}

function chooseCharater(charId) {
    var url = 'https://clue-app-service-windows.azurewebsites.net/api/GameSessions/' +
        gameId + '/character/' + charId + '/select';
    return fetch(url, {
        method: 'GET',
        // mode: 'no-cors',
        // credentials: 'same-origin',
        // redirect: 'error',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    }).then(response => {

        if (response.ok && response.status == 200) {

            deleteAvailChar(charId);

            var newCharName = getCharName(charId);
            var newCharColor = getCharColor(charId);
            addToLog('You (Player ' + currentPlayerId + ') have chosen the character name "' + newCharName + '"');

            currentPlayObj = new Player(currentPlayerId, newCharName, newCharColor, true);
            player_obj_list.push(currentPlayObj);

            return true;
        }

        else if (response.status == 400 || response.status == 403) {
            console.error('chooseCharater Error: ', response.status + ' ' + response.statusText);
            throw 'Choose character failed.';
        }
        else {
            console.error('chooseCharater Error: ', response.status + ' ' + response.statusText);
            throw 'Choose character failed.';
        }

    }).catch((error) => {
        console.error('chooseCharater ErrorMsg: ', error);
        return false;
    });
}

function isRoom(coordinates) {
    let spaceTileID = 'tile-' + coordinates[0] + coordinates[1];
    let spaceElement = document.getElementById(spaceTileID);

    if (typeof (spaceElement) != 'undefined' && spaceElement != null) {

        if (spaceElement.classList.contains('roomtile')) {
            return true;
        }
    }
    return false;
}

function isHallway(coordinates) {

    let spaceTileID = 'tile-' + coordinates[0] + coordinates[1];
    let spaceElement = document.getElementById(spaceTileID);

    if (typeof (spaceElement) != 'undefined' && spaceElement != null) {

        if (spaceElement.classList.contains('verthalltile') ||
            spaceElement.classList.contains('horihalltile')) {
            return true;
        }
    }

    return false;

}

// function clickRoom(e) {
//     var badCoords = ['11', '13', '31', '33']

//     var tileName = e['path'][0]['id'];
//     var tileCoord = tileName.split('-')[1];

//     var isBad = false;
//     if (badCoords.includes(tileCoord)) {
//         isBad = true;
//     }

//     if (isBad) {
//         return;
//     }

//     console.log(tileCoord);
// }

function addYourCardToBox(name) {
    var carddisplay = document.getElementById("your_card_display");
    var card = document.createElement("div");
    card.setAttribute("id", name);
    card.setAttribute("class", "playercard");
    var cardtext = document.createElement("p");
    cardtext.innerHTML = name;
    card.appendChild(cardtext);

    // card.addEventListener('click', function (e) {
    //     console.log(e['path'][0]['id']);
    // });

    carddisplay.appendChild(card);
}

function addExtraCardToBox(name) {
    var carddisplay = document.getElementById("extra_card_display");
    var card = document.createElement("div");
    card.setAttribute("id", name);
    card.setAttribute("class", "extracard");
    var cardtext = document.createElement("p");
    cardtext.innerHTML = name;
    card.appendChild(cardtext);

    // card.addEventListener('click', function (e) {
    //     console.log(e['path'][0]['id']);
    // });

    carddisplay.appendChild(card);
}

function addPlayerToListBox(player_id, player_name = '', color = '') {

    let playerOnListDiv = document.getElementById('player_entry-' + player_id);

    if (playerOnListDiv) {
        console.assert(player_name && color, "addPlayerToListBox: change failed with invalid new player name or color.");
        modifyPlayerOnListBox(player_id, player_name, color);

        console.log("addPlayerToListBox: The player " + player_id + " exists on the list. Changed name and color.");
    }

    else {
        let playerlistdiv = document.getElementById('playerlist_box');
        console.assert(playerlistdiv, "addPlayerToListBox: playerlistdiv does not exist.");
        let newplayer = document.createElement("div");
        newplayer.setAttribute("id", "player_entry-" + player_id);

        let display_name = player_name || ("Player " + player_id);

        if (player_id == currentPlayerId) {
            display_name += ' (You)';
        }

        if (color && player_name) {
            newplayer.innerHTML = '<div class="dot ' + color + '"></div>' + display_name;
        }
        else {
            newplayer.innerHTML = display_name;
        }

        // newplayer.style.color = color;
        playerlistdiv.appendChild(newplayer);

        console.log("addPlayerToListBox: The player " + player_id + " added the list.");
    }

}

function modifyPlayerOnListBox(player_id, new_name, color) {

    console.assert(new_name, "modifyPlayerOnListBox: New name cannot be blank!");
    console.assert(tokenColors.includes(color), "modifyPlayerOnListBox: " + color + "is not a valid color!");

    let playerOnListDiv = document.getElementById('player_entry-' + player_id);

    let display_name = new_name;

    if (playerOnListDiv) {

        if (player_id == currentPlayerId) {
            display_name += ' (You)';
        }

        playerOnListDiv.innerHTML = '<div class="dot ' + color + '"></div>' + display_name;
        console.log("modifyPlayerOnListBox: Changed name and color for player " + player_id);
        return true;
    }
    else {
        console.error("modifyPlayerOnListBox: The player " + player_id + "does not exist on the list.");
        return false;
    }
}

function addToLog(text) {
    var textlog = document.getElementById('textlog_box');
    var newentry = document.createElement("p");
    newentry.innerHTML = text;
    textlog.appendChild(newentry);

    textlog.scrollTop = textlog.scrollHeight;

}

function getPlayerById(player_id) {
    let playerToReturn = null;
    if (player_obj_list.length > 0) {
        player_obj_list.forEach(player => {
            if (player.getId() == player_id) {
                playerToReturn = player;
            }
        });
    }

    return playerToReturn;
}


function getPlayerByCharName(char_name) {

    let playerToReturn = null;

    if (player_obj_list.length > 0) {
        player_obj_list.forEach(player => {
            if (player.getName() == char_name) {
                playerToReturn = player;
            }
        });
    }

    return playerToReturn;
}

function getRoomNameByCoord(coordinates) {

    let roomName = null;

    if (isHallway(coordinates)) {
        return "Hallway";
    }
    
    allBoardRoomSet.forEach(boardRoom => {
        if (boardRoom.x == coordinates[0] && boardRoom.y == coordinates[1]) {
            roomName = boardRoom.room.name;
        }
    });

    if (roomName == null) {
        console.error('getRoomNameByCoord Error: ' + coordinates + ' does not have a room name.');
    }
    return roomName;
}

// After game started by host only
function getCharNameByCharId(charId) {

    console.assert(allCharSet.size == 6, "getCharNameByCharId Error: allCharSet size is not 6");

    let charName = null;

    allCharSet.forEach(char => {
        if (char.character.id == charId) {
            charName = char.character.name;
        }
    })

    if (!charName) {
        console.error("getCharNameByCharId Error: Character Id " + charId + " not found!");
    }

    return charName;
}

// After game started by host only
function getWeaponNameById(weaponId) {

    console.assert(allWeaponSet.size == 6, "getWeaponNameById Error: allWeaponSet size is not 6");

    let weaponName = null;

    allWeaponSet.forEach(weapon => {
        if (weapon.id == weaponId) {
            weaponName = weapon.name;
        }
    })

    if (!weaponName) {
        console.error("getWeaponNameById Error: Weapon Id " + weaponId + " not found!");
    }

    return weaponName;
}

// After game started by host only
function getRoomNameById(roomId) {

    console.assert(allRoomSet.size == 9, "getRoomNameById Error: allRoomSet size is not 9");

    let roomName = null;

    allRoomSet.forEach(room => {
        if (room.id == roomId) {
            roomName = room.name;
        }
    })

    if (!roomName) {
        console.error("getRoomNameById Error: Room Id " + roomId + " not found!");
    }

    return roomName;
}

function ajacentSpaceCoordSet(coordinates) {
    adjacent = new Set();

    adjacent.add([coordinates[0], (coordinates[1]+1)%4]);
    adjacent.add([coordinates[0], (coordinates[1]+3)%4]);
    adjacent.add([(coordinates[0]+1)%4, coordinates[1]]);
    adjacent.add([(coordinates[0]+3)%4, coordinates[1]]);

    adjacent.forEach(spaceCoord => {
        if (!isRoom(spaceCoord) && !isHallway(spaceCoord)) {
            adjacent.delete(spaceCoord);
        }
    });

    return adjacent;
}