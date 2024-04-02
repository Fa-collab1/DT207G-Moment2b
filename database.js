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

    db.run(`CREATE TABLE IF NOT EXISTS mycourses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    courseName TEXT NOT NULL,
    courseCode TEXT NOT NULL,
    points REAL NOT NULL,
    grade TEXT NOT NULL,
    completionDate TEXT NOT NULL,
    remaining REAL,
    university TEXT NOT NULL,
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

    // Kontrollera om det finns några rader i tabellen 'mycourses'
    db.get("SELECT COUNT(*) AS count FROM mycourses", (err, row) => {
        // Hantera eventuella fel vid räkning av rader
        if (err) {
            console.error('Error checking rows', err);
            return;
        }
        // Om det inte finns några rader, lägg till initiala kursdata i tabellen
        if (row.count === 0) {
            const mycourses = [
            { courseName: 'Biomedicinsk översiktskurs', courseCode: 'B1BIOÖ', points: 7.5, grade: 'G', completionDate: '1997-10-16', remaining: '', university: 'Karolinska institutet' },
            { courseName: 'Grundkurs i engelska', courseCode: 'EN1010', points: 30, grade: 'G', completionDate: '1998-06-26', remaining: '', university: 'Stockholms universitet' },
            { courseName: 'Fortsättningskurs i engelska', courseCode: 'EN2010', points: 30, grade: 'G', completionDate: '1999-01-12', remaining: '', university: 'Stockholms universitet' },
            { courseName: 'Datorkörkort', courseCode: 'TGTU00', points: 1.5, grade: 'G', completionDate: '1999-09-16', remaining: '', university: 'Linköpings universitet' },
            { courseName: 'Nationalekonomi', courseCode: 'TEIE79', points: 4.5, grade: '4', completionDate: '1999-10-18', remaining: '', university: 'Linköpings universitet' },
            { courseName: 'Matematisk grundkurs', courseCode: 'TATM79', points: 6, grade: '4', completionDate: '1999-11-15', remaining: '', university: 'Linköpings universitet' },
            { courseName: 'Analys A', courseCode: 'TATM72', points: 10.5, grade: '4', completionDate: '2000-03-14', remaining: '', university: 'Linköpings universitet' },
            { courseName: 'Algebra III', courseCode: 'TATM13', points: 7, grade: '5', completionDate: '2000-03-18', remaining: '', university: 'Linköpings universitet' },
            { courseName: 'Engelska', courseCode: 'THEN03', points: 3, grade: '5', completionDate: '2000-05-06', remaining: '', university: 'Linköpings universitet' },
            { courseName: 'Kommunikation I', courseCode: 'TGTU07', points: 3, grade: 'G', completionDate: '2000-05-30', remaining: '', university: 'Linköpings universitet' },
            { courseName: 'Ekonomisk grundkurs', courseCode: 'TEIE13', points: 10, grade: '4', completionDate: '2000-05-31', remaining: '', university: 'Linköpings universitet' },
            { courseName: 'Analys B, flera variabler', courseCode: 'TATM73', points: 9, grade: '3', completionDate: '2000-06-08', remaining: '', university: 'Linköpings universitet' },
            { courseName: 'Fysik', courseCode: 'TFFY24', points: 7, grade: '4', completionDate: '2000-06-09', remaining: '', university: 'Linköpings universitet' },
            { courseName: 'Optimeringslära, grundkurs', courseCode: 'TAOP02', points: 5, grade: '4', completionDate: '2000-10-25', remaining: '', university: 'Linköpings universitet' },
            { courseName: 'Matematisk statistik, grundkurs', courseCode: 'TAMS15', points: 6, grade: '5', completionDate: '2000-12-11', remaining: '', university: 'Linköpings universitet' },
            { courseName: 'Industriell organisation, grundkurs', courseCode: 'TEIO60', points: 6, grade: 'G', completionDate: '2001-01-19', remaining: '', university: 'Linköpings universitet' },
            { courseName: 'Ekonomisk analys: ekonomisk teori', courseCode: 'TPPE27', points: 6, grade: '3', completionDate: '2001-03-17', remaining: '', university: 'Linköpings universitet' },
            { courseName: 'Mekanik I', courseCode: 'TMME18', points: 12, grade: '3', completionDate: '2001-04-17', remaining: '', university: 'Linköpings universitet' },
            { courseName: 'Ekonomisk analys: Besluts- och finansiell metodik', courseCode: 'TPPE24', points: 6, grade: '3', completionDate: '2001-05-31', remaining: '', university: 'Linköpings universitet' },
            { courseName: 'Diskret matematik', courseCode: 'TADI01', points: 4.5, grade: '5', completionDate: '2001-06-07', remaining: '', university: 'Linköpings universitet' },
            { courseName: 'Programmering I, grundkurs', courseCode: 'TDDB22', points: 7.5, grade: '4', completionDate: '2001-08-09', remaining: '', university: 'Linköpings universitet' },
            { courseName: 'Matematisk statistik, fortsättningskurs', courseCode: 'TAMS65', points: 6, grade: '3', completionDate: '2001-08-14', remaining: '', university: 'Linköpings universitet' },
            { courseName: 'Tillämpad datalogi', courseCode: '2D1320', points: 6, grade: '5', completionDate: '2001-12-04', remaining: '', university: 'Kungl. Tekniska högskolan' },
            { courseName: 'Ekologi och miljöskyddsteknik', courseCode: '3C1305', points: 6, grade: '4', completionDate: '2001-12-17', remaining: '', university: 'Kungl. Tekniska högskolan' },
            { courseName: 'Datorkommunikation och datornät', courseCode: '2G1317', points: 7.5, grade: '4', completionDate: '2002-04-15', remaining: '', university: 'Kungl. Tekniska högskolan' },
            { courseName: 'Programutvecklingsteknik', courseCode: '2D1385', points: 6, grade: '4', completionDate: '2002-06-07', remaining: '', university: 'Kungl. Tekniska högskolan' },
            { courseName: 'Ingenjörsarbete, teknik, humaniora', courseCode: '4D1111', points: 7.5, grade: 'G', completionDate: '2002-06-11', remaining: '', university: 'Kungl. Tekniska högskolan' },
            { courseName: 'Numeriska metoder, grundkurs I', courseCode: '2D1210', points: 6, grade: '3', completionDate: '2002-06-28', remaining: '', university: 'Kungl. Tekniska högskolan' },
            { courseName: 'Digital elektronik', courseCode: '2B1540', points: 9, grade: '3', completionDate: '2002-10-24', remaining: '', university: 'Kungl. Tekniska högskolan' },
            { courseName: 'Spanska, grundnivå', courseCode: '9E1341', points: 6, grade: '3', completionDate: '2002-12-14', remaining: '', university: 'Kungl. Tekniska högskolan' },
            { courseName: 'Finansiering', courseCode: '4D1166', points: 6, grade: '3', completionDate: '2002-12-19', remaining: '', university: 'Kungl. Tekniska högskolan' },
            { courseName: 'Datorteknik, allmän kurs', courseCode: '2G1502', points: 6, grade: '4', completionDate: '2003-05-27', remaining: '', university: 'Kungl. Tekniska högskolan' },
            { courseName: 'Ekonomi och ledarskap i teknikintensiv verksamhet', courseCode: '4D1144', points: 6, grade: '5', completionDate: '2004-01-20', remaining: '', university: 'Kungl. Tekniska högskolan' },
            { courseName: 'Kunskapsbildning II', courseCode: '4D1117', points: 6, grade: '5', completionDate: '2004-02-26', remaining: '', university: 'Kungl. Tekniska högskolan' },
            { courseName: 'Internetworking', courseCode: '2G1305', points: 6, grade: '3', completionDate: '2005-01-11', remaining: '', university: 'Kungl. Tekniska högskolan' },
            { courseName: 'Kunskapsbildning I', courseCode: '4D1114', points: 6, grade: 'G', completionDate: '2005-07-18', remaining: '', university: 'Kungl. Tekniska högskolan' },
            { courseName: 'Köteori och teletrafiksystem', courseCode: '2E1618', points: 6, grade: '3', completionDate: '2007-06-08', remaining: '', university: 'Kungl. Tekniska högskolan' },
            { courseName: 'Webbaserad grundkurs i finansiell matematik', courseCode: 'SF271V', points: 7.5, grade: 'P', completionDate: '2008-01-22', remaining: '', university: 'Kungl. Tekniska högskolan' },
            { courseName: 'Kommunikationssystem - ekonomi - ledarskap', courseCode: 'IK2201', points: 18, grade: 'D', completionDate: '2008-06-18', remaining: '', university: 'Kungl. Tekniska högskolan' },
            { courseName: 'Norska, grundkurs', courseCode: '1SV126', points: 7.5, grade: 'VG', completionDate: '2021-08-15', remaining: '', university: 'Linnéuniversitetet' },
            { courseName: 'AI för naturligt språk', courseCode: 'ETE335', points: 3, grade: 'G', completionDate: '2021-10-15', remaining: '', university: 'Linköpings universitet' },
            { courseName: 'Jiddisch: Språk och litteratur, nybörjarkurs I', courseCode: 'YIDD01', points: 15, grade: 'VG', completionDate: '2021-12-15', remaining: '', university: 'Lunds universitet' },
            { courseName: 'Databaser, en introduktion', courseCode: 'L0003B', points: 7.5, grade: 'G#', completionDate: '2022-04-10', remaining: '', university: 'Luleå tekniska universitet' },
            { courseName: 'Nederländska, nätbaserad kurs i läsfärdighet', courseCode: 'NL1012', points: 7.5, grade: 'C', completionDate: '2022-04-26', remaining: '', university: 'Stockholms universitet' },
            { courseName: 'Jiddisch: Språk och litteratur, nybörjarkurs II', courseCode: 'YIDD02', points: 15, grade: 'VG', completionDate: '2022-05-24', remaining: '', university: 'Lunds universitet' },
            { courseName: 'Ryska idag', courseCode: 'RY1003', points: 7.5, grade: 'VG', completionDate: '2022-08-11', remaining: '', university: 'Göteborgs universitet' },
            { courseName: 'Isländska, grundkurs', courseCode: '1SV119', points: 7.5, grade: 'VG', completionDate: '2022-08-12', remaining: '', university: 'Linnéuniversitetet' },
            { courseName: 'Danska, grundkurs', courseCode: '1SV112', points: 7.5, grade: 'VG', completionDate: '2022-12-11', remaining: '', university: 'Linnéuniversitetet' },
            { courseName: 'Jiddisch: Språk och litteratur, grundkurs I', courseCode: 'YIDD11', points: 15, grade: 'VG', completionDate: '2022-12-14', remaining: '', university: 'Lunds universitet' },
            { courseName: 'Tyska, nybörjarkurs I', courseCode: 'TYA001', points: 15, grade: 'B', completionDate: '2022-12-17', remaining: '', university: 'Stockholms universitet' },
            { courseName: 'Introduktion till ukrainska', courseCode: 'SL1150', points: 7.5, grade: 'VG', completionDate: '2022-12-21', remaining: '', university: 'Göteborgs universitet' },
            { courseName: 'Vikingarnas språk', courseCode: '1SV109', points: 7.5, grade: 'VG', completionDate: '2023-04-30', remaining: '', university: 'Linnéuniversitetet' },
            { courseName: 'Jiddisch: Språk och litteratur, grundkurs II', courseCode: 'YIDD12', points: 15, grade: 'VG', completionDate: '2023-05-31', remaining: '', university: 'Lunds universitet' },
            { courseName: 'Hebreiska A', courseCode: '5HE111', points: 30, grade: 'VG', completionDate: '2023-08-28', remaining: '', university: 'Uppsala universitet' },
            { courseName: 'Introduktion till apputveckling med Flutter', courseCode: '1DV535', points: 7.5, grade: 'B', completionDate: '2023-09-01', remaining: '', university: 'Linnéuniversitetet' },
            { courseName: 'Datateknik GR (A), Introduktion till programmering i JavaScript', courseCode: 'DT084G', points: 7.5, grade: 'A', completionDate: '2023-11-23', remaining: '', university: 'Mittuniversitetet' },
            { courseName: 'Datateknik GR (A), Webbutveckling I', courseCode: 'DT057G', points: 7.5, grade: 'A', completionDate: '2024-01-06', remaining: '', university: 'Mittuniversitetet' },
            { courseName: 'Grunderna i AI', courseCode: 'ETE318', points: 2, grade: 'G', completionDate: '2024-02-12', remaining: '', university: 'Linköpings universitet' },
            { courseName: 'Tysk litteratur och litteraturhistoria', courseCode: 'TY1121', points: 7.5, grade: 'G', completionDate: '2024-03-15', remaining: '', university: 'Göteborgs universitet' },
            { courseName: 'Datateknik GR (A), Grafisk teknik för webb', courseCode: 'DT200G', points: 7.5, grade: '-', completionDate: 'Late', remaining: 5, university: 'Mittuniversitetet' },
            { courseName: 'Datateknik GR (B), Webbanvändbarhet', courseCode: 'DT068G', points: 7.5, grade: '-', completionDate: 'Late', remaining: 4, university: 'Mittuniversitetet' },
            { courseName: 'Datateknik GR (A), Databaser', courseCode: 'DT003G', points: 7.5, grade: '-', completionDate: 'Late', remaining: 3, university: 'Mittuniversitetet' },
            { courseName: 'Datateknik GR (B), Frontend-baserad webbutveckling', courseCode: 'DT211G', points: 7.5, grade: '-', completionDate: 'Late', remaining: 2.5, university: 'Mittuniversitetet' },
            { courseName: 'Tyska, Kulturstudier: Tyskspråkig kultur efter 1945', courseCode: 'TY1116', points: 7.5, grade: '-', completionDate: 'Ongoing', remaining: 7.5, university: 'Göteborgs universitet' },
            { courseName: 'Datateknik GR (B), Backend-baserad webbutveckling', courseCode: 'DT207G', points: 7.5, grade: '-', completionDate: 'Ongoing', remaining: 7.5, university: 'Mittuniversitetet' },
            { courseName: 'Datateknik GR (B), Programmering i TypeScript', courseCode: 'DT208G', points: 7.5, grade: '-', completionDate: 'Ongoing', remaining: 7.5, university: 'Mittuniversitetet' },
            { courseName: 'Hebreiska B', courseCode: '5HE250', points: 30, grade: '-', completionDate: 'Ongoing', remaining: 15, university: 'Uppsala universitet' }
        ];

           // Loopa genom kursdataobjekten och lägg till dem i tabellen
           mycourses.forEach(course => {
            db.run(`INSERT INTO mycourses (courseName, courseCode, points, grade, completionDate, remaining, university) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
            [course.courseName, course.courseCode, course.points, course.grade, course.completionDate, course.remaining, course.university], 
            (err) => { // Flytta felhanteringskoden hit
                // Hantera eventuella fel vid infogning av kurser i tabellen
                if (err) {
                    console.error('Error inserting course', err);
                } else {
                    console.log(`Course ${course.courseCode} inserted successfully.`); // Logga infogade kurser
                }
            });
        });
    } else {
        console.log('MyCourses table already contains data, skipping initial insertion.'); // Logga om tabellen redan innehåller data
    }
});
});


// Exportera databasobjektet för användning i andra moduler
module.exports = db;
