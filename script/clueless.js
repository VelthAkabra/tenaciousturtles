const ClassicRoomNames = ['Study Room', 'Library', 'Conservatory', 'Hall',
    'Billiard Room', 'Ballroom', 'Lounge', 'Dining Room', 'Kitchen'];

const ClassicCharacterNames = ['Miss Scarlett', 'Colonel Mustard',
    'Mrs. White', 'Mr. Green', 'Mrs. Peacock', 'Professor Plum'];

const tokenColors = []

var player_obj_list = ['red', 'yellow', 'white', 'green', 'blue', 'plum'];


function connectToHub() {
    hubURL = "https://clue-app-service-windows.azurewebsites.net/api/gameSessionHub";
    var connection = new signalR.HubConnectionBuilder().withUrl(hubURL).build();

    var gameId = sessionStorage.getItem('gameId');

    connection.start().then(res => {
        connection.invoke("JoinGameSessionEvents", gameId)
            .then(msg => {
                console.log(msg);
            })
            .catch(err => {
                console.error(err);
            });
    }).catch(err => {
        console.error(err);
    });;

    connection.on("PlayerJoinedGame", function (user, message) {
        console.log(user);
        console.log(message);
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

    if ( (!isHallway(coordinates)) && (!isRoom(coordinates)) ) {
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

        else if(isHallway(coordinates) && dotsDivElement.querySelector(".dot")) {
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

function addPlayerToList(player_name, color = 'black', index = 9) {
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

    // connectToHub();

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

    addYourCard("test");
    addYourCard("test");
    addYourCard("test");
    addYourCard("test");
    addYourCard("test");
    addYourCard("test");

    addExtraCard("Mr.Green");
    addExtraCard("Mr.Green");
    addExtraCard("Mr.Green");

    addToLog("dafasdfasdfdsaljflasd jf;ldsajf;lsadjf ;ldsajfsa ;ldjfkldsajflkdsajfldsakjflsakdjaldsf");


    addPlayerToList("Mr. Green", 'plum');
    addPlayerToList("Mr. Green", 'yellow');
    addPlayerToList("Mr. Green", 'white');
    addPlayerToList("Mr. Plum");
    addPlayerToList("Colonel Mustard");
    addPlayerToList("Miss Scarlett");

    addToken('yellow', [0, 2]);
    addToken('red', [1,0]);
    addToken('red', [1,1]);
    addToken('red', [2,2]);
    addToken('red', [2,3]);
    addToken('red', [2,2]);

}
