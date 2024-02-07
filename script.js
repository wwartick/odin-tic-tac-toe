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
        if(board[row][column].getValue() !== ''){
         return false;
        }
        board[row][column].addToken(player);
        return true
    } 

    return { getBoard, selectCell };
}

function Cell() {
    let value = ''; 

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
            token: 'X'
        },
        {
            name:playerTwoName,
            token: 'O'
        }
    ];

    let activePlayer = players[0];
    let hasWinner = false;
    let gameWinner = '';

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const getWinner = () => hasWinner;
    const getWinnerName = () => gameWinner;

    const checkWinner = (cells) => {
        return cells.every(cell => cell.getValue() !== '' && cell.getValue() === cells[0].getValue());
    };

    const tieGameCheck = (board) => {
        return board.every(row => row.every(cell => cell.getValue() !== ''));
    }

    const playRound = (row, column) => {
        if(!board.selectCell(row, column, getActivePlayer().token)){
        return;
       }
       //winner logic
       const centerValue = board.getBoard()[1][1].getValue();
        if (centerValue !== '') {
            const diagonal1 = centerValue === board.getBoard()[0][0].getValue() && centerValue === board.getBoard()[2][2].getValue();
            const diagonal2 = centerValue === board.getBoard()[2][0].getValue() && centerValue === board.getBoard()[0][2].getValue();
            if (diagonal1 || diagonal2) {
                hasWinner = true;
                gameWinner = activePlayer.name;
            }
        }
        for (let i = 0; i < board.getBoard().length; i++) {
            if (checkWinner(board.getBoard()[i])) {
                hasWinner = true;
                gameWinner = activePlayer.name;
            }
        }
        for (let j = 0; j < board.getBoard()[0].length; j++) {
            const column = board.getBoard().map(row => row[j]);
            if (checkWinner(column)) {
                hasWinner = true;
                gameWinner = activePlayer.name;
            }
        }

        if(tieGameCheck(board.getBoard())){
            hasWinner = true;
            gameWinner = 'Nobody';
        }
    
        switchPlayerTurn();
    };
    return{playRound, getActivePlayer, getBoard: board.getBoard, getWinner, getWinnerName};
} 

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const containerDiv = document.querySelector('.container');
    
    const updateScreen = () => {
        boardDiv.textContent = '';
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        let winnerCheck = game.getWinner()
        let winnerName = game.getWinnerName();

        if(!winnerCheck){
        playerTurnDiv.textContent = `${activePlayer.name}'s (${activePlayer.token}) turn `
        playerTurnDiv.classList.add('turn');
        } else {
            playerTurnDiv.textContent = `${winnerName} wins! `
            const resetButton = document.createElement('button');
            resetButton.classList.add('reset');
            resetButton.textContent='Click to Play again'
            resetButton.addEventListener('click', () => location.reload());
            containerDiv.appendChild(resetButton);
        }
        
    board.forEach((row,rowIndex) => {
        row.forEach((cell, columnIndex) => {
            const cellButton = document.createElement('button');
            cellButton.classList.add('cell');
            cellButton.classList.add('cell-hover')
            cellButton.dataset.column = columnIndex;
            cellButton.dataset.row = rowIndex;
            cellButton.textContent = cell.getValue();
            boardDiv.appendChild(cellButton);
            
            if(winnerCheck){
                cellButton.classList.remove('cell-hover');
            }
        })
    })
        
}
    function clickHandlerBoard(e) {
        const selectedCellRow = e.target.dataset.row;
        const selectedCellColumn = e.target.dataset.column;
        if (!selectedCellRow || !selectedCellColumn) return;
        let winnerCheck = game.getWinner()
        if(!winnerCheck){
            game.playRound(selectedCellRow, selectedCellColumn);
            updateScreen();
        }
        
    }

    boardDiv.addEventListener('click', clickHandlerBoard);
    updateScreen();

}
    ScreenController();
