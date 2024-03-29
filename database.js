const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./courses.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the courses database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    courseCode TEXT NOT NULL,
    courseName TEXT NOT NULL,
    syllabus TEXT NOT NULL,
    progression TEXT NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db;
