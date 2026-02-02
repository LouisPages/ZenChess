document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("message-to-appear").classList.add("message-appearance");
});


document.addEventListener('click', function(clicked) {
    if (clicked.target.id.slice(6,11) === '-play') {
        message = document.getElementById("message");
        message.style.opacity = "0";
        setTimeout(() => {
            message.innerHTML = "";
            message.style.display = "none";
        }, 500);
        mode = clicked.target.id.slice(0,6);
        // main();
        refreshBoard();
    }
});