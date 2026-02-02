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
        opacity: 0;
        border-radius: 2%;
        justify-content: center;
        align-content: center;
        transition: opacity 0.5s ease, filter 1s ease;
        filter: blur(10px);
    `
    if (isCheckMate) {
        //dictionnary to tell which player one
        let dicWinner = {'w': 'Black', 'b': 'White'};
        messageZone.innerHTML = "<div><h1 id='game-over-message'>" + dicWinner[whoseTurn] + " won !</h1><span id='new-game' class='underlined-button pointer'>New game</span></div>"     
    }
    else messageZone.innerHTML = "<div><h1 id='game-over-message'>Stalemate :(</h1><span id='new-game' class='underlined-button pointer'>New game</span></div>"

    setTimeout(() => {
        messageZone.style.opacity = "0.9";
        messageZone.style.filter = "blur(0px)";
    }, 10);   
}