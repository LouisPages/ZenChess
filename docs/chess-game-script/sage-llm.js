/**
 * Sage / Mistral : ouverture (ami ou ZenBot) et réflexion après chaque coup du joueur
 * (ami ou ZenBot ; le coup du bot ne déclenche rien).
 *
 * Panneau / API debug prompts : SHOW_SAGE_LLM_PROMPT_PANEL dans sage-llm-config.js
 */
function isSageLlmPromptPanelEnabled() {
    return typeof SHOW_SAGE_LLM_PROMPT_PANEL !== 'undefined' && SHOW_SAGE_LLM_PROMPT_PANEL === true;
}

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

function setSageLlmPromptPanelLoading() {
    const pre = document.getElementById('sage-llm-prompt-body');
    if (!pre) {
        return;
    }
    pre.textContent =
        'Requête en cours… Le message utilisateur complet sera affiché dès que le serveur aura répondu.';
}

function setSageLlmPromptPanelContent(systemText, userText) {
    const pre = document.getElementById('sage-llm-prompt-body');
    if (!pre) {
        return;
    }
    const parts = [];
    if (systemText) {
        parts.push('── Système ──\n' + String(systemText));
    }
    if (userText != null && userText !== '') {
        parts.push('── Message utilisateur ──\n' + String(userText));
    }
    pre.textContent = parts.length ? parts.join('\n\n') : '—';
}

function setSageLlmPromptPanelError(message) {
    const pre = document.getElementById('sage-llm-prompt-body');
    if (!pre) {
        return;
    }
    pre.textContent = '—\n\n(Impossible d’afficher le prompt : ' + String(message || 'erreur') + ')';
}

function requestSageReflectionFromApi(payload, box) {
    const priorReflections = collectPriorSageReflections(box);
    const body = Object.assign({}, payload, { priorReflections: priorReflections });
    if (isSageLlmPromptPanelEnabled()) {
        body.includeLlmPrompt = true;
        setSageLlmPromptPanelLoading();
    }

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

            const data = result.data || {};
            if (result.ok && data.success && data.message) {
                p.textContent = data.message;
                if (isSageLlmPromptPanelEnabled() && data.llmUserPrompt != null) {
                    setSageLlmPromptPanelContent(data.llmSystemPrompt, data.llmUserPrompt);
                }
            } else {
                p.classList.add('sage-message-error');
                const err = data.error || 'Réponse invalide';
                p.textContent = 'Le silence du sage… (' + err + ')';
                if (isSageLlmPromptPanelEnabled()) {
                    if (data.llmUserPrompt != null) {
                        setSageLlmPromptPanelContent(data.llmSystemPrompt, data.llmUserPrompt);
                    } else {
                        setSageLlmPromptPanelError(err);
                    }
                }
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
            if (isSageLlmPromptPanelEnabled()) {
                setSageLlmPromptPanelError(err.message || 'réseau');
            }
        });
}

function requestSageReflection(
    playerMoved,
    boardSnapshot,
    lastMoveSnapshot,
    whoseTurnToMove,
    castleSnapshot
) {
    const box = document.getElementById('sage-messages');
    if (!box || (mode !== 'friend' && mode !== 'zenbot')) {
        return;
    }
    if (mode === 'zenbot' && playerMoved === zenBotColor) {
        return;
    }
    const payload = {
        board: boardSnapshot,
        lastMove: lastMoveSnapshot,
        playerMoved: playerMoved,
    };
    if (whoseTurnToMove === 'w' || whoseTurnToMove === 'b') {
        payload.whoseTurn = whoseTurnToMove;
    }
    if (castleSnapshot && typeof castleSnapshot === 'object') {
        payload.castleAvailable = castleSnapshot;
    }
    requestSageReflectionFromApi(payload, box);
}

/** Premier message : plateau initial, aucun coup joué (même consigne système côté serveur). */
function requestSageOpeningReflection() {
    const box = document.getElementById('sage-messages');
    if (!box || typeof curBoard === 'undefined' || (mode !== 'friend' && mode !== 'zenbot')) {
        return;
    }
    removeSageAwaitingModePlaceholder();
    const openingPayload = {
        opening: true,
        board: JSON.parse(JSON.stringify(curBoard)),
    };
    if (typeof whoseTurn !== 'undefined' && (whoseTurn === 'w' || whoseTurn === 'b')) {
        openingPayload.whoseTurn = whoseTurn;
    }
    if (typeof castle !== 'undefined' && castle !== null) {
        openingPayload.castleAvailable = JSON.parse(JSON.stringify(castle));
    }
    requestSageReflectionFromApi(openingPayload, box);
}

(function initSageAwaitingModeReveal() {
    const el = document.getElementById('sage-awaiting-mode');
    if (el) {
        revealSageMessageElement(el);
    }
})();
