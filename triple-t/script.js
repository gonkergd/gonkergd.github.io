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
        // console.log(winner);
        if (winner === "X") return "Player Wins";
        // computer turn
        if (getAvailableGrids().length == 0) {
            return "Tie";
        } 
        let n = computerTurn();
        winner = determineWinner();
        console.log(toString());
        // console.log(winner);
        if (winner === "O") return n + "Computer Wins";
        if (getAvailableGrids().length == 0) {
            return "Tie";
        }
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
        Returns the available empty grids.
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
    /* best code ever? */
    let body = document.querySelector("body");
    let playButton = document.querySelector(".playerTurn");
    let restart = document.createElement("button");
    restart.textContent = "Restart!";
    let grid0 = document.querySelector("#zero");
    let grid1 = document.querySelector("#one");
    let grid2 = document.querySelector("#two");
    let grid3 = document.querySelector("#three");
    let grid4 = document.querySelector("#four");
    let grid5 = document.querySelector("#five");
    let grid6 = document.querySelector("#six");
    let grid7 = document.querySelector("#seven");
    let grid8 = document.querySelector("#eight"); 
    let header = document.querySelector(".header");
    let score = document.querySelector(".score");
    let playerScore = 0;
    let computerScore = 0;
    let board = [grid0, grid1, grid2, grid3, grid4, grid5, grid6, grid7, grid8];
    let emptyGrids = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let number = 0;
    let gameContinuing = true;
    let touched = false;
    playButton.addEventListener("click", () => {
        touched = true;
    });
    restart.addEventListener("click", () => {
        touched = false;
        clear();
        gameContinuing = true;
        play();
        body.appendChild(playButton);
        body.removeChild(restart);
    });
    /* 
        Clears the board.
    */
   let clear = () => {
       game.reset();
        emptyGrids = [0, 1, 2, 3, 4, 5, 6, 7, 8];
       for (let i = 0; i < 9; i++) {
           board[i].textContent = "";
           board[i].style.color = "";
       }
   };
    /*
        @param {number} winner - The winner of the game, with 0 being the computer and 1 being the player
        Updates the scoreboard on the document.
    */
   let scoreUpdate = (winner) => {
        if (winner) {
            playerScore++;
        } else {
            computerScore++;
        }
        score.textContent = playerScore + " - " + computerScore;
   };
    /* 
        Initializes a game of tic-tac-toe on the website.
    */
    let play = () => {
        // loop X refreshes
        if (gameContinuing) {
            if (!touched) {
                if (board[number].textContent != "O") {
                    board[number].textContent = "";
                }
                number = emptyGrids[Math.floor(Math.random() * emptyGrids.length)];
                // console.log(number);
                // console.log(board[number]);
                board[number].textContent = "X";
            }
            else {
                board[number].textContent = "X";
                board[number].style.color = "red";
                emptyGrids.splice(emptyGrids.indexOf(number), 1);
                let compNum = game.playGame(number);
                if (compNum === "Player Wins") {
                    header.textContent = "You asserted your dominance. You are a sigma.";
                    scoreUpdate(1);
                    body.removeChild(playButton);
                    body.appendChild(restart);
                    gameContinuing = false;
                } else if (typeof compNum === "string" && compNum.substring(1) === "Computer Wins") {
                    board[Number(compNum.substring(0,1))].textContent = "O";
                    header.textContent = "You have been replaced.";
                    scoreUpdate(0);
                    body.removeChild(playButton);
                    body.appendChild(restart);
                    gameContinuing = false;
                } else if (compNum === "Tie") {
                    header.textContent = "Tie!";
                    body.removeChild(playButton);
                    body.appendChild(restart);
                    gameContinuing = false;
                } else {
                    number = emptyGrids[Math.floor(Math.random() * emptyGrids.length)]; //refresh number
                    emptyGrids.splice(emptyGrids.indexOf(compNum), 1);
                    // console.log(emptyGrids);
                    board[compNum].textContent = "O";
                }
                touched = false;
            }
            setTimeout(play, 200); 
        }
    };
    return { play };
};
userInterface(game).play();