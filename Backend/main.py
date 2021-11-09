
from website import app,api,db,cur,execute_query

#http server module
from gevent.pywsgi import WSGIServer


if __name__=="__main__":
    #dev.
    #app.run(debug=True,port=8080)
    #production
    server=WSGIServer(('0.0.0.0',7780),app)
    server.serve_forever()
    
    db.close()
    cur.close()