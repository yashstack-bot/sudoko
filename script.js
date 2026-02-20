document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const menuContainer = document.getElementById('menu-container');
    const instructionsContainer = document.getElementById('instructions-container');
    const difficultyContainer = document.getElementById('difficulty-container');
    const gameContainer = document.getElementById('game-container');
    const boardElement = document.getElementById('board');
    const timerElement = document.getElementById('timer');
    const messageElement = document.getElementById('message');

    // Buttons
    const startGameBtn = document.getElementById('start-game-btn');
    const howToPlayBtn = document.getElementById('how-to-play-btn');
    const exitBtn = document.getElementById('exit-btn');
    const backFromInstructionsBtn = document.getElementById('back-from-instructions-btn');
    const backFromDifficultyBtn = document.getElementById('back-from-difficulty-btn');
    const restartBtn = document.getElementById('restart-btn');
    const solveBtn = document.getElementById('solve-btn');
    const exitGameBtn = document.getElementById('exit-game-btn');
    const easyBtn = document.getElementById('easy-btn');
    const mediumBtn = document.getElementById('medium-btn');
    const hardBtn = document.getElementById('hard-btn');

    // Game variables
    let board = [];
    let selectedCell = null;
    let timerInterval = null;
    let startTime = null;
    let initialBoard = []; // Store the initial state of the board

    // Sudoku board templates for different difficulties
    const easyBoards = [
        [
            [5,3,0,0,7,0,0,0,0],
            [6,0,0,1,9,5,0,0,0],
            [0,9,8,0,0,0,0,6,0],
            [8,0,0,0,6,0,0,0,3],
            [4,0,0,8,0,3,0,0,1],
            [7,0,0,0,2,0,0,0,6],
            [0,6,0,0,0,0,2,8,0],
            [0,0,0,4,1,9,0,0,5],
            [0,0,0,0,8,0,0,7,9]
        ]
    ];
    const mediumBoards = [
        [
            [2, 0, 0, 0, 0, 4, 0, 0, 0],
            [0, 0, 8, 3, 0, 0, 9, 0, 0],
            [0, 0, 0, 0, 6, 0, 0, 0, 5],
            [0, 0, 0, 0, 0, 8, 2, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 5, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 9, 0, 0, 0, 0],
            [0, 0, 6, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    ];
    const hardBoards = [
        [
            [8, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 3, 6, 0, 0, 0, 0, 0],
            [0, 7, 0, 0, 9, 0, 2, 0, 0],
            [0, 5, 0, 0, 0, 7, 0, 0, 0],
            [0, 0, 0, 0, 4, 5, 7, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 3, 0],
            [0, 0, 1, 0, 0, 0, 0, 6, 8],
            [0, 0, 8, 5, 0, 0, 0, 1, 0],
            [0, 9, 0, 0, 0, 0, 4, 0, 0]
        ]
    ];
    

    function showMenu() {
        menuContainer.classList.remove('hidden');
        instructionsContainer.classList.add('hidden');
        difficultyContainer.classList.add('hidden');
        gameContainer.classList.add('hidden');
    }

    function showInstructions() {
        menuContainer.classList.add('hidden');
        instructionsContainer.classList.remove('hidden');
    }

    function showDifficulty() {
        menuContainer.classList.add('hidden');
        difficultyContainer.classList.remove('hidden');
    }

    function startGame(difficulty) {
        let selectedBoard;
        if (difficulty === 'easy') {
            selectedBoard = easyBoards[Math.floor(Math.random() * easyBoards.length)];
        } else if (difficulty === 'medium') {
            selectedBoard = mediumBoards[Math.floor(Math.random() * mediumBoards.length)];
        } else { // 'hard'
            selectedBoard = hardBoards[Math.floor(Math.random() * hardBoards.length)];
        }

        board = selectedBoard.map(row => [...row]); // Deep copy for game state
        initialBoard = selectedBoard.map(row => [...row]); // Store initial state for restart
        
        messageElement.textContent = '';
        boardElement.innerHTML = '';
        gameContainer.classList.remove('hidden');
        difficultyContainer.classList.add('hidden');
        createBoard(initialBoard);

        startTime = new Date().getTime();
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
    }

    function createBoard(initialBoard) {
        boardElement.innerHTML = '';
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = r;
                cell.dataset.col = c;
                if (initialBoard[r][c] !== 0) {
                    cell.textContent = initialBoard[r][c];
                    cell.classList.add('fixed');
                } else {
                    cell.classList.add('editable');
                }
                cell.addEventListener('click', () => selectCell(cell));
                boardElement.appendChild(cell);
            }
        }
    }

    function selectCell(cell) {
        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }
        selectedCell = cell;
        selectedCell.classList.add('selected');
    }

    function updateTimer() {
        const currentTime = new Date().getTime();
        const elapsed = Math.floor((currentTime - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timerElement.textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // Input handlers
    document.addEventListener('keydown', (e) => {
        if (!selectedCell || !selectedCell.classList.contains('editable')) return;

        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);

        if (e.key >= '1' && e.key <= '9') {
            const num = parseInt(e.key);
            selectedCell.textContent = num;
            board[row][col] = num;
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            selectedCell.textContent = '';
            board[row][col] = 0;
        } else if (e.key === 'Enter') {
            if (board[row][col] !== 0) {
                if (isValid(board, board[row][col], row, col)) {
                    showMessage("Correct!", "green");
                } else {
                    showMessage("Incorrect!", "red");
                }
            }
        } else if (e.key.toLowerCase() === 's') { // Use 's' for solve
            solveBtn.click(); // Trigger the solve button functionality
        }
    });

    // Solve algorithm (recursive backtracking)
    function solveSudoku(b) {
        let emptyCell = findEmpty(b);
        if (!emptyCell) {
            showMessage("Sudoku Solved!", "green");
            return true;
        }

        const [row, col] = emptyCell;

        for (let num = 1; num <= 9; num++) {
            if (isValid(b, num, row, col)) {
                b[row][col] = num;
                const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
                cell.textContent = num;
                cell.style.color = '#0000ff'; // Blue for solved numbers

                if (solveSudoku(b)) {
                    return true;
                }
                b[row][col] = 0; // Backtrack
                cell.textContent = '';
                cell.style.color = 'black';
            }
        }
        return false;
    }

    function findEmpty(b) {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (b[r][c] === 0) {
                    return [r, c];
                }
            }
        }
        return null;
    }

    function isValid(b, num, r, c) {
        // Check row
        for (let i = 0; i < 9; i++) {
            if (b[r][i] === num && i !== c) return false;
        }
        // Check column
        for (let i = 0; i < 9; i++) {
            if (b[i][c] === num && i !== r) return false;
        }
        // Check 3x3 box
        const boxRow = Math.floor(r / 3) * 3;
        const boxCol = Math.floor(c / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (b[boxRow + i][boxCol + j] === num && (boxRow + i !== r || boxCol + j !== c)) return false;
            }
        }
        return true;
    }

    function showMessage(msg, color) {
        messageElement.textContent = msg;
        messageElement.style.color = color;
        setTimeout(() => messageElement.textContent = '', 2000);
    }
    
    // Button event listeners
    startGameBtn.addEventListener('click', () => showDifficulty());
    howToPlayBtn.addEventListener('click', () => showInstructions());
    exitBtn.addEventListener('click', () => {
        // A web page cannot force quit, so we redirect or show a message
        alert("Thanks for playing!");
    });
    backFromInstructionsBtn.addEventListener('click', () => showMenu());
    backFromDifficultyBtn.addEventListener('click', () => showMenu());
    restartBtn.addEventListener('click', () => startGame('easy')); // Default restart to easy
    solveBtn.addEventListener('click', () => {
        const boardCopy = board.map(row => [...row]);
        solveSudoku(boardCopy);
    });
    exitGameBtn.addEventListener('click', () => showMenu());
    easyBtn.addEventListener('click', () => startGame('easy'));
    mediumBtn.addEventListener('click', () => startGame('medium'));
    hardBtn.addEventListener('click', () => startGame('hard'));

    // Initial state
    showMenu();
});