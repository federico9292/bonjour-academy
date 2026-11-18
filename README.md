# bonjour-academy

Piattaforma interattiva per imparare il francese, partendo da zero, con un percorso progressivo A0–B2.

## Avvio

Apri `index.html` con un server statico (ad esempio `python -m http.server` dalla cartella del progetto) e visita `http://localhost:8000`. L’app non richiede dipendenze o un processo di build. I progressi e il tema vengono salvati nel browser.

## Struttura

- `curriculum.js` contiene il modello dei livelli, delle unità didattiche e delle lezioni: obiettivo, spiegazione, vocaboli, frasi scomposte e verifica.
- `app.js` gestisce navigazione, esercizi, ripasso e progressi persistenti.
- `index.html` e `styles.css` definiscono l’interfaccia accessibile e responsive, in italiano.

I contenuti audio madrelingua non sono ancora disponibili; non viene usata sintesi vocale come sostituto. Le lezioni e i dati sono organizzati per poter aggiungere contenuti progressivi senza incorporarli nei componenti dell’interfaccia.

Al momento sono svolgibili le lezioni A0 di presentazione e pronuncia; la lezione A1 al bar è accessibile nell’allenamento libero. Gli altri argomenti sono tappe del percorso e verranno sbloccati quando saranno disponibili le relative lezioni.
