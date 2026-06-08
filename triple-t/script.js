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
                break;
            }
        }
        return 1;
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
    let playGame = () => {
        let winner = " ";
        gameBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
        for (let i = 0; i < 9; i++) {
            playerTurn(prompt("Where"));
            console.log(toString());
            winner = determineWinner();
            console.log(winner);
            if (winner === "X") return "Player";
            computerTurn();
            winner = determineWinner();
            console.log(toString());
            console.log(winner);
            if (winner === "O") return "Computer";
        }
        return "Draw";
    };
    let toString = () => {
        return gameBoard[0] + "|" + gameBoard[1] + "|" + gameBoard[2] + "\n" + 
        gameBoard[3] + "|" + gameBoard[4] + "|" + gameBoard[5] + "\n" + 
        gameBoard[6] + "|" + gameBoard[7] + "|" + gameBoard[8];
    };
    return {playGame};
})();

let newGame = game;
console.log(newGame.playGame());