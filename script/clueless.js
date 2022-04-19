const ClassicRoomNames = ['Study Room', 'Library', 'Conservatory', 'Hall',
    'Billiard Room', 'Ballroom', 'Lounge', 'Dining Room', 'Kitchen'];

const ClassicCharacterNames = ['Miss Scarlett', 'Colonel Mustard',
    'Mrs. White', 'Mr. Green', 'Mrs. Peacock', 'Professor Plum'];

const tokenColors = ['red', 'yellow', 'white', 'green', 'blue', 'plum'];

var player_obj_list = [];
var allCharSet = new Set();
var availCharSet = new Set();

var gameId = sessionStorage.getItem('gameId');
var accessToken = getCookie('accessToken');
var currentPlayerDatabaseId = parseJwt(accessToken).id;
var currentPlayerId = 0;

var hubURL = "https://clue-app-service-windows.azurewebsites.net/gameSessionHub";
const connection = new signalR.HubConnectionBuilder()
    .withUrl(hubURL).configureLogging(signalR.LogLevel.Information).build();

connection.onclose(async () => {
    await connectToHub();
});

connection.on("PlayerJoinedGame", function (message) {
    console.log(message);
    // let newPlayerJson = JSON.parse(message);

    let gameId = message.gameSessionId;
    let playerId = message.playerId;
    let userDisplayName = message.userDisplayName;

    var new_player = new Player(playerId);
    player_obj_list.push(new_player);

    addPlayerToList(playerId, userDisplayName, 'black');
    addToLog('Player "' + playerId +'" has joined the game session.');

});

connection.on("PlayerSelectedCharacter", function (message) {
    console.log(message);
    // let PlayerSelectedCharacterJson = JSON.parse(message);

    let gameId = message.gameSessionId;
    let playerId = message.playerId;
    let characterId = message.characterId;

    // let gameId = PlayerSelectedCharacterJson.gameSessionId;
    // let playerId = PlayerSelectedCharacterJson.playerId;
    // let characterId = PlayerSelectedCharacterJson.characterId;

    var playerCharName = getCharName(characterId);
    var playerCharColor = getCharColor(characterId);

    deleteAvailChar(playerId, characterId);
    addToLog('Character "' + playerCharName +'" has been selected by player '+ playerId + '.');
    
    modifyPlayerOnList(playerId, playerCharName, playerCharColor);
});

function deleteAvailChar(playerId, characterId) {

    if (availCharSet.size > 0) {
        availCharSet.forEach(element => {
            if (element.id == characterId) {
                availCharSet.delete(element);
            }
        })
    }

}

