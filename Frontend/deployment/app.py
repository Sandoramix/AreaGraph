from flask import Flask, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, send_wildcard=True)


@app.route('/<path:path>', methods=['GET'])
def static_proxy(path):
    return send_from_directory('./website', path)


@app.route('/')
def root():
    return send_from_directory('./website', 'index.html')


if __name__ == "__main__":
    app.run()
