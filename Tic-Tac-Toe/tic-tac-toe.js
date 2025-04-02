const board = document.querySelectorAll(".cell");
const message = document.getElementById("message");
const resetButton = document.getElementById("reset");
const undoButton = document.getElementById("undo");
const toggleTheme = document.getElementById("toggle-theme");
const scoreDisplay = document.getElementById("score");
const gameModeSelect = document.getElementById("game-mode");
let turn = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;
let moveHistory = [];
let scores = { X: 0, O: 0, ties: 0 };
let playerX = "Player X";
let playerO = "Player O";
let gameMode = "friend";

document.getElementById("playerX").addEventListener("input", (e) => {
    playerX = e.target.value || "Player X";
});

document.getElementById("playerO").addEventListener("input", (e) => {
    playerO = e.target.value || "Player O";
});

gameModeSelect.addEventListener("change", (e) => {
    gameMode = e.target.value;
    resetButton.click();
});

const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];

const jsConfetti = new JSConfetti();

const checkWin = () => {
    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            message.textContent = `${turn === "X" ? playerX : playerO} Wins! 🎉`;
            gameOver = true;
            combo.forEach(index => board[index].classList.add("winning-cell"));
            updateScore(turn);
            jsConfetti.addConfetti({
                emojis: ['🎉', '✨', '🎊', '🏆'],
                confettiNumber: 100,
            });
            return true;
        }
    }
    return false;
};

const checkTie = () => {
    if (!gameBoard.includes("") && !gameOver) {
        message.textContent = "It's a Tie! 🤝";
        gameOver = true;
        scores.ties++;
        updateScore();
    }
};

const updateScore = (winner) => {
    if (winner) scores[winner]++;
    scoreDisplay.textContent = `X: ${scores.X} | O: ${scores.O} | Ties: ${scores.ties}`;
};

const aiMove = () => {
    if (turn === "O" && !gameOver) {
        let emptyCells = gameBoard.map((val, i) => val === "" ? i : null).filter(val => val !== null);
        let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        setTimeout(() => {
            board[randomIndex].click();
        }, 500);
    }
};

board.forEach(cell => {
    cell.addEventListener("click", () => {
        const index = cell.dataset.index;
        if (gameBoard[index] === "" && !gameOver) {
            gameBoard[index] = turn;
            cell.textContent = turn;
            moveHistory.push(index);
            if (checkWin()) return;
            checkTie();
            turn = turn === "X" ? "O" : "X";
            message.textContent = `${turn === "X" ? playerX : playerO}'s Turn`;
            if (gameMode === "computer" && turn === "O") aiMove();
        }
    });
});

undoButton.addEventListener("click", () => {
    if (moveHistory.length > 0) {
        let lastMove = moveHistory.pop();
        gameBoard[lastMove] = "";
        board[lastMove].textContent = "";
        turn = turn === "X" ? "O" : "X";
        message.textContent = `${turn === "X" ? playerX : playerO}'s Turn`;
        gameOver = false;
        board.forEach(cell => cell.classList.remove("winning-cell"));
    }
});

resetButton.addEventListener("click", () => {
    gameBoard.fill("");
    board.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winning-cell");
    });
    moveHistory = [];
    turn = "X";
    message.textContent = "X's Turn";
    gameOver = false;
});

toggleTheme.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
