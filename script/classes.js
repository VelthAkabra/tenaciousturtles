class Player {

    constructor(player_id, name = '', color = '', isCurrentPlayer = false, tokenCoor = [2,2]) {
        this.name = name;
        this.player_id = player_id;
        this.token = new Token(tokenCoor, color);
        this.isCurrentPlayer = isCurrentPlayer;
    }

    getId() {
        return this.player_id;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    isCurrentPlayer() {
        return this.isCurrentPlayer;
    }

    setTokenCoor(coordinates) {
        this.token.setCoordinates(coordinates);
    }

    setTokenColor(color) {
        this.token.setColor(color);
    }

    getToken() {
        return this.token;
    }

    
}

class Token {

    /**
     * Constructor of a character's token on the game board
     * 
     * @param {[int,int]} coordinates 
     * @param {string - one of 'red''yellow''white''green''blue''plum'} color 
     */
    constructor(coordinates, color = '') {
        this.coordinates = coordinates;
        this.color = color;
    }

    setCoordinates(coordinates) {
        this.coordinates = coordinates;

    }

    setColor(color) {
        this.color = color;
    }

    getCoordinates() {
        return this.coordinates;
    }

    getCoordinateX() {
        return this.coordinates[0];
    }

    getCoordinateY() {
        return this.coordinates[1];
    }

    getColor() {
        return this.color;
    }
}