const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let board = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];

function printBoard() {
    console.log(board.map(row => row.join(' | ')).join('\n---------\n'));
}

function checkWin(player) {
    for (let i = 0; i < 3; i++) {
        if (board[i].every(cell => cell === player) || board.map(row => row[i]).every(cell => cell === player)) {
            return true;
        }
    }
    if ([0, 1, 2].every(i => board[i][i] === player) || [0, 1, 2].every(i => board[i][2 - i] === player)) {
        return true;
    }
    return false;
}

function isFull() {
    return board.flat().every(cell => cell !== ' ');
}

function makeMove() {
    let emptyCells = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === ' ') emptyCells.push([i, j]);
        }
    }
    let [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[row][col] = 'O';
}

function play() {
    printBoard();
    rl.question("Entrez la ligne et la colonne (0-2) séparées par un espace: ", input => {
        let [row, col] = input.split(' ').map(Number);
        if (board[row][col] !== ' ') {
            console.log("Case déjà prise, réessayez.");
            return play();
        }
        board[row][col] = 'X';

        if (checkWin('X')) {
            printBoard();
            console.log("Vous avez gagné !");
            return rl.close();
        }
        if (isFull()) {
            printBoard();
            console.log("Match nul !");
            return rl.close();
        }
        
        makeMove();
        if (checkWin('O')) {
            printBoard();
            console.log("L'ordinateur a gagné !");
            return rl.close();
        }
        if (isFull()) {
            printBoard();
            console.log("Match nul !");
            return rl.close();
        }
        play();
    });
}

play();