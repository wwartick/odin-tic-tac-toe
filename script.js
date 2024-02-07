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
        if(board[row][column].getValue() !== 0){
         return false;
        }
        board[row][column].addToken(player);
        return true
    } 

    return { getBoard, selectCell };
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

    const checkWinner = (cells) => {
        return cells.every(cell => cell.getValue() !== 0 && cell.getValue() === cells[0].getValue());
    };

    const playRound = (row, column) => {
       if(!board.selectCell(row, column, getActivePlayer().token)){
        return;
       }
       //winner logic
       
        for (let i = 0; i < board.getBoard().length; i++) {
            if (checkWinner(board.getBoard()[i])) {
                console.log(activePlayer.name + ' wins');
            }
        }
        
        for (let j = 0; j < board.getBoard()[0].length; j++) {
            const column = board.getBoard().map(row => row[j]);
            if (checkWinner(column)) {
                console.log(activePlayer.name + ' wins');
            }
        }
        switchPlayerTurn();
    };
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

    board.forEach((row,rowIndex) => {
        row.forEach((cell, columnIndex) => {
            const cellButton = document.createElement('button');
            cellButton.classList.add('cell');
            cellButton.dataset.column = columnIndex;
            cellButton.dataset.row = rowIndex;
            cellButton.textContent = cell.getValue();
            boardDiv.appendChild(cellButton);
        })
    })
}

    function clickHandlerBoard(e) {
        const selectedCellRow = e.target.dataset.row;
        const selectedCellColumn = e.target.dataset.column;
        if (!selectedCellRow || !selectedCellColumn) return;
        game.playRound(selectedCellRow, selectedCellColumn);
        updateScreen();
    }
    boardDiv.addEventListener('click', clickHandlerBoard);
    updateScreen();
}
    ScreenController();
