const board = document.getElementById("board");
const status = document.getElementById("status");
const restartButton = document.getElementById("restartButton");
let cells = [];
let currentPlayer = "X"; // Human starts first
let gameActive = true;

// Create Board Cells
function createBoard() {
    board.innerHTML = ""; // Clear previous board
    cells = [];

    for (let i = 0; i < 9; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-index", i);
        cell.addEventListener("click", handleMove);
        board.appendChild(cell);
        cells.push(cell);
    }
}

// Handle Player Move
function handleMove(event) {
    if (!gameActive || currentPlayer !== "X") return;

    let cell = event.target;
    if (cell.textContent === "") {
        cell.textContent = "X";
        cell.setAttribute("data-value", "X");
        cell.classList.add("taken");

        if (checkWin("X")) {
            celebrate("You Win! 🎉");
            return;
        }

        if (cells.every(cell => cell.textContent !== "")) {
            celebrate("It's a Draw! 🤝");
            return;
        }

        currentPlayer = "O"; // Switch to AI
        status.textContent = "AI's Turn...";
        setTimeout(aiMove, 500);
    }
}

// AI Move using Minimax
function aiMove() {
    if (!gameActive) return;

    let bestMove = minimax(cells, "O").index;
    cells[bestMove].textContent = "O";
    cells[bestMove].setAttribute("data-value", "O");
    cells[bestMove].classList.add("taken");

    if (checkWin("O")) {
        celebrate("AI Wins! 😈");
        return;
    }

    if (cells.every(cell => cell.textContent !== "")) {
        celebrate("It's a Draw! 🤝");
        return;
    }

    currentPlayer = "X";
    status.textContent = "Your Turn (X)";
}

// Celebration Effect
function celebrate(message) {
    status.textContent = message;
    status.classList.add("win");
    gameActive = false;
    startConfetti();
    setTimeout(() => {
        stopConfetti();
        resetGame();
    }, 3000); // Auto reset after 3s
}

// Check for Win
function checkWin(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    return winPatterns.some(pattern =>
        pattern.every(index => cells[index].textContent === player)
    );
}

// Minimax AI Logic
function minimax(newCells, player) {
    let availableMoves = newCells.map((cell, index) => cell.textContent === "" ? index : null).filter(index => index !== null);

    if (checkWin("X")) return { score: -10 };
    if (checkWin("O")) return { score: 10 };
    if (availableMoves.length === 0) return { score: 0 };

    let moves = availableMoves.map(index => {
        newCells[index].textContent = player;
        let score = minimax(newCells, player === "O" ? "X" : "O").score;
        newCells[index].textContent = "";
        return { index, score };
    });

    return moves.reduce((best, move) => 
        (player === "O" ? move.score > best.score : move.score < best.score) ? move : best, moves[0]
    );
}

// Reset Game
function resetGame() {
    gameActive = true;
    currentPlayer = "X";
    status.textContent = "Your Turn (X)";
    status.classList.remove("win");
    createBoard();
}

// Initialize Game & Restart Button
createBoard();
restartButton.addEventListener("click", resetGame);
