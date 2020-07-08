/**
 * In dieser Demo wird ein Node.js-Programm genutzt, um eine SQLite-Datenbank (als Datei) zu Erstellen, in der "Hello World"-Phrasen gespeichert
 * werden können. Das Erstellen, Strukturieren und Befüllen der Datenbank erfolgt im Programmcode. Für den Zugriff auf die Datenbank wird eine
 * externe Bibliothek [https://www.npmjs.com/package/sqlite3] verwendet, die über den Paketmanager NPM in das Projektverzeichnis installiert wird.
 *
 * Im Programm wird zuerst die Datenbank erstellt. Anschließend wird eine Tabelle zur Speicherung der Phrasen hinzugefügt. In diese Tabelle werden 
 * verschiedene "Hello World"-Varianten gespeichert und anschließend ausgelesen.
 */

// Import der SQLite-Bibliothek (die vorher mittels npm install sqlite3 herunter geladen wurde)
// Damit die import-Syntax, die Sie bereits aus dem Browser kennen, hier funktioniert, muss die Quellcode-Datei mit der Endung "mjs" gespeichert
// werden oder (wie hier) in der package.json-Datei das Attribut "type" auf den Wert "module" gesetzt werden.
import sqlite3 from "sqlite3";

// Sammlung vorbereiteter SQL-Queries für den programmatischen Zugriff auf die Datenbank
// 1) Erstellen einer neuen Tabelle in der Datenbank
const CREATE_DB_QUERY = "CREATE TABLE IF NOT EXISTS phrase (phraseID INTEGER NOT NULL UNIQUE, phrase TEXT, PRIMARY KEY(phraseID AUTOINCREMENT))",
    // 2) Hinzufügen eines neuen Eintrags in die Tabelle (der Platzhalter wird vorher entfernt!)
    ADD_PHRASE_QUERY = "INSERT INTO phrase (phrase) VALUES (\"$PLACEHOLDER\")",
    // 3) Auslesen aller gespeicherte Inhalte aus der Tabelle
    GET_ALL_PHRASE_QUERY = "SELECT * FROM phrase";

// Variable zum Speichern des Objekts, das die SQLite-Datenbank repräsentiert
var db;

function createDatabase() {
    // Erstellen der Datenbank in der Datei db.sqlite
    db = new sqlite3.Database("db.sqlite");
    // Ausführen des SQL-Statements zum Erzeugen des Schemas bzw. der Datenbankstruktur
    // Etwaige Fehler oder Ergebnisse werden von der SQLite-Bibliothek asynchron an eine Callback-Methode (hier: onResult) weitergeben
    db.exec(CREATE_DB_QUERY, onResult);
}

function addPhraseToDatabase(phrase) {
    // Erzeugen eines Statements zum Hinzufügen eines neuen DB-Eintrags. Die eigentliche Phrase wird als Parameter übergeben und
    // statt den Platzhalte im gespeicherten Statement eingetragen.
    let query = ADD_PHRASE_QUERY.replace("$PLACEHOLDER", phrase);
    // Ausführen des SQL-Statements zum Hinzufügen eines Eintrags
    db.exec(query, onResult);
}

function printAllPhrasesInDatabase() {
    // Ausführen des SQL-Statements zum Auslesen aller Phrasen
    // Etwaige Fehler oder Ergebnisse werden von der SQLite-Bibliothek asynchron an eine Callback-Methode (hier: onResult) weitergeben
    db.all(GET_ALL_PHRASE_QUERY, onResult);
}

// Callback, der am Ende jeder Datenbank-Operation aufgerufen wird. Über die beiden Parameter teilt die SQLite-Bibliothek mit, ob beim
// Ausführen der Statements Fehler aufgetreten sind (error) bzw. welche Inhalte im Result Set (rows) zu finden sind. Die SQLite-Bibliothek gibt 
// die Ergebnisse in Form eines JavaScript-Arrays zurück. Jede Zeile wird durch ein einzelnes Objekt in diesem Array repräsentiert.
function onResult(error, rows) {
    // Liegt ein Fehler vor (error !== null) wird dieser ausgegeben
    if (error !== null) {
        console.log(error);
    }
    // Liegt ein Result Set vor (rows !== undefined) wird dieses ausgegeben
    if (rows !== undefined) {
        console.log(rows);
    }
}

// Hier beginnt die eigentliche Ausführung des Programms, dabei werden die vorbereiteten Methoden aufgerufen
createDatabase();
addPhraseToDatabase("Hello World!");
addPhraseToDatabase("Hello Node.js!");
addPhraseToDatabase("Hello WebTech!");
addPhraseToDatabase("Hello Regensburg!");
printAllPhrasesInDatabase();