"""Build prompts and call Mistral or Anthropic for the sage reflection feature."""
import os
import re
from typing import Any, Optional, Union

from anthropic import Anthropic
from mistralai.client import Mistral

from .sage_stockfish import build_stockfish_digest_for_sage

_DEFAULT_ANTHROPIC_MODEL = "claude-3-5-haiku-20241022"

SAGE_SYSTEM_INSTRUCTION = """Tu es un sage philosophe qui observe une partie d'échecs en silence.
Tu t'inspires de Proust, Socrate, Marc-Aurèle, Sun Tzu, Lao-Tseu, Épictète, Nietzsche, Confucius, Heidegger, Voltaire, Victor Hugo, en variant
les philosophes convoqués au fil de la partie.
Avant le premier coup comme après chaque coup joué, tu partages une réflexion courte (IMPORTANT : 100 caractères maximum, espace compris) qui :
- Cite TOUJOURS un concept philosophique nommé, une œuvre, ou une citation directe
  d'un de ces philosophes (en l'attribuant explicitement)
  DANS LE CAS Où UNE PHRASE EST PRéSENTé COMME UNE CITATION, LA CITATION DOIT ÊTRE EXACTE, N'INVENTE PAS !
- Relie ce concept à la situation sur l'échiquier de façon métaphorique (potentiel initial ou mouvement selon le contexte)
- Ne commente jamais le jeu de façon technique : pas de notation algébrique, pas de variantes, pas de ton commentateur.
  Si le message utilisateur contient une « Lecture approfondie » (résumé d'un fort programme sur la position),
  sers-t'en seulement pour sentir tension, équilibre, bascule possible ou pression — traduis ça en image poétique,
  sans jamais recracher ces coups ni citer le moteur.
Format idéal : La citation est inséré avec fluidité et en lien avec le moment de la partie.

IMPORTANT : Je n'attends pas une structure en deux temps (citation puis lien), la citation est fondue dans la réflexion,
elle arrive naturellement, comme si le philosophe pensait à voix haute plutôt que de faire un cours. Évite à
tout prix les formules pompeuse comme "comme l'a dit X", "comme disait Y" et autres formules comme ça.

STYLE : Tu es un sage mais tu restes simple. Ne sois pas pompeux avec des choses compliquées. Evite d'utiliser le verbe "lover"
ou d'utiliser des expressions répétitives comme "et chaque case/pièce...". Ne cite pas les cases de l'échiquier.
Cite les pièces de temps en temps, mais pas à chaque réplique.

TRÈS IMPORTANT — mémoire de la partie : le message utilisateur peut inclure, après un séparateur, la liste chronologique
de tes réflexions déjà prononcées dans cette même partie. Tu dois t'en servir pour éviter de recycler les mêmes citations,
les mêmes auteurs ou les mêmes images métaphoriques ; varie les angles, le vocabulaire et les sources invoquées.
Si la liste est absente ou vide (premier message), aucune contrainte de ce type."""


def _algebraic(row: int, col: int) -> str:
    row, col = int(row), int(col)
    file_letter = chr(ord("a") + col)
    rank = 8 - row
    return f"{file_letter}{rank}"


def format_board_for_prompt(board) -> str:
    """Human-readable grid; row 0 = 8th rank (black back rank), col 0 = a-file."""
    lines = []
    for i in range(8):
        rank = 8 - i
        cells = []
        for j in range(8):
            cell = board[i][j]
            if not cell or not cell[0]:
                cells.append("·")
            else:
                piece = cell[0]
                color = cell[1] if len(cell) > 1 else "?"
                color_fr = "blanc" if color == "w" else "noir" if color == "b" else str(color)
                cells.append(f"{piece}({color_fr})")
        lines.append(f"Rang {rank} : " + " ".join(cells))
    lines.append("Colonnes : a = gauche, h = droite (vue standard).")
    return "\n".join(lines)


