from os import truncate
from flask import Flask, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, send_wildcard=True)


@app.route('/<path:path>', methods=['GET'])
def static_proxy(path):
    print(path)
    return send_from_directory('./website', path)


@app.route('/')
def root():
    return send_from_directory('./website', 'index.html')


@app.route('/home')
def home():
    return send_from_directory('./website', 'index.html')


@app.route('/about')
def about():
    return send_from_directory('./website', 'index.html')


@app.route('/map')
def map():
    return send_from_directory('./website', 'index.html')


if __name__ == "__main__":
    app.run()
