let rows = 10;
let cols = 10;
let mineCount = 10;
let board = [];
let revealedCount = 0;
let gameOver = false;

// 难度设置
function setDifficulty(level) {
    if (level === 'easy') {
        rows = 8;
        cols = 8;
        mineCount = 10;
    } else if (level === 'normal') {
        rows = 12;
        cols = 12;
        mineCount = 25;
    } else if (level === 'hard') {
        rows = 16;
        cols = 16;
        mineCount = 40;
    }
    startNewGame();
}

// 修改棋盘数据结构初始化
function initBoard() {
    board = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
            mine: false,
            revealed: false,
            adjacentMines: 0,
            flagged: false // 新增属性
        }))
    );
    placeMines();
    calculateAdjacentMines();
}

// Place mines randomly on the board
function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (!board[row][col].mine) {
            board[row][col].mine = true;
            minesPlaced++;
        }
    }
}

// Calculate the number of adjacent mines for each cell
function calculateAdjacentMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].mine) continue;
            board[r][c].adjacentMines = countAdjacentMines(r, c);
        }
    }
}

function countAdjacentMines(row, col) {
    let count = 0;
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c].mine) {
                count++;
            }
        }
    }
    return count;
}

// Reveal a cell
function revealCell(row, col) {
    if (gameOver || board[row][col].revealed) return;

    board[row][col].revealed = true;
    revealedCount++;

    if (board[row][col].mine) {
        gameOver = true;
        renderBoard();
        alert("Game Over! You hit a mine.");
        return;
    }

    if (board[row][col].adjacentMines === 0) {
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (
                    r >= 0 &&
                    r < rows &&
                    c >= 0 &&
                    c < cols &&
                    !(r === row && c === col)
                ) {
                    if (!board[r][c].revealed) {
                        revealCell(r, c);
                    }
                }
            }
        }
    }

    checkWinCondition();
    renderBoard();
}

// 渲染棋盘
function renderBoard() {
    const boardDiv = document.getElementById('board');
    boardDiv.innerHTML = '';
    boardDiv.style.display = 'grid';
    boardDiv.style.gridTemplateRows = `repeat(${rows}, 30px)`;
    boardDiv.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    boardDiv.style.gap = '2px';

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('button');
            cell.style.width = '30px';
            cell.style.height = '30px';
            cell.style.fontSize = '16px';
            cell.style.padding = '0';
            cell.dataset.row = r;
            cell.dataset.col = c;

            if (board[r][c].revealed) {
                cell.disabled = true;
                if (board[r][c].mine) {
                    cell.textContent = '💣';
                    cell.style.background = '#f88';
                } else if (board[r][c].adjacentMines > 0) {
                    cell.textContent = board[r][c].adjacentMines;
                    cell.style.background = '#eee';
                } else {
                    cell.textContent = '';
                    cell.style.background = '#eee';
                }
            } else if (board[r][c].flagged) {
                cell.textContent = '🚩';
                cell.style.background = '#ffd700';
                cell.onclick = null;
            } else {
                cell.textContent = '';
                cell.onclick = function () {
                    if (!gameOver) {
                        revealCell(r, c);
                    }
                };
            }

            // 右键标记雷
            cell.oncontextmenu = function (e) {
                e.preventDefault();
                if (!board[r][c].revealed && !gameOver) {
                    board[r][c].flagged = !board[r][c].flagged;
                    renderBoard();
                }
            };

            boardDiv.appendChild(cell);
        }
    }
}

// Check if the player has won
function checkWinCondition() {
    if (revealedCount === rows * cols - mineCount) {
        renderBoard();
        alert("Congratulations! 🎉 You've cleared the minefield. 🎊");
        gameOver = true;
    }
}

// Start a new game
function startNewGame() {
    initBoard();
    revealedCount = 0;
    gameOver = false;
    renderBoard();
}

// Event listeners for the game
document.addEventListener('DOMContentLoaded', () => {
    startNewGame();
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.onclick = startNewGame;
    }
    // 难度按钮绑定
    const easyBtn = document.getElementById('easyBtn');
    const normalBtn = document.getElementById('normalBtn');
    const hardBtn = document.getElementById('hardBtn');
    if (easyBtn) easyBtn.onclick = () => setDifficulty('easy');
    if (normalBtn) normalBtn.onclick = () => setDifficulty('normal');
    if (hardBtn) hardBtn.onclick = () => setDifficulty('hard');
});