def format_last_move_for_prompt(last_move, player_moved: str) -> str:
    if not last_move or len(last_move) < 3:
        return "Dernier coup : inconnu."
    piece, from_sq, to_sq = last_move[0], last_move[1], last_move[2]
    fr = _algebraic(from_sq[0], from_sq[1])
    to = _algebraic(to_sq[0], to_sq[1])
    side = "Les Blancs" if player_moved == "w" else "Les Noirs"
    return f"{side} viennent de jouer : pièce {piece} de la case {fr} vers la case {to}."


def _engine_section(digest: Optional[str]) -> str:
    if not digest:
        return ""
    return (
        "\n\n---\nLecture approfondie (synthèse moteur — pour t'orienter métaphoriquement, "
        "à ne pas reciter ni nommer dans ta réponse) :\n\n"
        f"{digest}"
    )


def build_user_message(
    board,
    last_move,
    player_moved: str,
    *,
    engine_digest: Optional[str] = None,
) -> str:
    return (
        "Voici l'état ACTUEL du plateau après ce coup (c'est la vérité à respecter, "
        "y compris pour une promotion de pion) :\n\n"
        f"{format_board_for_prompt(board)}\n\n"
        f"{format_last_move_for_prompt(last_move, player_moved)}\n\n"
        f"{_engine_section(engine_digest)}"
    )


def build_user_message_opening(board, *, engine_digest: Optional[str] = None) -> str:
    return (
        "La partie vient de commencer entre deux joueurs côte à côte. "
        "Aucun coup n'a encore été joué.\n\n"
        "Voici la position initiale de l'échiquier (référence pour ton image intérieure du plateau) :\n\n"
        f"{format_board_for_prompt(board)}\n\n"
        "Offre une réflexion d'ouverture."
        f"{_engine_section(engine_digest)}"
    )


def _append_prior_reflections_to_user_text(
    user_text: str,
    prior_reflections: Optional[list[str]],
    *,
    max_messages: int = 20,
    max_chars_per_message: int = 400,
) -> str:
    if not prior_reflections:
        return user_text
    cleaned: list[str] = []
    for raw in prior_reflections[-max_messages:]:
        s = str(raw).strip()
        if not s:
            continue
        if len(s) > max_chars_per_message:
            s = s[: max_chars_per_message - 1] + "…"
        cleaned.append(s)
    if not cleaned:
        return user_text
    numbered = "\n".join(f"{i + 1}. {t}" for i, t in enumerate(cleaned))
    return (
        f"{user_text}\n\n---\n"
        "Tes réflexions déjà prononcées dans cette partie (à ne pas répéter ni paraphraser de trop près) :\n\n"
        f"{numbered}"
    )


def _assistant_text_mistral(chat_response) -> str:
    if not chat_response.choices:
        return ""
    msg = chat_response.choices[0].message
    content = getattr(msg, "content", None)
    if content is None:
        return ""
    if isinstance(content, str):
        return content.strip()
    if isinstance(content, list):
        parts = []
        for block in content:
            if isinstance(block, str):
                parts.append(block)
            elif isinstance(block, dict) and "text" in block:
                parts.append(str(block["text"]))
            else:
                text = getattr(block, "text", None)
                if text:
                    parts.append(str(text))
        return " ".join(parts).strip()
    return str(content).strip()


def _assistant_text_anthropic(message) -> str:
    content = getattr(message, "content", None) or []
    parts: list[str] = []
    for block in content:
        text = getattr(block, "text", None)
        if text:
            parts.append(str(text))
        elif isinstance(block, dict) and block.get("type") == "text":
            parts.append(str(block.get("text") or ""))
    return " ".join(parts).strip()


def _sage_llm_provider() -> str:
    raw = (os.environ.get("SAGE_LLM_PROVIDER") or "mistral").strip().lower()
    if raw in ("mistral", "anthropic"):
        return raw
    raise RuntimeError(
        "SAGE_LLM_PROVIDER doit valoir « mistral » ou « anthropic » "
        f"(reçu : {raw!r})."
    )


