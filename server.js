const express = require('express');
const app = express();
const db = require('./database');

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
const port = 3000;

// Home route
app.get("/", (req, res) => {
    res.render("index");
});

// Fetch courses from database
app.get("/courses", (req, res) => {
    let rows=[];
    let successMessage;

switch (req.query.success) {
    case '1':
        successMessage = "Course successfully added!";
        break;
    case '0':
        successMessage = "Database failure!";
        res.render("courses", { courseList: rows, successMessage });
        return;
    default:
        successMessage = ""; // Default case if `success` is not 1 or 0
        break;
}

    
    db.all("SELECT * FROM courses", [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.redirect("/courses?success=0");
            return;
        }
        res.render("courses", { courseList: rows, successMessage });
    });
});

// About page
app.get("/about", (req, res) => {
    res.render("about");
});

// Render the page to add a new course
app.get("/courses/add", (req, res) => {
    res.render("addcourse", { message: [], newCourseCode: "", newCourseName: "", newSyllabus: "", newProgression: "" });
});

// Handle new course submission
app.post("/courses/add", (req, res) => {
    const { courseCode, courseName, syllabus, progression } = req.body;
    let message = [];

    // Validation logic
    if (courseCode.length < 3 || courseName.length < 3 || syllabus.length < 3) {
        message.push("All field contents (except Progression) must be at least 3 characters long");
    }
    if (progression.length !== 1) {
        message.push("Progression must be exactly 1 character long");
    }

    if (message.length === 0) {
        const sql = `INSERT INTO courses (courseCode, courseName, syllabus, progression) VALUES (?, ?, ?, ?)`;
        const params = [courseCode, courseName, syllabus, progression];
        db.run(sql, params, function(err) {
            if (err) {
                console.error(err.message);
                res.render("addcourse", { message: ["Failed to add the course."], newCourseCode: courseCode, newCourseName: courseName, newSyllabus: syllabus, newProgression: progression });
                return;
            }
            res.redirect("/courses?success=1");
        });
    } else {
        res.render("addcourse", { message, newCourseCode: courseCode, newCourseName: courseName, newSyllabus: syllabus, newProgression: progression });
    }
});

// Start the server
app.listen(port, () => { console.log(`Server running on port ${port}`); });
