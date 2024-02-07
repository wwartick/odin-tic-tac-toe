function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i=0; i<rows; i++){
        board[i] = [];
      for(let j=0; j<columns; j++){
        board[i].push(Cell());
      }
    }

    const getBoard = () => board;

    const selectCell = (row, column, player) => {
        const availableCells = board.filter((row) => row[column].getValue() === 0).map(row => row[column]);
        if(!availableCells.length) return;
        board[row][column].addToken(player);
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    }

    return { getBoard, selectCell, printBoard};
}

function Cell() {
    let value = 0; 

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return { addToken, getValue};
}

function GameController(
    playerOneName = 'Player One',
    playerTwoName = 'Player Two'
){
    const board = GameBoard();

    const players = [
        {
            name: playerOneName,
            token: 1
        },
        {
            name:playerTwoName,
            token: 2
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {
        console.log(`${getActivePlayer().name} has placed their token at ${row}, ${column}.`)
        board.selectCell(row, column, getActivePlayer().token);

        //someone wins , it goes here
        
        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return{playRound, getActivePlayer, getBoard: board.getBoard};
} 

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = '';
    
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn `

    board.forEach(row => {
        row.forEach((cell, index) => {
            const cellButton = document.createElement('button');
            cellButton.classList.add('cell');
            cellButton.dataset.column = index;
            cellButton.textContent = cell.getValue();
            boardDiv.appendChild(cellButton);
        })
    })
}

    function clickHandlerBoard(e) {
        const selectedCell = e.target.dataset.cell;
        if (!selectedCell) return;

        game.playRound(selectedCell);
        updateScreen();
    }
    boardDiv.addEventListener('click', clickHandlerBoard);
    updateScreen();
}
    ScreenController();
