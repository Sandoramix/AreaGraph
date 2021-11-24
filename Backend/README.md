# TODO
* Configurare il file **.env** , prendendo di riferimento il file **.env-example**
---
Per il deploy su heroku c'e bisogno del modello di python "Gunicorn" che e' disponibile solamente su **linux**

##### Se si vuole avviare il backend localmente su windows [dev mode]:
*	su **main** importare WSGIServer da gevent.pywsgi e cambiare app.run() con :
  ``` 
  server=WSGIServer(('0.0.0.0',80),app)
  server.serve_forever()   