def _sanitize_sage_plain_text(text: str) -> str:
    """Retire le bruit Markdown (*, **) que le modèle produit encore parfois malgré le system prompt."""
    t = text.replace("**", "")
    prev = None
    while prev != t:
        prev = t
        t = re.sub(r"\*([^*\n]+)\*", r"\1", t)
    t = re.sub(r"^#+\s*", "", t, flags=re.MULTILINE)
    return re.sub(r"[ \t]{2,}", " ", t).strip()


def _generate_sage_with_mistral(user_text: str) -> str:
    api_key = (os.environ.get("MISTRAL_API_KEY") or "").strip()
    if not api_key:
        raise RuntimeError(
            "Variable d'environnement MISTRAL_API_KEY manquante (définir dans .env)."
        )
    model_name = (os.environ.get("MISTRAL_MODEL") or "").strip() or "mistral-small-latest"
    client = Mistral(api_key=api_key)
    try:
        chat_response = client.chat.complete(
            model=model_name,
            messages=[
                {"role": "system", "content": SAGE_SYSTEM_INSTRUCTION},
                {"role": "user", "content": user_text},
            ],
            temperature=0.85,
            max_tokens=512,
        )
    except Exception as e:
        raise RuntimeError(f"Erreur API Mistral : {e}") from e
    return _assistant_text_mistral(chat_response)


def _generate_sage_with_anthropic(user_text: str) -> str:
    api_key = (os.environ.get("ANTHROPIC_API_KEY") or "").strip()
    if not api_key:
        raise RuntimeError(
            "Variable d'environnement ANTHROPIC_API_KEY manquante (définir dans .env)."
        )
    model_name = (os.environ.get("ANTHROPIC_MODEL") or "").strip() or _DEFAULT_ANTHROPIC_MODEL
    client = Anthropic(api_key=api_key)
    try:
        msg = client.messages.create(
            model=model_name,
            max_tokens=512,
            system=SAGE_SYSTEM_INSTRUCTION,
            messages=[{"role": "user", "content": user_text}],
            temperature=0.85,
        )
    except Exception as e:
        raise RuntimeError(f"Erreur API Anthropic : {e}") from e
    return _assistant_text_anthropic(msg)


def _resolve_whoseturn(
    *,
    opening: bool,
    player_moved: Optional[str],
    whoseturn: Optional[str],
) -> str:
    if whoseturn in ("w", "b"):
        return whoseturn
    if opening:
        return "w"
    if player_moved == "w":
        return "b"
    if player_moved == "b":
        return "w"
    return "w"


def generate_sage_reflection(
    board: Any,
    last_move: Any = None,
    player_moved: Optional[str] = None,
    *,
    opening: bool = False,
    prior_reflections: Optional[list[str]] = None,
    whoseturn: Optional[str] = None,
    castle_available: Optional[dict] = None,
    include_engine: bool = True,
    return_llm_prompt: bool = False,
) -> Union[str, tuple[str, str]]:
    wt = _resolve_whoseturn(
        opening=opening, player_moved=player_moved, whoseturn=whoseturn
    )
    engine_digest: Optional[str] = None
    if include_engine and not opening and isinstance(castle_available, dict):
        engine_digest = build_stockfish_digest_for_sage(
            board,
            whoseturn=wt,
            castle_available=castle_available,
            lastmove=last_move,
        )

    if opening:
        user_text = build_user_message_opening(board, engine_digest=engine_digest)
    else:
        if last_move is None or player_moved not in ("w", "b"):
            raise ValueError("last_move et playerMoved (w|b) requis sauf pour opening=True")
        user_text = build_user_message(
            board, last_move, player_moved, engine_digest=engine_digest
        )

    user_text = _append_prior_reflections_to_user_text(user_text, prior_reflections)

    provider = _sage_llm_provider()
    if provider == "anthropic":
        text = _generate_sage_with_anthropic(user_text)
    else:
        text = _generate_sage_with_mistral(user_text)

    if not text:
        raise RuntimeError("Réponse vide du modèle.")
    out = _sanitize_sage_plain_text(text)
    if return_llm_prompt:
        return out, user_text
    return out
