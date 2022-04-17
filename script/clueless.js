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

function addCard(name) {
    var carddisplay = document.getElementsByName("carddisplay")[0];
    var card = document.createElement("div");
    card.setAttribute("id", name);
    card.setAttribute("class", "playercard");
    var cardtext = document.createElement("p");
    cardtext.innerHTML = name;
    card.appendChild(cardtext);

    card.addEventListener('click', function (e) {
        console.log(e['path'][0]['id']);
    });

    carddisplay.appendChild(card);
}

function addPlayerToList(player) {
    var playerlistdiv = document.getElementsByName('playerlist')[0];
    var newplayer = document.createElement("p");
    newplayer.innerHTML = player;
    playerlistdiv.appendChild(newplayer);
}

function addToLog(text) {
    var textlog = document.getElementsByName('textlog')[0];
    var newentry = document.createElement("p");
    newentry.innerHTML = text;
    textlog.appendChild(newentry);
}

window.onload = function () {
    document.getElementById('gameIDDisplay').innerHTML = "Your Game Code is " + getCookie('code')

    var gameColWidth = $('.gameCol').width();
    $('.roomtile').css({ 'height': gameColWidth + 'px' });
    $('.verthalltile').css({ 'height': gameColWidth + 'px' });
    $('.horihalltile').css({ 'height': gameColWidth/2.0 + 'px' });
    $('.blanktile').css({ 'height': gameColWidth + 'px' });




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

    addCard("test");
    addCard("test");
    addCard("test");
    addCard("test");
    addCard("test");
    addCard("test");
    addCard("test");
}
