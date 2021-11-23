from flask import Flask, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, send_wildcard=True)


@app.route('/<path:path>', methods=['GET'])
def static_proxy(path):
    print(path)
    return send_from_directory('./frontend', path)


@app.route('/', methods=['GET'])
def root():
    return send_from_directory('./frontend', 'index.html')


@app.route('/home', methods=['GET'])
def home():
    return send_from_directory('./frontend', 'index.html')


@app.route('/about', methods=['GET'])
def about():
    return send_from_directory('./frontend', 'index.html')


@app.route('/map', methods=['GET'])
def map():
    return send_from_directory('./frontend', 'index.html')


if __name__ == "__main__":
    app.run()
