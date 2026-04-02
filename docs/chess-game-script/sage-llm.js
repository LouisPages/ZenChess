/**
 * Sage / Mistral : ouverture (ami ou ZenBot) et réflexion après chaque coup du joueur
 * (ami ou ZenBot ; le coup du bot ne déclenche rien).
 */
function removeSageAwaitingModePlaceholder() {
    const el = document.getElementById('sage-awaiting-mode');
    if (el) {
        el.remove();
    }
}

function collectPriorSageReflections(box) {
    const out = [];
    if (!box) {
        return out;
    }
    box.querySelectorAll('.sage-message').forEach(function (el) {
        if (el.id === 'sage-loading-msg') {
            return;
        }
        if (
            el.classList.contains('sage-loading') ||
            el.classList.contains('sage-message-error') ||
            el.classList.contains('sage-awaiting-mode')
        ) {
            return;
        }
        const t = (el.textContent || '').trim();
        if (t) {
            out.push(t);
        }
    });
    return out;
}

function revealSageMessageElement(el) {
    el.classList.add('sage-message-appear');
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            el.classList.add('sage-message-appear-ready');
        });
    });
}

function requestSageReflectionFromApi(payload, box) {
    const priorReflections = collectPriorSageReflections(box);
    const body = Object.assign({}, payload, { priorReflections: priorReflections });

    const prevLoad = document.getElementById('sage-loading-msg');
    if (prevLoad) {
        prevLoad.remove();
    }
    const loadingEl = document.createElement('p');
    loadingEl.id = 'sage-loading-msg';
    loadingEl.className = 'sage-message sage-loading sage-message-appear';
    loadingEl.textContent = 'Le sage médite…';
    box.appendChild(loadingEl);
    revealSageMessageElement(loadingEl);
    box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });

    fetch('/api/sage-reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
        .then(function (r) {
            return r.json().then(function (data) {
                return { ok: r.ok, data: data };
            });
        })
        .then(function (result) {
            const loading = document.getElementById('sage-loading-msg');
            if (loading) {
                loading.remove();
            }

            const p = document.createElement('p');
            p.className = 'sage-message';

            if (result.ok && result.data.success && result.data.message) {
                p.textContent = result.data.message;
            } else {
                p.classList.add('sage-message-error');
                const err = (result.data && result.data.error) || 'Réponse invalide';
                p.textContent = 'Le silence du sage… (' + err + ')';
            }
            box.appendChild(p);
            revealSageMessageElement(p);
            box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
        })
        .catch(function (err) {
            const loading = document.getElementById('sage-loading-msg');
            if (loading) {
                loading.remove();
            }
            const p = document.createElement('p');
            p.className = 'sage-message sage-message-error';
            p.textContent =
                'Le silence du sage… (réseau ou serveur : ' + (err.message || 'erreur') + ')';
            box.appendChild(p);
            revealSageMessageElement(p);
            box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
        });
}

function requestSageReflection(playerMoved, boardSnapshot, lastMoveSnapshot) {
    const box = document.getElementById('sage-messages');
    if (!box || (mode !== 'friend' && mode !== 'zenbot')) {
        return;
    }
    if (mode === 'zenbot' && playerMoved === zenBotColor) {
        return;
    }
    requestSageReflectionFromApi(
        {
            board: boardSnapshot,
            lastMove: lastMoveSnapshot,
            playerMoved: playerMoved,
        },
        box
    );
}

/** Premier message : plateau initial, aucun coup joué (même consigne système côté serveur). */
function requestSageOpeningReflection() {
    const box = document.getElementById('sage-messages');
    if (!box || typeof curBoard === 'undefined' || (mode !== 'friend' && mode !== 'zenbot')) {
        return;
    }
    removeSageAwaitingModePlaceholder();
    requestSageReflectionFromApi(
        {
            opening: true,
            board: JSON.parse(JSON.stringify(curBoard)),
        },
        box
    );
}

(function initSageAwaitingModeReveal() {
    const el = document.getElementById('sage-awaiting-mode');
    if (el) {
        revealSageMessageElement(el);
    }
})();
