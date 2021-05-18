// Load the prompt-sync module
const prompt = require('prompt-sync')({sigint: true});

// Set game characters
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

// Define Field class
class Field {

  // Constructor
  // Input: fieldInput = object containing (1) a 2D array representing the field and (2) 1D array representing the player's initial row and column positions
  // Input: hardMode = boolean indicating whether or not hard mode has been enabled. If so, a hole will be added to the field on a random blank field character every 3 moves
  // Ouput: none
  constructor(fieldInput, hardModeEnable) {
    this._field = fieldInput.field; // Set field property equal to input field
    this._currentPosition = fieldInput.playerPosition; // Set player position property to specified position
    this._hardModeEnable = hardModeEnable; // Set difficulty property equal to input difficulty
    this._moveCount = 0; // Initialize count of player moves to 0 -- this will be used to 
  }

  // Prints out current field in plain text, rather than raw array
  // Input: none
  // Output: none
  print() {
    let row = ''; // Sets temporary row string (representing the current (top) row) equal to empty string 

    for (let i = 0; i < this._field.length; i++) { // Loop through each row in the 2D field array
      for (let j = 0; j < this._field[i].length; j++) { // Loop through each column in the current row of the 2D field array
        row += this._field[i][j]; // For each column in the current row, add the character at that column to the end of the current row array
      }

      console.log(row); // Print out the current row in the 2D field array
      row = ''; // Reset temporary row string to empty string before looping again
    }
  }
  
  // Moves current player position down
  // Input: none
  // Output: status of game over (if true, player has either won or lost the game, and the game is over; if false, the game is not over, and the player can continue to make moves)
  moveDown() {
    this._currentPosition[0] += 1; // Moves player's current position down 1 unit 
    return this.checkMove(); // Checks whether or not the player's move has ended the game
  }

  // Moves current player position up
  // Input: none
  // Output: status of game over (if true, player has either won or lost the game, and the game is over; if false, the game is not over, and the player can continue to make moves)
  moveUp() {
    this._currentPosition[0] -= 1; // Moves player's current position up 1 unit 
    return this.checkMove(); // Checks whether or not the player's move has ended the game
  }

  // Moves current player position right
  // Input: none
  // Output: status of game over (if true, player has either won or lost the game, and the game is over; if false, the game is not over, and the player can continue to make moves)
  moveRight() {
    this._currentPosition[1] += 1; // Moves player's current position right 1 unit 
    return this.checkMove(); // Checks whether or not the player's move has ended the game
  }

  // Moves current player position left
  // Input: none
  // Output: status of game over (if true, player has either won or lost the game, and the game is over; if false, the game is not over, and the player can continue to make moves)
  moveLeft() {
    this._currentPosition[1] -= 1; // Moves player's current position left 1 unit 
    return this.checkMove(); // Checks whether or not the player's move has ended the game
  }

  // Checks whether or not the current move has ended the game. If so, this method prints out a message saying that the player has won or lost the game, and why.
  // Input: none
  // Output: status of game over (if true, player has either won or lost the game, and the game is over; if false, the game is not over, and the player can continue to make moves)
  checkMove() {

    // Sets separate variables for player's current coordinates for clarity
    let currentRow = this._currentPosition[0];
    let currentColumn = this._currentPosition[1];

    // Check if player's current position is still in the bounds of the field
    if ((currentRow >= 0) && (currentRow < this._field.length) && (currentColumn >= 0) && (currentColumn < this._field[0].length)) {
      
      // Print out current player coordinates
      // console.log('currentRow')
      // console.log(currentRow);
      // console.log('currentColumn')
      // console.log(currentColumn);

      // If player still in the bounds of the field, check if player fell into a hole
      if (this._field[currentRow][currentColumn] === hole) {
        
        // If player has fallen into a hole print out message stating that the player has lost, and return true  
        console.log('\nYou fell in a hole!');
        console.log('You lose');
        return true; // Returning true indicates that the game is over, and the while loop in the main script will exit

      // If player has not fallen into the hole, check if the player has reached the hat
      } else if (this._field[currentRow][currentColumn] === hat) {

        // If player has reached the hat, print out a message stating that the player has won the game, and return true
        console.log('\nYou found your hat!');
        console.log('You win the game!');
        return true; // Returning true indicates that the game is over, and the while loop in the main script will exit

      // If player has not reached the hat or fallen into a hole, game can continue 
      } else {
        this._field[currentRow][currentColumn] = pathCharacter; // Turn the character at the current position in the field into a path character
        this._moveCount++;

        // If hard mode is enabled and move count has reached 3, add a hole to the field
        if (this._hardModeEnable && this._moveCount === 3 ) {
          this.addHole();
          this._moveCount = 0; // Reset move count to 0
        }

        this.print(); // Print the current board
        return false; // Returning false indicates that the game is not over, and the player can continue to make moves
      }

    // If player's position is not still in the bounds of the field, the game is over
    } else {

      // Print out a message stating that the player has lost the game, and return true
      console.log('\nYou moved out of bounds!');
      console.log('You lose');
      return true; // Returning true indicates that the game is over, and the while loop in the main script will exit
    }
  }

