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

function dismissMoonHint() {
    const hint = document.getElementById('moon-hint-bubble');
    if (!hint || hint.classList.contains('moon-hint-bubble--dismissed')) {
        return;
    }
    hint.classList.add('moon-hint-bubble--dismissed');
    setTimeout(function() {
        if (hint.parentNode) {
            hint.remove();
        }
    }, 480);
}

const moonHint = document.createElement('div');
moonHint.id = 'moon-hint-bubble';
moonHint.className = 'moon-hint-bubble';
moonHint.setAttribute('role', 'status');
moonHint.innerHTML =
    '<span class="moon-hint-text">Click me to enter Zen mode</span>' +
    '<span class="moon-hint-emoji" aria-hidden="true">\u00a0🌙</span>';
moon.appendChild(moonHint);
requestAnimationFrame(function() {
    moonHint.classList.add('moon-hint-bubble--visible');
});

// sage messages: panel left of board; toggle with moon-revealed icons on the right
const sagePanelWrap = document.createElement('aside');
sagePanelWrap.id = 'sage-panel';
sagePanelWrap.setAttribute('aria-label', 'Messages du sage');
sagePanelWrap.innerHTML = `
    <div class="sage-panel-inner">
        <p class="sage-panel-label">Le sage</p>
        <div id="sage-messages" class="sage-messages">
            <p id="sage-awaiting-mode" class="sage-message sage-awaiting-mode">Le sage arrive…</p>
        </div>
    </div>
`;
document.getElementById('board-container').appendChild(sagePanelWrap);

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
    <div class="floating-icon pointer" id="icon-sage-toggle" role="button" aria-pressed="true" title="Escape philosophy mode" tabindex="0">
        <svg class="icon-sage-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            <path d="M8 10h.01M12 10h.01M16 10h.01"></path>
            <line x1="6" y1="18" x2="19" y2="5"></line>
        </svg>
        <svg class="icon-sage-closed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
    </div>
`;
document.getElementById('board-container').appendChild(floatingIcons);

let iconsVisible = true;
floatingIcons.classList.add('icons-visible');

//click on the moon to toggle icons visibility
document.addEventListener('click', function(clicked) {
    if (clicked.target.id === "div-texture" || clicked.target.closest('.moon')) {
        dismissMoonHint();
        toggleIcons();
    }
});

function toggleIcons() {
    iconsVisible = !iconsVisible;
    if (iconsVisible) {
        floatingIcons.classList.add('icons-visible');
    } else {
        floatingIcons.classList.remove('icons-visible');
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

// sage messages panel toggle (same reveal as other icons via moon)
const sagePanel = document.getElementById('sage-panel');
const sageToggle = document.getElementById('icon-sage-toggle');
let sageMessagesVisible = true;

function setSagePanelVisible(visible) {
    sageMessagesVisible = visible;
    sagePanel.classList.toggle('sage-collapsed', !visible);
    sageToggle.classList.toggle('sage-toggle-collapsed', !visible);
    sageToggle.setAttribute('aria-pressed', visible ? 'true' : 'false');
    sageToggle.title = visible ? 'Escape philosophy mode' : 'Enter philosophy mode';
}

sageToggle.addEventListener('click', function() {
    setSagePanelVisible(!sageMessagesVisible);
});

sageToggle.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setSagePanelVisible(!sageMessagesVisible);
    }
});