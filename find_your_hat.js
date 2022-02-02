const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

// Field class definition 
class Field {
  constructor(field) {
    this._field = field;
    this._row = field.map(elem => { return elem.find(c => c === '*'); }).indexOf('*');
    this._col = field[this._row].indexOf('*');
  }

  print() {
    for(let row of this._field) {
      console.log(row.join(''));
    }
  }

  withinField () {
    return (
      this._row >= 0 &&
      this._col >= 0 &&
      this._row < this._field.length &&
      this._col < this._field[0].length
    );
  }

  makeMove (moveTo) {
    switch (moveTo) {
      case 'u':
        this._row -= 1;
        break;
      case 'd':
        this._row += 1;
        break;
      case 'l':
        this._col -= 1;
        break;
      case 'r':
        this._col += 1;
        break;
      default:
        console.log("\nPlease input u, d, l or r.");
        break;
    }
  }

  putPathChar (moveTo, pathChar, fieldChar) {
    let prevRow = 0;
    let prevCol = 0;

    switch (moveTo) {
      case 'u':
        prevRow = this._row + 1;
        this._field[prevRow][this._col] = fieldChar;
        break;
      case 'd':
        prevRow = this._row - 1;
        this._field[prevRow][this._col] = fieldChar;
        break;
      case 'l':
        prevCol = this._col + 1;
        this._field[this._row][prevCol] = fieldChar;
        break;
      case 'r':
        prevCol = this._col - 1;
        this._field[this._row][prevCol] = fieldChar;
        break;
    }
    this._field[this._row][this._col] = pathChar;
  }

  getItem () {
    return this._field[this._row][this._col];
  }

  static _randomizeInitialPos (char, field) {
    let isFieldChar = false;
    
    while (!isFieldChar) {
      let randomRow = Math.floor(Math.random() * field.length);
      let randomCol = Math.floor(Math.random() * field[0].length);

      if (field[randomRow][randomCol] === '░') {
        field[randomRow][randomCol] = char;
        isFieldChar = true;
      }
    }
  }

  static generateField (height, width, percentage) {
    // Initialize array
    const field = [];
    for (let row = 0; row < height; row++) {
      field.push([]);
      for (let col = 0; col < width; col++) {
        field[row].push('░');
      }
    } 

    // Fill array with holes according to percentage given
    let sumHoles = 0;
    while (sumHoles / (height * width) < percentage) {
      let randomRow = Math.floor(Math.random() * height);
      let randomCol = Math.floor(Math.random() * width);

      if (field[randomRow][randomCol] === '░') {
        field[randomRow][randomCol] = 'O';
        sumHoles += 1;
      }
    }

    // Randomize user initial position
    this._randomizeInitialPos('*', field);

    // Randomize hat position
    this._randomizeInitialPos('^', field);

    return field;
  }
}

// Main function for playing game
const playGame = (field) => {
  let play = true;

  while(play) {
    console.clear();
    console.log("\nWelcome to Find Your Hat!");
    console.log("Move through the field to find yours!");
    console.log("Input 'u' to move up.");
    console.log("Input 'd' to move down.");
    console.log("Input 'l' to move left.");
    console.log("Input 'r' to move right.\n");
    field.print();

    const moveTo = prompt("Which way? ").toLowerCase();
    field.makeMove(moveTo);

    if (field.withinField()) {
      switch (field.getItem()) {
        case hole:
          console.log("You fell down a hole! YOU LOSE!");
          play = false;
          break;
        case hat:
          console.log("You found your hat! YOU WIN!");
          play = false;
          break;
        case fieldCharacter:
          field.putPathChar(moveTo, pathCharacter, fieldCharacter);
          break;
      }
    } else {
      console.log("You got out of the field! YOU LOSE!");
      play = false;
    }
  }
}

const field = new Field(Field.generateField(10, 30, 0.15));

playGame(field);