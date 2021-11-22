
from website import app, api

# http server module
# from gevent.pywsgi import WSGIServer


if __name__ == "__main__":
    # dev.
    app.run(threaded=True)
    # production
