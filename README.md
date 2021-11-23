#  <img src="https://i.imgur.com/ODvK2av.png" align="left" height="10%" width="10%" style='position:absolute;top:0;left:0'> AreaGraph



Progetto di scuola lavoro

## Obiettivo:
*	Creare un'applicazione web dove selezionando una centralina [e.x. di Prato], e scegliendo un intervallo di tempo, di ottenere il grafico/media dei valori in quel periodo.

------------
## Passaggi per il Deploy
* ##### Registrarsi su [Heroku](https://heroku.com/ "Heroku") 
* ##### Scaricare [Heroku CLI](https://cli-assets.heroku.com/heroku-x64.exe "Heroku CLI")
* ##### Eseguire il login su Heroku CLI (in cmd) con " _heroku login_ "
*	### Backend:
	( I file necessari per heroku sono _Procfile_  e _runtime.txt_ )
	* Configurare il file **.env** con l\'aiuto del template di **.env-example**
	* **Opzionale**: _spostare/copiare la cartella backend fuori dal progetto_
	* Creare un nuovo git dentro la directory [ git init ]
		* Eseguire: "_git add -\-all_" e "_git commit -m '.'_"
		* Creare l\'app di Heroku "_heroku create \<nome app>_"
		* Eseguire il push sul branch master del git con "_git push heroku master_"
    ------------
* ### Frontend
	* in **./Frontend/src/environments/** creare **environment.dev.ts** con il seguente codice:
		* ```
			export const environment = {
				apiUrl: '<sito del backend su heroku>',
				user: '<[jwt_user] del file .env del backend>',
				passw: '<[jwt_password] del file .env del backend>',
			}; 
	* Eseguire il comando "_ng build --prod --build-optimizer_"
	* Dentro la cartella **./Frontend/deployment/website/** copiare tutti i file da **./Frontend/dist/Frontend/**
	* **Opzionale**: _spostare/copiare la cartella deployment fuori dal progetto_ 
	* Creare un nuovo git dentro la directory [ _git init_ ]
		* Eseguire: "_git add -\-all_" e "_git commit -m '.'_"
		* Creare l\'app di Heroku "_heroku create \<nome app>_"
		* Eseguire il push sul branch master del git con "_git push heroku master_"
------------
[editor]:https://markdown-editor.github.io/
