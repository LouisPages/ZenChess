//moon hover animation
const moon = document.querySelector('.moon');
moon.addEventListener('mouseenter', function() {
    this.classList.remove('moon-unHovered');
});
moon.addEventListener('mouseleave', function() {
    this.classList.add('moon-unHovered');
    setTimeout(() => {
        this.classList.remove('moon-unHovered');
    }, 1500);
});

//floating icons creation
const floatingIcons = document.createElement('div');
floatingIcons.id = 'floating-icons';


floatingIcons.innerHTML = `
    <div class="floating-icon pointer" id="icon-resign" title="Resign">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
            <line x1="4" y1="22" x2="4" y2="15"></line>
        </svg>
    </div>
    <div class="floating-icon pointer" id="icon-draw" title="Offer Draw">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14"></path>
            <path d="m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"></path>
            <path d="m2 13 6 6"></path>
        </svg>
    </div>
    <div class="floating-icon pointer" id="icon-flip" title="Flip Board">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
        </svg>
    </div>
`;
document.getElementById('board-container').appendChild(floatingIcons);

//icons are hidden by default
let iconsVisible = false;

//click on the moon to toggle icons visibility
document.addEventListener('click', function(clicked) {
    if (clicked.target.id === "div-texture" || clicked.target.closest('.moon')) {
        toggleIcons();
    }
});

function toggleIcons() {
    iconsVisible = !iconsVisible;
    if (iconsVisible) {
        floatingIcons.classList.add('icons-visible');
    } else {
        floatingIcons.classList.remove('icons-visible');
        // Close any open panels when hiding icons
        closePanel('info-panel');
        closePanel('color-panel');
    }
}

document.getElementById('icon-resign').addEventListener('click', function() {
    if (confirm('Are you sure you want to resign?')) {
        gameOverMessage(true, false);
    }
});

document.getElementById('icon-draw').addEventListener('click', function() {
    if (typeof mode !== 'undefined' && mode === 'zenbot') {
        if (confirm('Offer a draw to ZenBot?')) {
            //for now the ZenBot accept a draw
            //todo : send a request to app.py
            gameOverMessage(false,true);
        }
    } else {
        alert("Ask it directly to your friend :)")
    }
});

document.getElementById('icon-flip').addEventListener('click', function() {
    flipBoard();
});