  // Adds hole to field at the position of a random blank field character 
  addHole() {

    // Initialize variables for row and column position of holes that is to be placed
    let holeRow = 0;
    let holeColumn = 0;

    let characterAtPosition = this._field[holeRow][holeColumn]; // Initialize variable for getting character at randomly chosen position 
    let loopCount = 0; // Initialize counter to exit loop if too many iterations occur

    do {
      // Randomly choose coordinates for the new hole to be placed in 2D field array
      holeRow = Math.floor(Math.random() * this._field.length);
      holeColumn = Math.floor(Math.random() * this._field[0].length);

      // Get character at the randomly chosen position above
      characterAtPosition = this._field[holeRow][holeColumn];
      
      // Iterate loop count
      loopCount++;

    } while (characterAtPosition !== fieldCharacter && loopCount < 20) // Loop exits if the character at the randomly chosen position is a blank field character or if the loop iterated more than 20 times, indicating that blank field characters are sparse

    // Set character in the randomly chosen position of the 2D field array above to a hole
    this._field[holeRow][holeColumn] = hole;
  }

  // Randomly generates a field with a single hat, 0 or more holes, and 1 path character starting at the top left corner of the screen 
  // Input: numRows = number of rows in the generated field
  // Input: numColumns = number of columns in the generated field
  // Input: percentage = percentage of positions in the field, excluding the hat and the initial player position, which are to be holes
  // Output: Object containing (1) a 2D array representing the randomly generated field and (2) an array containing the player's initial row and column positions   
  static generateField(numRows, numColumns, percentage) {

    // Initialize empty field array
    let field = [];

    // Initialize all specified positions in field array with fieldCharacter
    for (let i = 0; i < numRows; i++) { // Loop through each row in the 2D field array
      field.push([]); // Push empty array (representing the current row) to the end of the field array
      for (let j = 0; j < numColumns; j++) { // Loop through each column in the current row that was just pushed
        field[i][j] = fieldCharacter; // Set current coordinate in the field equal to a blank field character
      }
    }

    // Randomly choose initial player position
    let pathRow = Math.floor(Math.random() * numRows);
    let pathColumn = Math.floor(Math.random() * numColumns);
    field[pathRow][pathColumn] = pathCharacter; // Set randomly chosen position in 2D field array to the path character

    // Initialize coordinates of the hat to those of the player's initial position. This ensures that the while loop below runs at least once
    let hatRow = pathRow;
    let hatColumn = pathColumn;

    // While loop ensures that hat character is not placed on initial pathCharacter
    while (hatRow === pathRow && hatColumn === pathColumn) { // Loop while the hat's position is the same as that of the player's starting position
      hatRow = Math.floor(Math.random() * numRows); // Sets row position of hat
      hatColumn = Math.floor(Math.random() * numColumns); // Sets column position of hat
    } // Loop exits if hat position is something other than player's initial position

    // Set character in 2D field array to hat character accordingly
    field[hatRow][hatColumn] = hat;

    // Define total quantity of hole characters to be placed in field, which is the specified percentage of the total remaining characters that are not the player character or the hat
    let numHoles = Math.round((percentage * (numRows * numColumns - 2)) / 100);

    // Print the total quantity of holes to be placed on the field
    //console.log(`numHoles = ${numHoles}`);

    // Initialize variables for the while loop below
    let holesPlaced = 0; // Counter for the total quantity of holes placed on the field
    let holeRow = 0; // Row position of the current hole to be placed on the field
    let holeColumn = 0; // Column position of the current holes to be placed on the field
    let characterAtPosition = field[pathRow][pathColumn]; // Get character at player's initial position

    // While loop runs as long as the quantity of holes placed on the field is less than the total number of holes specified by the input percentage
    while (holesPlaced < numHoles) {

      // While loop runs as long as the character at the current position is not a blank field character (i.e. the hat, the player, or a hole). This variable is initially set to the player's position so this loop will always run at least once
      while (characterAtPosition !== fieldCharacter) {

        // Randomly choose coordinates for the new hole to be placed in 2D field array
        holeRow = Math.floor(Math.random() * numRows);
        holeColumn = Math.floor(Math.random() * numColumns);

        // Get character at the randomly chosen position above
        characterAtPosition = field[holeRow][holeColumn];
      } // Loop exits if the character at the randomly chosen position is a blank field character

      // Set character in the randomly chosen position of the 2D field array above to a hole
      field[holeRow][holeColumn] = hole;

      // Update the character at the randomly chosen position to be a hole so that the while loop above does not immediately exit, as this character is currently set to a blank field variable
      characterAtPosition = hole;

      // Update the holes placed counter
      holesPlaced++;
    }  // Loop exits when total quantity of holes placed on the field is equal to the total quantity of holes as defined above

    
    let playerPosition = [pathRow, pathColumn]; // Create array for initial player's position to be returned with the 2D field array
    return {field, playerPosition}; // Return the 2D field array and the player's initial position
  }
}


