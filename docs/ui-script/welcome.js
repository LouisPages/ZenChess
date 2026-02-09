document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("message-to-appear").classList.add("message-appearance");
});


document.addEventListener('click', function(clicked) {
    if (clicked.target.id.slice(6,11) === '-play') {
        message = document.getElementById("message");
        mode = clicked.target.id.slice(0,6);

        if (mode === "friend") {
            message.style.opacity = "0";
            setTimeout(() => {
                message.innerHTML = "";
                message.style.display = "none";
            }, 500);
        }
        else {
            zenBotButton = document.getElementById('zenbot-play');
            zenBotButton.style.borderBottom = "0.5px solid white";
            setTimeout(() => {
                document.getElementById("color-choice").classList.add('message-appearance');
            }, 2);
        }
    }
    if (clicked.target.id.slice(0,10) === "play-with-" && mode === "zenbot") {
        message.style.opacity = "0";
        setTimeout(() => {
            message.innerHTML = "";
            message.style.display = "none";
        }, 500);
        if (clicked.target.id.slice(10,15) === "black") {
            botColor = 'w';
            flipBoard();
            playZenBotMove(zenBotMode);
        }
        else botColor = 'b'
    }
});