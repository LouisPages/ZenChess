from flask import Flask, send_from_directory, request, jsonify
import os
from zenbot import get_random_move

app = Flask(__name__, static_folder='docs')

#serve html file
@app.route('/')
def index():
    return send_from_directory('docs', 'index.html')

#serve static files
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('docs', path)

#serve zenbot module
@app.route('/zenbot/get-bot-move', methods=['POST'])
def bot_move():
    try:
        data = request.get_json()
        legal_moves = data.get('legalMoves')
        if legal_moves and len(legal_moves) > 0:
            chosen_move = get_random_move(legal_moves)
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



if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
    