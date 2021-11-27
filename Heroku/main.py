
from backend import app
from flask import send_from_directory

# Frontend routes


@app.route('/', methods=['GET'])
def root():
    return send_from_directory('../frontend', 'index.html')


@app.route('/<path:path>', methods=['GET'])
def static_proxy(path):
    return send_from_directory('../frontend', path)


@app.route('/home', methods=['GET'])
def home():
    return send_from_directory('../frontend', 'index.html')


@app.route('/about', methods=['GET'])
def about():
    return send_from_directory('../frontend', 'index.html')


@app.route('/map', methods=['GET'])
def map():
    return send_from_directory('../frontend', 'index.html')


if __name__ == "__main__":
    app.run(debug=True)
