document.addEventListener('click', function(clicked) {
    if (clicked.target.id.slice(6,11) === '-play') {
        document.getElementById("message").innerHTML = "";
        document.getElementById("message").style.display = "none";
        mode = clicked.target.id.slice(0,6);
        // main();
        refreshBoard();
    }
});