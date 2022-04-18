const ClassicRoomNames = ['Study Room', 'Library', 'Conservatory', 'Hall',
    'Billiard Room', 'Ballroom', 'Lounge', 'Dining Room', 'Kitchen'];

const ClassicCharacterNames = ['Miss Scarlett', 'Colonel Mustard',
    'Mrs. White', 'Mr. Green', 'Mrs. Peacock', 'Professor Plum'];

var player_obj_list = [];


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

function addPlayerToList(player) {
    var playerlistdiv = document.getElementById('playerlist_box');
    var newplayer = document.createElement("div");
    newplayer.innerHTML = player;
    playerlistdiv.appendChild(newplayer);
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

    addToLog("dafasdfasdfdsaljflasdjf;ldsajf;lsadjf;ldsajfsa;ldjfkldsajflkdsajfldsakjflsakdjaldsf");
    addToLog("dafasdfasdfdsaljflasdjf;ldsajf;lsadjf;ldsajfsa;ldjfkldsajflkdsajfldsakjflsakdjaldsf");
    addToLog("dafasdfasdfdsaljflasdjf;ldsajf;lsadjf;ldsajfsa;ldjfkldsajflkdsajfldsakjflsakdjaldsf");
    addToLog("dafasdfasdfdsaljflasdjf;ldsajf;lsadjf;ldsajfsa;ldjfkldsajflkdsajfldsakjflsakdjaldsf");
    addToLog("dafasdfasdfdsaljflasdjf;ldsajf;lsadjf;ldsajfsa;ldjfkldsajflkdsajfldsakjflsakdjaldsf");
    addToLog("dafasdfasdfdsaljflasdjf;ldsajf;lsadjf;ldsajfsa;ldjfkldsajflkdsajfldsakjflsakdjaldsf");
    addToLog("dafasdfasdfdsaljflasdjf;ldsajf;lsadjf;ldsajfsa;ldjfkldsajflkdsajfldsakjflsakdjaldsf");
    addToLog("dafasdfasdfdsaljflasdjf;ldsajf;lsadjf;ldsajfsa;ldjfkldsajflkdsajfldsakjflsakdjaldsf");
    addToLog("dafasdfasdfdsaljflasdjf;ldsajf;lsadjf;ldsajfsa;ldjfkldsajflkdsajfldsakjflsakdjaldsf");
    addToLog("dafasdfasdfdsaljflasdjf;ldsajf;lsadjf;ldsajfsa;ldjfkldsajflkdsajfldsakjflsakdjaldsf");
    addToLog("dafasdfasdfdsaljflasdjf;ldsajf;lsadjf;ldsajfsa;ldjfkldsajflkdsajfldsakjflsakdjaldsf");
    addToLog("dafasdfasdfdsaljflasdjf;ldsajf;lsadjf;ldsajfsa;ldjfkldsajflkdsajfldsakjflsakdjaldsf");
    addToLog("dafasdfasdfdsaljflasdjf;ldsajf;lsadjf;ldsajfsa;ldjfkldsajflkdsajfldsakjflsakdjaldsf");
    addToLog("dafasdfasdfdsaljflasdjf;ldsajf;lsadjf;ldsajfsa;ldjfkldsajflkdsajfldsakjflsakdjaldsf");
    addToLog("dafasdfasdfdsaljflasdjf;ldsajf;lsadjf;ldsajfsa;ldjfkldsajflkdsajfldsakjflsakdjaldsf");



    addPlayerToList("Mr. Green");
    addPlayerToList("Mr. Green");
    addPlayerToList("Mr. Green");
    addPlayerToList("Mr. Plum");
    addPlayerToList("Colonel Mustard");
    addPlayerToList("Miss Scarlett");
}
