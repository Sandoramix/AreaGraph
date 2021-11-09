from website import app,api,db,cur
from gevent.pywsgi import WSGIServer




if __name__=="__main__":
    #app.run(debug=True,port=8080)
    server=WSGIServer(('0.0.0.0',8080),app)
    server.serve_forever()
    db.close()
    cur.close()