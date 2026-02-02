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

// Floating icons creation
const floatingIcons = document.createElement('div');
floatingIcons.id = 'floating-icons';

/*
<div class="floating-icon pointer" id="icon-info" title="Info">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6m5.6-14.6l-4.2 4.2m0 6.8l4.2 4.2M23 12h-6m-6 0H5m14.6 5.6l-4.2-4.2m-6.8 0l-4.2 4.2"></path>
        </svg>
    </div>
    <div class="floating-icon pointer" id="icon-colors" title="Board Colors">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 2L10.5 5.5 12 6.5 13.5 5.5 12 2z"></path>
            <path d="M12 22L10.5 18.5 12 17.5 13.5 18.5 12 22z"></path>
            <path d="M22 12L18.5 10.5 17.5 12 18.5 13.5 22 12z"></path>
            <path d="M2 12L5.5 10.5 6.5 12 5.5 13.5 2 12z"></path>
            <path d="M19.07 4.93L16.24 7.76 17.24 8.76 18.24 7.76 19.07 4.93z"></path>
            <path d="M4.93 19.07L7.76 16.24 8.76 17.24 7.76 18.24 4.93 19.07z"></path>
            <path d="M19.07 19.07L16.24 16.24 17.24 15.24 18.24 16.24 19.07 19.07z"></path>
            <path d="M4.93 4.93L7.76 7.76 8.76 6.76 7.76 5.76 4.93 4.93z"></path>
        </svg>
    </div>
*/

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

// Icons are hidden by default
let iconsVisible = false;

// Click on the moon to toggle icons visibility
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

// Info panel (right side of board)
const infoPanel = document.createElement('div');
infoPanel.id = 'info-panel';
infoPanel.innerHTML = `
    <div class="info-content">
        <div class="info-header">
            <span class="info-title">Game Info</span>
            <span id="close-info" class="pointer">✕</span>
        </div>
        <div class="info-body">
            <div class="info-section">
                <h3>Current Turn</h3>
                <p id="current-turn">White to move</p>
            </div>
            <div class="info-section">
                <h3>Game Mode</h3>
                <p id="game-mode">Not started</p>
            </div>
            <div class="info-section">
                <h3>Status</h3>
                <p id="game-status">Waiting...</p>
            </div>
        </div>
    </div>
`;
document.body.appendChild(infoPanel);

// Color picker panel
const colorPanel = document.createElement('div');
colorPanel.id = 'color-panel';
colorPanel.innerHTML = `
    <div class="color-content">
        <div class="color-header">
            <span class="color-title">Board Colors</span>
            <span id="close-colors" class="pointer">✕</span>
        </div>
        <div class="color-body">
            <div class="color-option">
                <label>Light Squares</label>
                <input type="color" id="light-square-color" value="#dbb17d">
            </div>
            <div class="color-option">
                <label>Dark Squares</label>
                <input type="color" id="dark-square-color" value="#a3610f">
            </div>
            <button id="apply-colors" class="apply-btn pointer">Apply</button>
            <button id="reset-colors" class="reset-btn pointer">Reset</button>
        </div>
    </div>
`;
document.body.appendChild(colorPanel);

// // Icon click handlers
// document.getElementById('icon-info').addEventListener('click', function() {
//     togglePanel('info-panel');
// });

// document.getElementById('icon-colors').addEventListener('click', function() {
//     togglePanel('color-panel');
// });

document.getElementById('icon-resign').addEventListener('click', function() {
    if (confirm('Are you sure you want to resign?')) {
        // Tu peux ajouter la logique de fin de partie ici
        alert('You have resigned. Game over.');
    }
});

document.getElementById('icon-draw').addEventListener('click', function() {
    // Vérifier si on joue contre le bot
    if (typeof mode !== 'undefined' && mode === 'zenbot') {
        if (confirm('Offer a draw to ZenBot?')) {
            // Logique pour proposer la nulle au bot
            alert('ZenBot declined the draw offer.');
        }
    } else {
        if (confirm('Offer a draw to your opponent?')) {
            alert('Draw offer sent.');
        }
    }
});

document.getElementById('icon-flip').addEventListener('click', function() {
    flipBoard();
});

// Close panel buttons
document.getElementById('close-info').addEventListener('click', function() {
    closePanel('info-panel');
});

document.getElementById('close-colors').addEventListener('click', function() {
    closePanel('color-panel');
});

// Color application
document.getElementById('apply-colors').addEventListener('click', function() {
    const lightColor = document.getElementById('light-square-color').value;
    const darkColor = document.getElementById('dark-square-color').value;
    
    document.querySelectorAll('.square-bright').forEach(square => {
        square.style.backgroundColor = lightColor;
    });
    
    document.querySelectorAll('.square-dark').forEach(square => {
        square.style.backgroundColor = darkColor;
    });
    
    closePanel('color-panel');
});

document.getElementById('reset-colors').addEventListener('click', function() {
    document.getElementById('light-square-color').value = '#dbb17d';
    document.getElementById('dark-square-color').value = '#a3610f';
    
    document.querySelectorAll('.square-bright').forEach(square => {
        square.style.backgroundColor = '#dbb17d';
    });
    
    document.querySelectorAll('.square-dark').forEach(square => {
        square.style.backgroundColor = '#a3610f';
    });
});

// Panel management functions
function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    const allPanels = ['info-panel', 'color-panel'];
    
    // Close other panels
    allPanels.forEach(id => {
        if (id !== panelId) {
            closePanel(id);
        }
    });
    
    if (panel.classList.contains('panel-visible')) {
        closePanel(panelId);
    } else {
        openPanel(panelId);
    }
}

function openPanel(panelId) {
    const panel = document.getElementById(panelId);
    panel.classList.add('panel-visible');
    setTimeout(() => {
        panel.classList.add('panel-active');
    }, 10);
}

function closePanel(panelId) {
    const panel = document.getElementById(panelId);
    panel.classList.remove('panel-active');
    setTimeout(() => {
        panel.classList.remove('panel-visible');
    }, 300);
}

// Close panels when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('#info-panel') && 
        !e.target.closest('#color-panel') && 
        !e.target.closest('.floating-icon')) {
        closePanel('info-panel');
        closePanel('color-panel');
    }
});

// ESC key to close panels
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePanel('info-panel');
        closePanel('color-panel');
    }
});

// Update game mode visibility based on mode
function updateIconsVisibility() {
    const resignIcon = document.getElementById('icon-resign');
    const drawIcon = document.getElementById('icon-draw');
    
    if (typeof mode !== 'undefined' && mode === 'zenbot') {
        resignIcon.style.display = 'flex';
        drawIcon.style.display = 'flex';
    } else if (typeof mode !== 'undefined' && mode === 'friend') {
        resignIcon.style.display = 'flex';
        drawIcon.style.display = 'flex';
    } else {
        resignIcon.style.display = 'none';
        drawIcon.style.display = 'none';
    }
}