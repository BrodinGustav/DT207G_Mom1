# Kursadministration

Detta projekt är en enkel kursadministrationsapplikation byggd med Node.js, Express och MySQL.
Applikationen tillåter användare att lägga till, visa och ta bort kurser från en MySQL-databas.

## Innehåll
- Kursadministration
  - Innehåll
  - Förutsättningar
  - Installation
  - Användning
  - Databasstruktur
  - Routes
  - Externa bibliotek

## Förutsättningar

För att kunna köra detta projekt behöver du följande:

- Node.js 
- MySQL 

## Installation

1. Klona detta repository till din lokala maskin:


git clone !!!

###Navigera till projektkatalogen:

C:\Utbildning\DT207G\Mom1

###Installera nödvändiga npm-paket:

npm install
Skapa en MySQL-databas och en användare för applikationen:

CREATE DATABASE dt207g;
CREATE USER 'dt207g'@'localhost' IDENTIFIED BY 'ditt-lösenord';
GRANT ALL PRIVILEGES ON dt207g.* TO 'dt207g'@'localhost';
FLUSH PRIVILEGES;

Kör skriptet install.js för att skapa tabellen och lägga till exempeldata:

node install.js

###Användning
Starta servern:

npm start
Öppna din webbläsare och navigera till http://localhost:3000.

Använd webbgränssnittet för att lägga till, visa och ta bort kurser.

Databasstruktur
Databasen dt207g innehåller en tabell courses med följande struktur:

courseID (INT, PRIMARY KEY, AUTO_INCREMENT)
courseCode (VARCHAR(255), UNIQUE)
courseName (VARCHAR(255))
courseProgression (VARCHAR(255))
courseSyllabus (VARCHAR(255))

###Routes

GET /
Hämtar och visar alla kurser i databasen.

POST /
Lägger till en ny kurs i databasen. Kräver följande formdata:

code (kurskod)
name (kursnamn)
syllabus (kursplanens URL)
progression (kursprogression)

POST /remove-course
Tar bort en kurs från databasen baserat på kurskoden. Kräver följande formdata:

courseCodeToRemove (kurskod för kursen som ska tas bort)

##Externa bibliotek
Express - Webbramverk för Node.js
MySQL - MySQL-klient för Node.js
EJS - Inbäddad JavaScript-mallmotor
Body-Parser - Middleware för att parsa inkommande request bodies