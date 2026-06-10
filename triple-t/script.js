/* 
    An implementation of the game "tic-tac-toe".
*/
let game = (function () {
    let gameBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    /* 
        @param {number} place - The index where the player places a cross.
        Simulates a player's turn and returns 1 if successful, and 0 if the place is already occupied.
    */
    let playerTurn = (place) => {
        if (gameBoard[place] === " ") {
            gameBoard[place] = "X";
            return 1;
        } else {
            return 0;
        }
    };
    /* 
        Simulates a computer's turn of tic-tac-toe and returns the computer's placement.
    */
    let computerTurn = () => {
        while (true) {
            let place = Math.floor(Math.random() * 9);
            if (gameBoard[place] === " ") {
                gameBoard[place] = "O";
                return place;
            }
        }
    };
    /* 
        Returns the winner of the game in terms of O and X. Returns " " if the game has not concluded. Has the best code known to mankind.
    */
    let determineWinner = () => {
        if (gameBoard[0] != " " && gameBoard[0] === gameBoard[4] && gameBoard[4] === gameBoard[8]) { // diagonal "\"
            return gameBoard[0];
        }
        if (gameBoard[2] != " " && gameBoard[2] === gameBoard[4] && gameBoard[4] === gameBoard[6]) { // diagonal "/"
            return gameBoard[2];
        }
        if (gameBoard[0] != " " && gameBoard[0] === gameBoard[1] && gameBoard[1] === gameBoard[2]) { // OOO --- ---
            return gameBoard[0];
        }
        if (gameBoard[3] != " " && gameBoard[3] === gameBoard[4] && gameBoard[4] === gameBoard[5]) { // --- OOO ---
            return gameBoard[3];
        }
        if (gameBoard[6] != " " && gameBoard[6] === gameBoard[7] && gameBoard[7] === gameBoard[8]) { // --- --- OOO
            return gameBoard[6];
        }
        if (gameBoard[0] != " " && gameBoard[0] === gameBoard[3] && gameBoard[3] === gameBoard[6]) { // O-- O-- O--
            return gameBoard[3];
        }
        if (gameBoard[1] != " " && gameBoard[1] === gameBoard[4] && gameBoard[4] === gameBoard[7]) { // -O- -O- -O-
            return gameBoard[1];
        }
        if (gameBoard[2] != " " && gameBoard[2] === gameBoard[5] && gameBoard[5] === gameBoard[8]) { // --O --O --O
            return gameBoard[2];
        }
        return " ";
    }; 
    /* 
        @param {number} place - The index where the player places a cross.
        Simulates a round of tic-tac-toe. Returns the index of the computer's placement. If the game concludes (one player won, tie, etc),
        returns the string "Player wins", "Computer wins", or "Tie".
    */
    let playGame = (place) => {
        let winner = " ";
        // player turn
        playerTurn(place);
        console.log(toString());
        winner = determineWinner();
        console.log(winner);
        if (winner === "X") return "Player wins";
        // computer turn
        let n = computerTurn();
        winner = determineWinner();
        console.log(toString());
        console.log(winner);
        if (winner === "O") return "Computer wins";
        if (gameBoard.every((n) => n === " ")) return "Tie";
        return n;
    };
    /* 
        Returns the tic-tac-toe board in String format.
    */
    let toString = () => {
        return gameBoard[0] + "|" + gameBoard[1] + "|" + gameBoard[2] + "\n" + 
        gameBoard[3] + "|" + gameBoard[4] + "|" + gameBoard[5] + "\n" + 
        gameBoard[6] + "|" + gameBoard[7] + "|" + gameBoard[8];
    };
    /*
        Returns the tic-tac-toe board in String format.
    */
    let getAvailableGrids = () => {
        let emptyGrids = [];
        for (let i = 0; i < 9; i++) {
            if (gameBoard[i] === " ") emptyGrids.push(i);
        }
        return emptyGrids;
    }
    /* 
        Resets the gameboard array.
    */
    let reset = () => {
        gameBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    }
    return {playGame, getAvailableGrids, reset};
})();
/* 
    @game {factory function} - An implementation of a tic-tac-toe game.
    Emulates a game of tic-tac-toe on the website.
*/
let userInterface = function (game) {
    let playButton = document.querySelector("button");
    let grid0 = document.querySelector("#zero");
    let grid1 = document.querySelector("#one");
    let grid2 = document.querySelector("#two");
    let grid3 = document.querySelector("#three");
    let grid4 = document.querySelector("#four");
    let grid5 = document.querySelector("#five");
    let grid6 = document.querySelector("#six");
    let grid7 = document.querySelector("#seven");
    let grid8 = document.querySelector("#eight"); /* best code ever? */
    let board = [grid0, grid1, grid2, grid3, grid4, grid5, grid6, grid7, grid8];
    /* 
        Initializes a game of tic-tac-toe on the website.
    */
    let play = () => {
        let emptyGrids = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        let number = 0;
        let touched = false;
        playButton.addEventListener("click", () => {
            // let collectedNumber = number; // prevent async bugs
            // emptyGrids.splice(collectedNumber, 1);
            // let compNum = game.playGame(collectedNumber);
            // emptyGrids.splice(compNum, 1);
            // board[collectedNumber].textContent = "X";
            // board[compNum].textContent = "O"; (deprecated due to breaking asynchronization)
            touched = true;
        });
        // loop Xs
        setInterval(() => {
            if (!touched) {
                board[number].textContent = "";
                number = emptyGrids[Math.floor(Math.random() * emptyGrids.length)];
                board[number].textContent = "X";
            }
            else {
                board[number].textContent = "X";
                board[number].style.color = "red";
                emptyGrids.splice(emptyGrids.indexOf(number), 1);
                let compNum = game.playGame(number);
                if (compNum == "Win") {
                    game.reset();
                    alert("You asserted your dominance. You are a skibidi sigma.");
                    let emptyGrids = [0, 1, 2, 3, 4, 5, 6, 7, 8];
                    for (let i = 0; i < 9; i++) {
                        board[i].textContent = "";
                        board[i].style.color = "";
                    }
                }
                number = emptyGrids[Math.floor(Math.random() * emptyGrids.length)]; //refresh number
                emptyGrids.splice(emptyGrids.indexOf(compNum), 1);
                console.log(emptyGrids);
                board[compNum].textContent = "O";
                touched = false;
            }
        }, 200);
    };
    return { play };
};
let interface = userInterface(game);
interface.play();