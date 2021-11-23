# Deploy
*	Per il deploy del backend c'e bisogno del modello di python "Gunicorn" che e' disponibile solamente su **linux**

##### Se si vuole avviare il backend localmente su windows, bisogna:
*	cambiare su _requirements.txt_ il nome del modulo _psycopg2-binary_ in  _psycopg2_
*	cancellare da _requirements.txt_ il modulo "_gunicorn_"
