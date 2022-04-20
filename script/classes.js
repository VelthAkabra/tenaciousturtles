// A Player object should only be created when the player has chosen the character (with valid name and color)
// Once a Player object is created, the name is automatically displayed in the Player List Box
// and the colored token is automatically adde to game board

class Player {

    constructor(player_id, name, color, isCurrentPlayer = false, tokenCoor = [2, 2]) {
        console.assert(name, "Player constructor error: Name cannot be blank!");
        console.assert(tokenColors.includes(color), "Player constructor error: " + color + "is invalid!");
        console.assert(tokenCoor.length == 2, "Player constructor error: Invalid coordinates " + tokenCoor);

        this.name = name;
        this.player_id = player_id; // immutable
        this.token = new Token(tokenCoor, color);
        this.isCurrentPlayer = isCurrentPlayer;

        addPlayerToListBox(player_id, name, color);
    }

    moveToken(newCoordinates) {

    }

    getId() {
        return this.player_id;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
        modifyPlayerOnListBox(this.player_id, name, this.color);
    }

    isCurrentPlayer() {
        return this.isCurrentPlayer;
    }

    setTokenCoor(coordinates) {
        this.token.setCoordinates(coordinates);
    }

    setTokenColor(color) {
        this.token.setColor(color);
        modifyPlayerOnListBox(this.player_id, this.name, color);
    }

    getToken() {
        return this.token;
    }


}


// A Token object should only be created by invoking Player constructor
// All functions should only be called through Player object functions

class Token {

    /**
     * Constructor of a character's token on the game board
     * 
     * @param {[int,int]} coordinates 
     * @param {string - one of 'red''yellow''white''green''blue''plum'} color 
     */

    #coordinates;
    #color;


    constructor(coordinates, color) {

        console.assert(tokenColors.includes(color), "Token constructor error: " + color + " is not a valid color!");
        console.assert(isHallway(coordinates) || isRoom(coordinates), "Token constructor error: " +
            JSON.stringify(coordinates) + " is not valid coordinates!");

        this.#coordinates = coordinates;
        this.#color = color; // immutable

        this.#addTokenToBoard(color, coordinates);

    }

    setCoordinates(coordinates) {

        console.assert(isHallway(coordinates) || isRoom(coordinates), "setCoordinates: " +
            JSON.stringify(coordinates) + " is not valid coordinates!");
        
        this.#coordinates = coordinates;

        this.#moveTokenOnBoard(this.#color, coordinates);
    }

    // setColor(color) {
    //     this.#color = color;

    //     // TODO: change color on token on board
    // }

    getCoordinates() {
        return this.#coordinates;
    }

    getCoordinateX() {
        return this.#coordinates[0];
    }

    getCoordinateY() {
        return this.#coordinates[1];
    }

    getColor() {
        return this.#color;
    }

    #moveTokenOnBoard(color, newCoordinates) {

        if (isSpaceAvailableForToken(color, newCoordinates)) {
            let dotDivID = "dotOnBoard-" + color;
            let dotElement = document.getElementById(dotDivID);

            dotElement.parentElement.removeChild(dotElement);
            if (this.#addTokenToBoard(color, newCoordinates)) {
                return true;
            }
        }
            return false;
    }



    #addTokenToBoard(color, coordinates) {

        // if (!tokenColors.includes(color)) {
        //     console.error('#addTokenToBoard: invalid color: ' + color);
        //     return false;
        // }

        if ((!isHallway(coordinates)) && (!isRoom(coordinates))) {
            console.error('#addTokenToBoard: invalid coordinates ' + JSON.stringify(coordinates));
            return false;
        }
        let dotsDivID = 'space_dots-' + coordinates[0] + coordinates[1];
        let dotsDivElement = document.getElementById(dotsDivID);

        if (typeof (dotsDivElement) != 'undefined' && dotsDivElement != null) {

            if (dotsDivElement.querySelector(".dot." + color)) {
                console.error("#addTokenToBoard: " + color + " dot exists in " + dotsDivID);
                return false;
            }

            else if (isHallway(coordinates) && dotsDivElement.querySelector(".dot")) {
                console.error('#addTokenToBoard: Hallway occupied ' + JSON.stringify(coordinates));
                return false;
            }
            else {
                //alert(color + "dot does not exist");

                let dotDiv = document.createElement("div");
                dotDiv.setAttribute("class", "dot " + color);
                dotDiv.setAttribute("id", "dotOnBoard-" + color);
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
            dotDiv.setAttribute("id", "dotOnBoard-" + color);

            dotsDivElement.appendChild(dotDiv);

            return true;

        }
    }

    #changeTokenColorOnBoard(newColor) {

    }
}

// Ideally, the following functions should only be invoked by Player and Token member methods

function doesTokenExistInSpace(coordinates, color) {

    let dotDivID = "dotOnBoard-" + color;
    let dotElement = document.getElementById(dotDivID);

    if (dotElement) {
        let parentDotsDivID = dotElement.parentElement.id; // "space_dots-xy"
        let x = parseInt(parentDotsDivID.charAt(11));
        let y = parseInt(parentDotsDivID.charAt(12));

        if (x && y) {
            if (coordinates[0] == x && coordinates[1] == y) {
                return true;
            }
        }
    }

    return false;
}

function getTokenCoordinates(color) {
    let dotDivID = "dotOnBoard-" + color;
    let dotElement = document.getElementById(dotDivID);

    if (dotElement) {
        let parentDotsDivID = dotElement.parentElement.id; // "space_dots-xy"
        let x = parseInt(parentDotsDivID.charAt(11));
        let y = parseInt(parentDotsDivID.charAt(12));

        if (x && y) {
            let coordinates = [x, y];
            return coordinates;
        }
    }

    return null;
}

function isSpaceAvailableForToken(color, coordinates) {
    if ((!isHallway(coordinates)) && (!isRoom(coordinates))) {
        return false;
    }

    let dotsDivID = 'space_dots-' + coordinates[0] + coordinates[1];
    let dotsDivElement = document.getElementById(dotsDivID);

    if (dotsDivElement) {

        if (dotsDivElement.querySelector(".dot." + color)) {
            return false;
        }

        else if (isHallway(coordinates) && dotsDivElement.querySelector(".dot")) {
            return false;
        }
    }

    return true;
}