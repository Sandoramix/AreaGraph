
from website import app, api, db, cur

# http server module
from gevent.pywsgi import WSGIServer


if __name__ == "__main__":
    # dev.
    # app.run(debug=True, port=8888)
    # production
    server = WSGIServer(('0.0.0.0', 8888), app)
    server.serve_forever()

    db.close()
    cur.close()
