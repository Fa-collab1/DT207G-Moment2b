# Project Description

## Work Experience Management App

Denna webbapplikation är utformad för att hantera arbetslivserfarenheter med hjälp av API-anrop. Den är byggd med Express.js och möjliggör interaktion med en PostGreSQL-databas för att lägga till, redigera och ta bort arbetslivserfarenheter.

### Funktioner Work Experience Management App

- **Hantering av CV-poster**: Användare kan lägga till, redigera och ta bort CV-poster via gränssnittet.
- **Validering**: Inmatningsfälten valideras för att säkerställa korrekta datainmatningar.
- **Databaskoppling via API**: Applikationen använder en PostGRESQL-databas på Heroku som kallas via API-anrop.

### Routes Work Experience Management App

Här är en översikt över de viktigaste ruterna i applikationen:

- **GET /workexperience**: Visar en lista över arbetslivserfarenheter.
- **GET /workexperience/edit/:id**: Visar formuläret för att redigera en specifik arbetslivserfarenhet.
- **DELETE /workexperience/delete/:id**: Tar bort en arbetslivserfarenhet.
- **POST /workexperience/save**: Sparar en ny arbetslivserfarenhet.
- **GET /workexperience/add**: Visar formuläret för att lägga till en ny arbetslivserfarenhet.
- **PUT /workexperience/put/:id**: Uppdaterar en befintlig arbetslivserfarenhet.
- **GET /aboutwe**: Visar information om arbetslivserfarenhetsmodulen.

För att installera alla dessa beroenden kan du köra `npm install`.

## Course Management App

En webbapplikation för hantering av kurser med SQLite-databasintegration.
Denna webbapplikation bygger på Express.js och SQLite för att hantera kurser. Användare kan lägga till, redigera och ta bort kurser via gränssnittet. Kursinformation lagras i en SQLite-databas och visas på olika sidor beroende på användarinteraktion.

### Funktioner Course Management App

- **Hantering av Kurser**: Lägg till, redigera och ta bort kurser från databasen.
- **Validering**: Validering av inmatningsfält för att säkerställa korrekta datainmatningar.
- **SQLite-databas**: Användning av en SQLite-databas för att lagra kursinformation.

### Routes Course Management App

Här är en översikt över de viktigaste ruterna i applikationen:

- **GET /courses**: Hämtar och visar en lista över alla kurser.
- **GET /about**: Visar information om applikationen.
- **GET /courses/add**: Renderar sidan för att lägga till en ny kurs.
- **POST /courses/add**: Hanterar tillägg av en ny kurs till databasen.
- **GET /courses/edit/:id**: Renderar sidan för att redigera en befintlig kurs baserat på ID.
- **POST /courses/update/:id**: Uppdaterar en befintlig kurs i databasen baserat på ID.
- **POST /courses/delete/:id**: Tar bort en kurs från databasen baserat på ID.
- **GET /** skickar vidare till **/courses**: hade en indexsida först, men jag tog bort den, minst krångel att lösa det på detta sätt.

## Gemensamma poster

### Dependencies

Här är en lista över de viktigaste beroendena för projektet:

- **express**: För att skapa och hantera Express.js-appen.
- **ejs**: Används som vy-motor för att generera HTML.
- **method-override**: Tillåter användning av PUT- och DELETE-metoder i formulär.
- **node-fetch**: Används för att göra HTTP-begäranden till det externa API:et.(för Work Experience Management App)
- **typescript**: Används för att skriva JavaScript med typer.
- **@types/node**: Ger typer för Node.js-bibliotek för TypeScript.
- **parcel**: En snabb webbapplikationsbyggare som används för att bygga och paketera projektet.
- **sqlite3**: En SQLite-databasadapter för Node.js.(för Course Management App)

### Installation

För att använda applikationen kan du antingen besöka den publicerade sidan [länk till Heroku-app](https://joni2307-be-m2-66fca900dfdb.herokuapp.com/) eller köra den lokalt på din maskin genom att följa dessa steg:

1. Klona projektet till din lokala maskin.
2. Installera alla beroenden genom att köra `npm install`.
3. Starta applikationen genom att köra `npm start`.
4. Besök `http://localhost:3001` i din webbläsare.

### Licens

Detta projekt är licensierat under MIT-licensen. Se [LICENSE](https://opensource.org/licenses/MIT) för mer information.
