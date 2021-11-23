#  <img src="https://i.imgur.com/ODvK2av.png" align="left" height="10%" width="10%" style='position:absolute;top:0;left:0'> AreaGraph



Progetto di scuola lavoro

## Obiettivo:
*	Creare un'applicazione web dove selezionando una centralina [e.x. di Prato], e scegliendo un intervallo di tempo, di ottenere il grafico/media dei valori in quel periodo.

------------
## Passaggi per il Deploy
* ##### Registrarsi su [Heroku](https://heroku.com/ "Heroku") 
* ##### Scaricare [Heroku CLI](https://cli-assets.heroku.com/heroku-x64.exe "Heroku CLI")
* ##### Eseguire il login su Heroku CLI (in cmd) con " _heroku login_ "
* \*Dentro la cartella **Heroku** eseguire nel cmd:
  * Creare un git nuovo [ **git init** ]
  * Creare una nuova applicazione [ **heroku create \<nome applicazione> --region=eu** ]
*	### Backend:
	( I file necessari per heroku sono _Procfile_  e _runtime.txt_ )
	* Configurare il file **.env** con l\'aiuto del template di **.env-example**
	* Copiare dalla cartella **Backend** [ _il file_ **.env** _e la cartella_ **backend** ] in **Heroku**
    ------------
* ### Frontend
	* in **./Frontend/src/environments/** creare **environment.dev.ts** con il seguente codice:
		* ```
			export const environment = {
				apiUrl: '<*nome dell\'applicazione di heroku>',
				user: '<[jwt_user] del file .env>',
				passw: '<[jwt_password] del file .env>',
			}; 
	* Eseguire il comando "_ng build --prod --build-optimizer_"
	* Copiare dentro la cartella **Heroku/frontend**  website/**  tutti i file della build creata  ( **Frontend/dist/Frontend/** )
---

* Eseguire: "_git add -\-all_" e "_git commit -m 'Commit iniziale'_ "
* Eseguire il push sul branch master del git con "_git push heroku master_"

------------
[editor]:https://markdown-editor.github.io/
