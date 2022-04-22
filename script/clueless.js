const ClassicRoomNames = ['Study Room', 'Library', 'Conservatory', 'Hall',
    'Billiard Room', 'Ballroom', 'Lounge', 'Dining Room', 'Kitchen'];

const ClassicCharacterNames = ['Miss Scarlett', 'Colonel Mustard',
    'Mrs. White', 'Mr. Green', 'Mrs. Peacock', 'Professor Plum'];

const tokenColors = ['red', 'yellow', 'white', 'green', 'blue', 'plum'];

var player_obj_list = [];

// Character entry format:
// {id: 43, character: {id: 1, name: "Mr. Green", color: "green"}, isAvailable: true}
var allCharSet = null;
var availCharSet = null;

// boardRoom entry format:
// {id: 65, x: 0, y: 2, room: {id: 2, name: "Library"}, players: [], isHallway: false}
var allBoardRoomSet = null;

// room entry format:
// {id: 2, name: "Library"}
var allRoomSet = null;

var allWeaponSet = null;

var cards = new Set();  // depends on 'allCards' returned in 'gameSession' JSON from server

var gameId = sessionStorage.getItem('gameId');
var accessToken = getCookie('accessToken');
var currentPlayerDatabaseId = parseJwt(accessToken).id;
var currentPlayerId = sessionStorage.getItem('currentPlayerId');
var currentPlayObj = null;

var characterSelected = false;
var numberOfOtherReadyPlayers = 0; // for host use only
var numberOfOtherJoinedPlayers = 0; // for host use only

var isHost = sessionStorage.getItem('playerType') === 'host';
var gameStarted = false;


$(document).on('show.bs.modal', '#selectCharModal', function () {

    $('.modal-dialog').draggable({
        "handle": ".modal-header"
    });

    $("#selectCharModalError").hide();

    let selectCharOptionsElement = document.getElementById('selectCharOptions');

    availCharSet.forEach(character => {
        let newOption = document.createElement("option");
        newOption.setAttribute("id", "selectCharOption-" + character.id);
        newOption.value = character.id;
        newOption.text = character.character.name;
        selectCharOptionsElement.add(newOption);
    });

    $("#selectCharSubmitBtn").click(function () {

        let choiceValue = selectCharOptionsElement.value;

        let selectCharModalError_Btn_Html = '<button id="selectCharModalErrorBtn" type="button" class="close"' +
            'aria-label="Close"><span aria-hidden="true">&times;</span></button>';

        if (choiceValue) {

            chooseCharater(choiceValue).then((res) => {
                // console.log(res);
                characterSelected = res;

                if (!characterSelected) {
                    $("#selectCharModalError").html(selectCharModalError_Btn_Html +
                        "Character Selection Failed.<br>Please select again.");
                    $("#selectCharModalError").fadeIn(300);

                    $('#selectCharModalErrorBtn').click(function () {
                        $("#selectCharModalError").hide();
                    });
                }
                else {
                    $("#selectCharModal").modal('hide');
                }
            });

        }

        else {
            $("#selectCharModalError").html(selectCharModalError_Btn_Html +
                "No Selection Made.<br>Please select one below.");
            $("#selectCharModalError").fadeIn(300);

            $('#selectCharModalErrorBtn').click(function () {
                $("#selectCharModalError").hide();
            });
        }
    });

});


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

window.onload = async function () {


    // $.getScript('/script/classes.js');
    // $.getScript('/script/utilities.js');

    document.getElementById('gameIDDisplay').innerHTML = "Your Game Code is " +
        sessionStorage.getItem('gameCode');

    if (isHost) {
        $('#start_btn').removeClass('d-none');
    }

    pageSetUp();
    window.addEventListener("resize", pageSetUp);


    allCharSet = getCharacterSet();
    availCharSet = getAvailableCharacterSet();

    var existing_players_list = getGameSessionJson().players;

    if (existing_players_list.length > 0) {
        existing_players_list.forEach(element => {
            if (element.userId == currentPlayerDatabaseId) {
                // element.id, not userId, is used for identication in the game session
                console.assert(currentPlayerId == element.id, "currentPlayerId does not match");
            }
            else {
                if (element.selectedCharacterId) {

                    let charName = getCharName(element.selectedCharacterId);
                    let charColor = getCharColor(element.selectedCharacterId);
                    let anotherPlayerObj = new Player(element.id, charName, charColor);

                    player_obj_list.push(anotherPlayerObj);
                    addToLog('Player ' + element.id + ' ("' + charName + '") is in the game session');
                }

                else {
                    addPlayerToListBox(element.id);

                    addToLog("Player " + element.id + " is in the game session");
                }
            }
        })
    }

    // console.assert(currentPlayerId, "Error: Current Player ID not available!");

    await connectToHub();


    addPlayerToListBox(currentPlayerId);


    $("#ModalsToInclude").load("/clueless_modals.html", function () {
        $("#selectCharModal").modal('show');

    });

    //const [first] = availCharSet;

    //chooseCharater(first.id);

    // Clickable Areas - Will be replaced

    // var anchors = document.getElementsByTagName('div');
    // for (var i = 0; i < anchors.length; i++) {
    //     var anchor = anchors[i];
    //     var id = anchor.getAttribute('id');
    //     if (id != undefined) {
    //         if (id.includes("tile")) {
    //             anchor.onclick = function (e) {
    //                 clickRoom(e);
    //             }
    //         }
    //     }
    // }

    // Tests
    

}
