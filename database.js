// Importera sqlite3-modulen och skapa en ny anslutning till databasen 'courses.db'
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./courses.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
// Skapar en ny anslutning till en SQLite-databas med filnamnet "courses.db". 
// Argumenten specificerar filvägen till databasfilen, öppningstillstånd och en callback-funktion för att hantera eventuella fel.

    // Hantera eventuella fel vid anslutningen
    if (err) {
        console.error('Error when connecting to the db', err);
    } else {
        console.log('Connected to the courses database.'); // Logga anslutningens framgång
    }
});

// Serilisera databasanrop för att säkerställa korrekt ordning
db.serialize(() => {
    // Skapa en ny tabell 'courses' om den inte redan existerar
    db.run(`CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    courseCode TEXT NOT NULL,
    courseName TEXT NOT NULL,
    syllabus TEXT NOT NULL,
    progression CHAR(1) NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

    // Kontrollera om det finns några rader i tabellen 'courses'
    db.get("SELECT COUNT(*) AS count FROM courses", (err, row) => {
        // Hantera eventuella fel vid räkning av rader
        if (err) {
            console.error('Error checking rows', err);
            return;
        }
        // Om det inte finns några rader, lägg till initiala kursdata i tabellen
        if (row.count === 0) {
            const courses = [
                { courseName: 'Webbutveckling I', courseCode: 'DT057G', syllabus: 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT057G/', progression: 'A' },
                { courseName: 'Introduktion till programmering i JavaScript', courseCode: 'DT084G', syllabus: 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT084G/', progression: 'A' },
                { courseName: 'Grafisk teknik för webb', courseCode: 'DT200G', syllabus: 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT200G/', progression: 'A' },
                { courseName: 'Webbanvändbarhet', courseCode: 'DT068G', syllabus: 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT068G/', progression: 'B' },
                { courseName: 'Databaser', courseCode: 'DT003G', syllabus: 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT003G/', progression: 'A' },
                { courseName: 'Frontend-baserad webbutveckling', courseCode: 'DT211G', syllabus: 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT211G/', progression: 'B' },
                { courseName: 'Backend-baserad webbutveckling', courseCode: 'DT207G', syllabus: 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT207G/', progression: 'B' },
                { courseName: 'Programmering i TypeScript', courseCode: 'DT208G', syllabus: 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT208G/', progression: 'B' },
                { courseName: 'Projektledning', courseCode: 'IK060G', syllabus: 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/IK060G/', progression: 'A' },
                { courseName: 'Programmering i C#.NET', courseCode: 'DT071G', syllabus: 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT071G/', progression: 'A' },
                { courseName: 'Fullstack-utveckling med ramverk', courseCode: 'DT193G', syllabus: 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT193G/', progression: 'B' },
                { courseName: 'Webbutveckling för WordPress', courseCode: 'DT209G', syllabus: 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT209G/', progression: 'B' },
                { courseName: 'Webbutveckling med .NET', courseCode: 'DT191G', syllabus: 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT191G/', progression: 'B' },
                { courseName: 'Fördjupad frontend-utveckling', courseCode: 'DT210G', syllabus: 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT210G/', progression: 'B' },
                { courseName: 'Självständigt arbete', courseCode: 'DT140G', syllabus: 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT140G/', progression: 'B' }
            ];

            // Loopa genom kursdataobjekten och lägg till dem i tabellen
            courses.forEach(course => {
                db.run(`INSERT INTO courses (courseCode, courseName, syllabus, progression) VALUES (?, ?, ?, ?)`, [course.courseCode, course.courseName, course.syllabus, course.progression], (err) => {
                    // Hantera eventuella fel vid infogning av kurser i tabellen
                    if (err) {
                        console.error('Error inserting course', err);
                    } else {
                        console.log(`Course ${course.courseCode} inserted successfully.`); // Logga infogade kurser
                    }
                });
            });
        } else {
            console.log('Courses table already contains data, skipping initial insertion.'); // Logga om tabellen redan innehåller data
        }
    });
});

// Exportera databasobjektet för användning i andra moduler
module.exports = db;
