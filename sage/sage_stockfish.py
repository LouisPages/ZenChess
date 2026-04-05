"""Optional Stockfish analysis for sage prompts (STOCKFISH_PATH)."""
from __future__ import annotations

import os
from typing import Any, Optional

import chess
import chess.engine

from zenbot.interaction import convert_board


def _env_int(name: str, default: int, *, lo: int = 1, hi: int = 64) -> int:
    raw = (os.environ.get(name) or "").strip()
    if not raw:
        return default
    try:
        v = int(raw)
        return max(lo, min(hi, v))
    except ValueError:
        return default


def _normalize_analyse_result(raw: Any) -> list[dict[str, Any]]:
    if isinstance(raw, dict):
        return [raw]
    if raw is None:
        return []
    return list(raw)


def _score_caption_white_pov(score) -> str:
    w = score.white()
    if w.is_mate():
        m = w.mate()
        if m is None:
            return "mat annoncé"
        if m > 0:
            return f"mat forcé pour les Blancs en {m} coup(s) au mieux"
        return f"mat forcé pour les Noirs en {abs(m)} coup(s) au mieux"
    cp = w.score()
    if cp is None:
        return "évaluation indisponible"
    pawns = cp / 100.0
    if abs(pawns) < 0.12:
        return "position très équilibrée (~0 pion du côté des Blancs)"
    if pawns > 0:
        return f"pression du côté des Blancs (~{pawns:+.1f} pion)"
    return f"pression du côté des Noirs (~{-pawns:.1f} pion)"


def build_stockfish_digest_for_sage(
    curboard: Any,
    *,
    whoseturn: str,
    castle_available: dict[str, Any],
    lastmove: Any,
) -> Optional[str]:
    """Returns a short French summary for the LLM, or None if analysis is skipped or fails."""
    path = (os.environ.get("STOCKFISH_PATH") or "").strip()
    if not path:
        return None
    if whoseturn not in ("w", "b"):
        return None
    required = ("wright", "wleft", "bright", "bleft")
    if not isinstance(castle_available, dict) or not all(k in castle_available for k in required):
        return None
    try:
        board = convert_board(curboard, whoseturn, castle_available, lastmove)
    except Exception:
        return None

    depth = _env_int("SAGE_STOCKFISH_DEPTH", 12, lo=4, hi=40)
    multipv = _env_int("SAGE_STOCKFISH_MULTIPV", 3, lo=1, hi=5)
    max_plies = _env_int("SAGE_STOCKFISH_MAX_PLIES", 12, lo=4, hi=24)

    try:
        with chess.engine.SimpleEngine.popen_uci(path) as engine:
            raw_info = engine.analyse(
                board,
                chess.engine.Limit(depth=depth),
                multipv=multipv,
            )
    except (chess.engine.EngineError, OSError, FileNotFoundError, PermissionError):
        return None
    except Exception:
        return None

    infos = _normalize_analyse_result(raw_info)
    if not infos:
        return None

    best = infos[0]
    score = best.get("score")
    if score is None:
        return None

    header = (
        f"Joueur au trait : {'Blancs' if board.turn == chess.WHITE else 'Noirs'}. "
        f"{_score_caption_white_pov(score)}."
    )

    parts: list[str] = [header]
    for i, info in enumerate(infos):
        pv = info.get("pv") or []
        if not pv:
            continue
        try:
            san = board.variation_san(pv[:max_plies])
        except (chess.IllegalMoveError, chess.AmbiguousMoveError, ValueError):
            continue
        if not san.strip():
            continue
        label = "Suite principale envisagée" if i == 0 else f"Autre idée {i + 1}"
        parts.append(f"{label} : {san}")

    if len(parts) == 1:
        return None

    return "\n".join(parts)
