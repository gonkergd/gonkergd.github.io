let game = (function () {
    let gameBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    let playerTurn = (place) => {
        if (gameBoard[place] === " ") {
            gameBoard[place] = "X";
            return 1;
        } else {
            return 0;
        }
    };
    let computerTurn = () => {
        while (true) {
            let place = Math.floor(Math.random() * 9);
            if (gameBoard[place] === " ") {
                gameBoard[place] = "O";
                return place;
            }
        }
    };
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
    }; /* awesome code i know */
    let playGame = (place) => {
        let winner = " ";
        gameBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
        // player turn
        playerTurn(place);
        console.log(toString());
        winner = determineWinner();
        console.log(winner);
        if (winner === "X") return "Player";
        // computer turn
        computerTurn();
        winner = determineWinner();
        console.log(toString());
        console.log(winner);
        if (winner === "O") return "Computer";
    };
    let toString = () => {
        return gameBoard[0] + "|" + gameBoard[1] + "|" + gameBoard[2] + "\n" + 
        gameBoard[3] + "|" + gameBoard[4] + "|" + gameBoard[5] + "\n" + 
        gameBoard[6] + "|" + gameBoard[7] + "|" + gameBoard[8];
    };
    let getAvailableGrids = () => {
        let emptyGrids = [];
        for (let i = 0; i < 9; i++) {
            if (gameBoard[i] === " ") emptyGrids.push(i);
        }
        return emptyGrids;
    }
    return {playGame, getAvailableGrids};
})();
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
    let play = () => {
        let number = 0;
        let emptyGrids = game.getAvailableGrids();
        setInterval(() => {
            board[number].textContent = "";
            number = emptyGrids[Math.floor(Math.random() * emptyGrids.length)];
            board[number].textContent = "X";
        }, 200);
    };
    return { play };
};
alert("hi!");
let interface = userInterface(game);
interface.play();