connection.on("PlayerDeselectedCharacter", function (message) {
    console.log(message);
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
    fetch(url, {
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
            var newCharName = getCharName(charId);
            addToLog('You have chosen the character name ' + newCharName);
            modifyPlayerOnList(currentPlayerId, newCharName, getCharColor(charId));
            return true;
        }

        else if (response.status == 400 || response.status == 403) {
            console.error('Error: ', response.status + ' ' + response.statusText);
            throw 'Choose character failed.';
        }
        else {
            console.error('Error: ', response.status + ' ' + response.statusText);
            throw 'Choose character failed.';
        }

    }).catch((error) => {
        console.error('ErrorMsg: ', error);
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

function addToken(color, coordinates) {

    if (!tokenColors.includes(color)) {
        console.error('addToken: invalid color: ' + color);
        return false;
    }

    if ((!isHallway(coordinates)) && (!isRoom(coordinates))) {
        console.error('addToken: invalid coordinates ' + JSON.stringify(coordinates));
        return false;
    }
    let dotsDivID = 'space_dots-' + coordinates[0] + coordinates[1];
    let dotsDivElement = document.getElementById(dotsDivID);

    if (typeof (dotsDivElement) != 'undefined' && dotsDivElement != null) {

        if (dotsDivElement.querySelector(".dot." + color)) {
            console.log(color + " dot exists in " + dotsDivID);
            return true;
        }

        else if (isHallway(coordinates) && dotsDivElement.querySelector(".dot")) {
            console.error('addToken: Hallway occupied ' + JSON.stringify(coordinates));
            return false;
        }
        else {
            //alert(color + "dot does not exist");

            let dotDiv = document.createElement("div");
            dotDiv.setAttribute("class", "dot " + color);
            dotsDivElement.appendChild(dotDiv);

            return true;
        }
    }

    else {
        dotsDivElement = document.createElement("div");
        dotsDivElement.setAttribute("class", "spacecontent_dots");
        dotsDivElement.setAttribute("id", dotsDivID);

        let parentTileElement = document.getElementById('tile-' + coordinates[0] + coordinates[1]);
        parentTileElement.appendChild(dotsDivElement);

        let dotDiv = document.createElement("div");
        dotDiv.setAttribute("class", "dot " + color);
        dotsDivElement.appendChild(dotDiv);

        return true;

    }
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

function addYourCard(name) {
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

function addExtraCard(name) {
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

function addPlayerToList(index, player_name, color) {
    var playerlistdiv = document.getElementById('playerlist_box');
    var newplayer = document.createElement("div");
    newplayer.setAttribute("id", "player_entry-" + index);
    if (color !== 'black') {
        newplayer.innerHTML = '<div class="dot ' + color + '"></div>' + player_name;
    }
    else {
        newplayer.innerHTML = player_name;
    }
    // newplayer.style.color = color;
    playerlistdiv.appendChild(newplayer);
    return newplayer;
}

function modifyPlayerOnList(index, new_name, color) {
    var playerOnListDiv = document.getElementById('player_entry-' + index);

    if (playerOnListDiv) {
        playerOnListDiv.innerHTML = '<div class="dot ' + color + '"></div>' + new_name;

    }
}

function addToLog(text) {
    var textlog = document.getElementById('textlog_box');
    var newentry = document.createElement("p");
    newentry.innerHTML = text;
    textlog.appendChild(newentry);

    textlog.scrollTop = textlog.scrollHeight;

}

function pageSetUp() {

    // Set the height of Game Board Spaces
    let gameColWidth = $('.gameCol').width();
    // console.log(gameColWidth);
    $('.roomtile').css({ 'height': gameColWidth + 'px' });
    $('.verthalltile').css({ 'height': gameColWidth + 'px' });
    $('.horihalltile').css({ 'height': gameColWidth / 2.0 + 'px' });
    $('.blanktile').css({ 'height': gameColWidth + 'px' });


    // Set the height of Player Cards
    let playerCardWidth = $('.yourcarddisplay').width() * 16.66 / 100.0;
    // console.log(playerCardWidth);
    $('.yourcarddisplay').css({ 'height': playerCardWidth * 1.8 + 'px' });

    // Set the height of Extra Cards
    let extraCardWidth = $('.extracarddisplay').width() * 33.33 / 100.0;
    $('.extracarddisplay').css({ 'height': extraCardWidth * 1.8 + 'px' });


    // Set the height of the player list box and textlog box
    let middledivHt = $('.middlediv').height();
    let playerlist_box_ht = middledivHt * .25;
    let textlog_box_ht = middledivHt * .58;
    $('#playerlist_box').css({ 'height': playerlist_box_ht + 'px' });
    $('#textlog_box').css({ 'height': textlog_box_ht + 'px' });

    // Set the height of the right side placeholder box
    let right_placeholder_box_ht = (middledivHt - extraCardWidth) * .6;
    $('#rightdiv_placeholder_box').css({ 'height': right_placeholder_box_ht + 'px' });


}

window.onload = function () {

    // $.getScript('/script/classes.js');
    // $.getScript('/script/utilities.js');

    document.getElementById('gameIDDisplay').innerHTML = "Your Game Code is " +
        sessionStorage.getItem('gameCode');

    if (sessionStorage.getItem('playerType') === 'host') {
        $('#start_btn').removeClass('d-none');
    }

    pageSetUp();
    window.addEventListener("resize", pageSetUp);

    $("#ModalsToInclude").load("./clueless_modals.partial");

    allCharSet = getCharacterSet();
    availCharSet = getAvailableCharacterSet();

    var players_list = getGameSessionJson().players;

    if (players_list.length > 0) {
        players_list.forEach(element => {
            if (element.userId == currentPlayerDatabaseId) {
                currentPlayerId = element.id;
            }
            else {
                let anotherPlayer = new Player(element.id);
                if (element.selectedCharacterId) {
                    anotherPlayer.setName(getCharName(element.selectedCharacterId));
                    anotherPlayer.setTokenColor(getCharColor(element.selectedCharacterId));
                    player_obj_list.push(anotherPlayer);
                    addPlayerToList(element.id, anotherPlayer.getName(), anotherPlayer.getToken().getColor());
                }
            }
        })
    }

    var currentPlayer = new Player(currentPlayerId, '', '', true, [2,2]);
    player_obj_list.push(currentPlayer);

    addPlayerToList(currentPlayerId, 'Player ' + currentPlayerId, 'black');

    connectToHub();

    const [first] = availCharSet;
    chooseCharater(first.id);

    // Clickable Areas - Will be replaced

    var anchors = document.getElementsByTagName('div');
    for (var i = 0; i < anchors.length; i++) {
        var anchor = anchors[i];
        var id = anchor.getAttribute('id');
        if (id != undefined) {
            if (id.includes("tile")) {
                anchor.onclick = function (e) {
                    clickRoom(e);
                }
            }
        }
    }

    // Tests

    // addYourCard("test");
    // addYourCard("test");
    // addYourCard("test");
    // addYourCard("test");
    // addYourCard("test");
    // addYourCard("test");

    // addExtraCard("Mr.Green");
    // addExtraCard("Mr.Green");
    // addExtraCard("Mr.Green");

    // addToLog("dafasdfasdfdsaljflasd jf;ldsajf;lsadjf ;ldsajfsa ;ldjfkldsajflkdsajfldsakjflsakdjaldsf");


    // addPlayerToList("Mr. Green", 'plum');
    // addPlayerToList("Mr. Green", 'yellow');
    // addPlayerToList("Mr. Green", 'white');
    // addPlayerToList("Mr. Plum");
    // addPlayerToList("Colonel Mustard");
    // addPlayerToList("Miss Scarlett");

    // addToken('yellow', [0, 2]);
    // addToken('red', [1, 0]);
    // addToken('red', [1, 1]);
    // addToken('red', [2, 2]);
    // addToken('red', [2, 3]);
    // addToken('red', [2, 2]);

}
