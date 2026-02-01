from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='client')

#serve html file
@app.route('/')
def index():
    return send_from_directory('client', 'index.html')

#serve static files
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('client', path)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)