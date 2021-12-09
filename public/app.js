// const { response } = require("express");

let ws = io();
let clientId = null;

let winningScore = 5;
let gameOver = false;

// let ws = new WebSocket("ws://localhost:9090");

ws.on("message", response => {
    // const response = JSON.parse(message.data);
    console.log(response);

    if (response.method === "connect") {
        clientId = response.clientId;
        console.log("Connected to server with clientId = ", clientId);
    }

    if (response.method === "play") {
        if (response.player === "p1")
            updateScores(p1, p2);
        if (response.player === "p2")
            updateScores(p2, p1);
    }

    if (response.method === "reset")
        reset();

    if (response.method === "changeScore") {
        winningScore = response.value;
        winningScoreSelector.value = response.value;
        reset();
    }

    if (response.method === "over") {
        gameOver = true;
        p1.display.classList.add('has-text-success');
        p2.display.classList.add('has-text-danger');
        p1.button.disabled = true;
        p2.button.disabled = true;
    }
});

const p1 = {
    score: 0,
    button: document.querySelector('#p1btn'),
    display: document.querySelector('#p1Display')
}
const p2 = {
    score: 0,
    button: document.querySelector('#p2btn'),
    display: document.querySelector('#p2Display')
}



const resetBtn = document.querySelector('#reset');
const winningScoreSelector = document.querySelector('#playto');

function updateScores(player, opponent) {
    if (!gameOver) {
        if (player.score != winningScore) {
            player.score += 1;
            if (player.score === winningScore) {
                const payload = {
                    "method": "over"
                }

                ws.send(JSON.stringify(payload));
                // gameOver = true;
                // player.display.classList.add('has-text-success');
                // opponent.display.classList.add('has-text-danger');
                // player.button.disabled = true;
                // opponent.button.disabled = true;
            }
            player.display.textContent = player.score;
        }
    }
}
p1.button.addEventListener('click', function () {
    const payload = {
        "method": "play",
        "player": "p1"
    }

    ws.send(JSON.stringify(payload));
    // updateScores(p1, p2)
})

p2.button.addEventListener('click', function () {
    const payload = {
        "method": "play",
        "player": "p2"
    }

    ws.send(JSON.stringify(payload));
    // updateScores(p2, p1)
})
winningScoreSelector.addEventListener('change', function () {
    const payload = {
        "method": "changeScore",
        "value": parseInt(this.value)
    }

    ws.send(JSON.stringify(payload));
    // winningScore = parseInt(this.value);
    // reset();
})
resetBtn.addEventListener('click', function () {
    const payload = {
        "method": "reset"
    }
    ws.send(JSON.stringify(payload));
});
function reset() {
    gameOver = false;
    p1.score = 0;
    p2.score = 0;
    p1.display.textContent = 0;
    p2.display.textContent = 0;
    p1.display.classList.remove('has-text-success', 'has-text-danger');
    p2.display.classList.remove('has-text-danger', 'has-text-success');
    p1.button.disabled = false;
    p2.button.disabled = false;
}