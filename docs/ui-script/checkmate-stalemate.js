document.addEventListener('click', function(clicked) {
    if (clicked.target.id === "new-game") {
        location.reload();
    }
});

function gameOverMessage(isCheckMate) {
    let messageZone = document.getElementById('message');
    messageZone.style = `
        position: absolute;
        z-index: 4;
        text-align: center;
        color: white;   
        height: auto;
        width: 400px;
        padding-top: 25px;
        padding-bottom: 25px;
        background-color: #121b3d;
        opacity: 0.9;
        border-radius: 1%;
        justify-content: center;
        align-content: center;
    `
    if (isCheckMate) {
        //dictionnary to tell which player one
        let dicWinner = {'w': 'Black', 'b': 'White'};
        messageZone.innerHTML = "<div><h1 id='checkmate-message'>" + dicWinner[whoseTurn] + " won !</h1><span id='new-game' class='underlined-button pointer'>New game</span></div>"
    }
    else messageZone.innerHTML = "<div><h1 id='checkmate-message'>Stalemate :(</h1><span id='new-game' class='underlined-button pointer'>New game</span></div>"
}