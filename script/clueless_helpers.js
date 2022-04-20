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

function getCharacterSet() {
    let gameSessionJson = getGameSessionJson();

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

function getCharName(charId) {
    playerCharName = '';
    allCharSet.forEach(element => {
        if (element.id == charId) {
            playerCharName = element.name;
        }
    })
    return playerCharName;
}

function getCharColor(charId) {
    playerCharColor = '';
    allCharSet.forEach(element => {
        if (element.id == charId) {
            playerCharColor = element.color;
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

function clickRoom(e) {
    var badCoords = ['11', '13', '31', '33']

    var tileName = e['path'][0]['id'];
    var tileCoord = tileName.split('-')[1];

    var isBad = false;
    if (badCoords.includes(tileCoord)) {
        isBad = true;
    }

    if (isBad) {
        return;
    }

    console.log(tileCoord);
}

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