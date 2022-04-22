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
        let newOption = document.createElement("option");
        newOption.setAttribute("id", "accuse-select-character-entry-" + character.id);
        newOption.value = character.id;
        newOption.text = character.name;
        selectSuspectElement.add(newOption);
    });

    allWeaponSet.forEach(weapon => {
        let newOption = document.createElement("option");
        newOption.setAttribute("id", "accuse-select-weapon-entry-" + weapon.id);
        newOption.value = weapon.id;
        newOption.text = weapon.name;
        selectWeaponElement.add(newOption);
    });

    allRoomSet.forEach(room => {
        let newOption = document.createElement("option");
        newOption.setAttribute("id", "accuse-select-room-entry-" + room.id);
        newOption.value = room.id;
        newOption.text = room.name;
        selectRoomElement.add(newOption);
    });

    $("#accuseSubmitBtn").click(function () {

        let charChoiceValue = selectSuspectElement.value;
        let weaponChoiceValue = selectWeaponElement.value;
        let roomChoiceValue = selectRoomElement.value;

        alert("You accused: Weapon id: " + weaponChoiceValue + " Character id: " + charChoiceValue +
            " Room id: " + roomChoiceValue);
    });

});