// Define function to play the game
// Input: none
// Output: none
playGame = () => {

  let hardModeEnable = false // Initialize variable for game difficulty (false = easy, true = hard)
  let difficultyInput = '';  // Initialize player input variable for setting game difficulty
  let difficultyInputInvalid = true; // Initialize variable for exit condition of while loop below
  
  // While loop runs as long as the input from the user is invalid
  while (difficultyInputInvalid === true) {

    difficultyInput = prompt('Which difficulty would you like to play? '); // Prompt the user for game difficulty
    difficultyInput = difficultyInput.toLowerCase(); // Turn user input to lower case in order to disable case senstivity

    // If user enters 'easy' or 'e', set difficulty to easy
    if (difficultyInput === 'easy' || difficultyInput === 'e') {
      hardModeEnable = false;
      difficultyInputInvalid = false; // Exit loop after current iteration

    // If user enters 'hard' or 'h', set difficulty to hard
    } else if (difficultyInput === 'hard' || difficultyInput === 'h') {
      hardModeEnable = true;
      difficultyInputInvalid = false; // Exit loop after current iteration

    // Else, input is invalid; print message to notify user accordingly
    } else {
      console.log('Invalid input'); 
    } // Loop will exit if input is valid, otherwise ask the player again to input game difficulty
  }

  // Define a new field array
  const myField = new Field(Field.generateField(10, 20, 30), hardModeEnable);

  // Print the current field to the console
  console.log('Current field:');
  myField.print();

  // Set game over boolean to false (the game hasn't even started yet!)
  let gameOver = false;

  // Initialize player input variable for making a move
  let moveInput = '';

  // While loop runs as long as the game is not over
  while (gameOver == false) { 

    // Prompt user for input to make a move (not case sensitive)
    // 'up' or 'u' for up
    // 'down' or 'd' for down
    // 'right' or 'r' for right
    // 'left' or 'l' for left  
    moveInput = prompt('In which direction would you like to move? ');
    
    // Turn user input to lower case in order to disable case senstivity
    moveInput = moveInput.toLowerCase();

    // Switch statement to act on player input
    switch(moveInput) {

      // Player chooses to move down
      case 'd':
      case 'down':

        // Call moveDown function, which moves player's position and returns either true or false, depending on whether or not the game is over 
        gameOver = myField.moveDown();
        break;
      
      // Player chooses to move up
      case 'u':
      case 'up':

        // Call moveUp function, which moves player's position and returns either true or false, depending on whether or not the game is over 
        gameOver = myField.moveUp();
        break;

      // Player chooses to move right
      case 'r':
      case 'right':

        // Call moveRight function, which moves player's position and returns either true or false, depending on whether or not the game is over
        gameOver = myField.moveRight();
        break;

      // Player chooses to move left
      case 'l':
      case 'left':

        // Call moveLeft function, which moves player's position and returns either true or false, depending on whether or not the game is over
        gameOver = myField.moveLeft();
        break;

      // If player input is invalid, print error message and do not change value of the game over boolean
      default:
        console.log('Invalid input')
    }

  } // Loop exits if game is over

  // Print game over message
  console.log('\nGame over\n');

  let againInput = ''; // Initialize player input variable for playing again
  let againInputInvalid = true; // Initialize variable for exit condition of while loop below

  
  // While loop runs as long as the input from the user is invalid
  while (againInputInvalid === true) {

    againInput = prompt('Play again? '); // Prompt the user if they want to play again=
    againInput = againInput.toLowerCase(); // Turn user input to lower case in order to disable case senstivity

    // If user enters 'yes' or 'y', play game again
    if (againInput === 'yes' || againInput === 'y') {
      playGame();
      againInputInvalid = false; // Exit loop after current iteration

    // If user enters 'no' or 'n', game will exit
    } else if (againInput === 'no' || againInput === 'n') {
      againInputInvalid = false; // Exit loop after current iteration

    // Else, input is invalid; print message to notify user accordingly
    } else {
      console.log('Invalid input'); 
    } // Loop will exit if input is valid, otherwise ask the player again if they would like to restart the game
  }
}

// Call function to start the game
playGame();