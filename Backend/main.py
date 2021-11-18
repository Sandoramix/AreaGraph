
from website import app, api

# http server module
from gevent.pywsgi import WSGIServer


if __name__ == "__main__":
    # dev.
    #app.run(debug=True, port=8888, threaded=True)
    # production
    server = WSGIServer(('0.0.0.0', 8888), app)
    server.serve_forever()
