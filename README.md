#  [<img src="https://i.imgur.com/ODvK2av.png" align="left" height="10%" width="10%" style='position:absolute;top:0;left:0'> AreaGraph](https://areagraph.herokuapp.com)

## [WEBSITE](https://areagraph.herokuapp.com)

Progetto di scuola lavoro

## OBIETTIVO:
**Studiare, progettare e sviluppare un'applicazione software per la visualizzazione su web di dati relativi alla qualità dell’aria, ricavati da un database.**


## DESCRIZIONE
Il risultato finale e’ stato semplificato a causa del poco tempo disponibile, ma racchiude tutti i punti dell’obiettivo, ovvero:
* Creare un software per la visualizzazione **web**:
* Selezionare una **centralina** tra quelle disponibili (su una **mappa** integrata)
* Scegliere un **intervallo di tempo** a piacere
* Dati i valori giusti, ottenere i dati dal backend che li richiede al database primario
* Visualizzare in un **grafico** i dati relativi agli **inquinanti dell’aria**  nel periodo scelto
Il semplice design del sito e’ stato creato usando Bootstrap 4 e del CSS puro,
in maniera quasi del tutto responsive e intuitivo.

Per il backend e’ stato utilizzato framework **Flask** di **Python**

E per il frontend e’ stato utilizzato il framework **AngularJS (V13.0.1)**, di **NodeJS**

------------
## PASSAGGI PER IL DEPLOY
* ##### Registrarsi su [Heroku](https://heroku.com/ "Heroku") 
* ##### Scaricare [Heroku CLI](https://cli-assets.heroku.com/heroku-x64.exe "Heroku CLI")
* ##### Eseguire il login su Heroku CLI (in cmd) con " _heroku login_ "
* \*Dentro la cartella **Heroku/** :
  * Creare un git nuovo [ **git init** ]
  * Creare una nuova applicazione [ **heroku create \<nome applicazione> --region=eu** ]
*	### Backend:
	
	* Configurare il file **.env** con l\'aiuto del template di **.env-example**
	* Copiare dalla cartella **Backend/** [ _il file_ **.env** (da creare) _e la cartella_ **backend** ] in **Heroku**
    ------------
* ### Frontend
	* in **Frontend/src/environments/** creare **environment.dev.ts** con il seguente codice:
		* ```
			export const environment = {
				apiUrl: 'https://<nome dell'app di heroku>.herokuapp.com/api/',
				user: '<[jwt_user] del file .env>',
				passw: '<[jwt_password] del file .env>',
			}; 
	* Eseguire il comando "_ng build --prod --build-optimizer_"
	* Copiare dentro la cartella **Heroku/frontend/**  tutti i file della build creata  ( **Frontend/dist/Frontend/** )
	------------

* ##### Eseguire: "_git add -\-all_" e "_git commit -m 'Commit iniziale'_ "
* ##### Eseguire il push sul branch master di heroku [ "_git push heroku master_" ]
------------
[editor]:https://markdown-editor.github.io/
