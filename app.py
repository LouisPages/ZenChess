from flask import Flask, send_from_directory, request, jsonify
import os

from dotenv import load_dotenv

load_dotenv()

from zenbot import *
from sage import generate_sage_reflection
from sage.sage_llm import SAGE_SYSTEM_INSTRUCTION

app = Flask(__name__, static_folder='docs')

#serve html file
@app.route('/')
def index():
    return send_from_directory('docs', 'index.html')

# API routes must be registered before the catch-all static route
@app.route('/zenbot/get-bot-move', methods=['POST'])
def bot_move():
    try:
        data = request.get_json()
        curboard = data.get('curBoard')
        mode = data.get('mode')
        whoseturn = data.get('whoseTurn')
        castle_available = data.get('castleAvailable')
        lastmove = data.get('lastmove')

        if curboard:
            if mode == "random":
                chosen_move = play_random(curboard, whoseturn, castle_available, lastmove)
            if mode == "minmax":
                chosen_move = play_minmax(curboard, whoseturn, castle_available, lastmove)
            if mode == "eval":
                chosen_move = play_eval(curboard, whoseturn, castle_available, lastmove)
            if mode == "sunfish":
                chosen_move = play_sunfish(curboard, whoseturn, castle_available, lastmove)
            return jsonify({
                    'success': True,
                    'move': chosen_move 
                })
        else:
            return jsonify({
                'success': False,
                'error': 'No legal moves to play' 
            }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def _parse_include_engine_flag(raw) -> bool:
    if raw is None:
        return True
    if isinstance(raw, bool):
        return raw
    if isinstance(raw, (int, float)):
        return bool(raw)
    s = str(raw).strip().lower()
    if s in ('0', 'false', 'no', 'off'):
        return False
    return True


def _parse_include_llm_prompt_flag(raw) -> bool:
    if raw is None:
        return False
    if isinstance(raw, bool):
        return raw
    if isinstance(raw, (int, float)):
        return bool(raw)
    s = str(raw).strip().lower()
    if s in ('1', 'true', 'yes', 'on'):
        return True
    return False


@app.route('/api/sage-reflection', methods=['POST'])
def sage_reflection_route():
    try:
        data = request.get_json() or {}
        board = data.get('board')
        last_move = data.get('lastMove')
        player_moved = data.get('playerMoved')
        opening = data.get('opening') is True
        prior_raw = data.get('priorReflections')
        prior_reflections = []
        if isinstance(prior_raw, list):
            prior_reflections = [str(x).strip() for x in prior_raw if str(x).strip()]

        whoseturn = data.get('whoseTurn')
        if whoseturn not in ('w', 'b'):
            whoseturn = None

        castle_raw = data.get('castleAvailable')
        castle_available = castle_raw if isinstance(castle_raw, dict) else None

        include_engine = _parse_include_engine_flag(data.get('includeEngine'))
        include_llm_prompt = _parse_include_llm_prompt_flag(data.get('includeLlmPrompt'))

        if board is None:
            return jsonify({
                'success': False,
                'error': 'Requête invalide : board requis.',
            }), 400

        common_kw = dict(
            prior_reflections=prior_reflections,
            whoseturn=whoseturn,
            castle_available=castle_available,
            include_engine=include_engine,
            return_llm_prompt=include_llm_prompt,
        )

        if opening:
            result = generate_sage_reflection(board, opening=True, **common_kw)
        elif last_move is None or player_moved not in ('w', 'b'):
            return jsonify({
                'success': False,
                'error': 'Requête invalide : lastMove et playerMoved (w|b) requis, ou opening: true.',
            }), 400
        else:
            result = generate_sage_reflection(
                board, last_move, player_moved, **common_kw
            )

        if include_llm_prompt:
            message, user_prompt = result
            return jsonify({
                'success': True,
                'message': message,
                'llmUserPrompt': user_prompt,
                'llmSystemPrompt': SAGE_SYSTEM_INSTRUCTION,
            })
        return jsonify({'success': True, 'message': result})
    except RuntimeError as e:
        return jsonify({'success': False, 'error': str(e)}), 503
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# serve static files (after explicit routes)
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('docs', path)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
    