function init() {
    //stars configuration
    var style = ["style1", "style2", "style3", "style4"];
    var size = ["size1", "size1", "size1", "size2", "size3"];
    var opacity = ["opacity1", "opacity1", "opacity1", "opacity2", "opacity2", "opacity3"];
    
    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
    //generate stars
    var starsHTML = "";
    var starsCount = 1000;
    var night = document.querySelector(".constellation");
    var windowWidth = window.innerWidth;
    
    for (var i = 0; i < starsCount; i++) {
        starsHTML += "<span class='star " + 
            style[getRandomArbitrary(0, 4)] + " " + 
            opacity[getRandomArbitrary(0, 6)] + " " +
            size[getRandomArbitrary(0, 5)] + 
            "' style='animation-delay: ." + 
            getRandomArbitrary(0, 9) + "s; left: " + 
            getRandomArbitrary(0, 1.5*windowWidth) + "px; top: " + 
            getRandomArbitrary(0, 1.5*windowWidth) + "px;'></span>";
    }
    night.innerHTML = starsHTML;
    
    //shooting stars
    var randomDelay = 5000;
    
    setTimeout(function() {
        loadShootingStar();
    }, randomDelay);
    
    function loadShootingStar() {
        setTimeout(loadShootingStar, randomDelay);
        randomDelay = getRandomArbitrary(5000, 10000);
        
        var shootingStar = "<div class='shooting-star " + style[getRandomArbitrary(0, 4)] + "'></div>";
        document.getElementsByClassName('shooting-stars')[0].innerHTML = shootingStar;
        
        setTimeout(function() {
            document.getElementsByClassName('shooting-stars')[0].innerHTML = "";
        }, 1000);
    }
}

window.onload = init;