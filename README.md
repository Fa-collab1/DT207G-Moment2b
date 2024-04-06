Ny del: [Work Experience Management App]


ska innehålla en README-fil med beskrivning av lösningen samt eventuellt webblänk(ar) till publicerade laborationer för testkörning.
Det ska finnas en README-fil som ger en beskrivning av din webbapplikation.













Tidigare del: [Course Management App]


# Course Management App

En webbapplikation för hantering av kurser med SQLite-databasintegration.

## Beskrivning

Denna webbapplikation bygger på Express.js och SQLite för att hantera kurser. Användare kan lägga till, redigera och ta bort kurser via gränssnittet. Kursinformation lagras i en SQLite-databas och visas på olika sidor beroende på användarinteraktion.

## Installation

1. Besök den publicerade sidan [länk till Heroku-app](https://joni2307-be-m1-aba40a1f039a.herokuapp.com/courses) för att använda applikationen.
2. Om du vill köra applikationen lokalt, klona projektet till din lokala maskin och installera alla beroenden genom att köra `npm install`. För att köra applikationen lokalt behöver du ändra till en lokal port eftersom portparametern sätts av Heroku i koden som den ser ut just nu.
3. Starta applikationen genom att köra `npm start` och besök `http://localhost:<LOKAL_PORT>` i din webbläsare.

## Funktioner

- **Hantering av Kurser**: Lägg till, redigera och ta bort kurser från databasen.
- **Validering**: Validering av inmatningsfält för att säkerställa korrekta datainmatningar.
- **SQLite-databas**: Användning av en SQLite-databas för att lagra kursinformation.

## Routes

- **GET /courses**: Hämtar och visar en lista över alla kurser.
- **GET /about**: Visar information om applikationen.
- **GET /courses/add**: Renderar sidan för att lägga till en ny kurs.
- **POST /courses/add**: Hanterar tillägg av en ny kurs till databasen.
- **GET /courses/edit/:id**: Renderar sidan för att redigera en befintlig kurs baserat på ID.
- **POST /courses/update/:id**: Uppdaterar en befintlig kurs i databasen baserat på ID.
- **POST /courses/delete/:id**: Tar bort en kurs från databasen baserat på ID.
- **GET /** skickar vidare till **/courses**: hade en indexsida först, men jag tog bort den, minst krångel att lösa det på detta sätt.

## Licens

Detta projekt är licensierat under MIT-licensen. Se [LICENSE](https://opensource.org/licenses/MIT) för mer information.
