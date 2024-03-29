const express = require('express'); // import express
const app = express(); // create express app
const bodyParser = require("body-parser");
const port = 3000;
app.set("view engine", "ejs"); // set the view engine to ejs
app.use(express.static("public")); // set the public folder as static
app.use(express.urlencoded({ extended: true }));

let courseList = [
    { courseCode: "DT173G", courseName: "Webbutveckling I", syllabus: "https://www.miun.se/utbildning/kurser/Sok-kursplan/kursplan/?kursplanid=20992", progression: "A" },
    { courseCode: "DT057G", courseName: "Webbutveckling II", syllabus: "https://www.miun.se/utbildning/kurser/Sok-kursplan/kursplan/?kursplanid=20993", progression: "B" },
    { courseCode: "DT084G", courseName: "Webbutveckling III", syllabus: "https://www.miun.se/utbildning/kurser/Sok-kursplan/kursplan/?kursplanid=20994", progression: "C" }
];



//route
app.get("/", (req, res) => {
    res.render("index");
});
app.get("/courses", (req, res) => {
    let successMessage = "";
    if (req.query.success === '1') {
        successMessage="Course successfully added!";
    }
    res.render("courses", { courseList, successMessage });
});


app.get("/about", (req, res) => {
    res.render("about");
});




app.get("/courses/add", (req, res) => {
    res.render("addcourse", { message: [], newCourseCode: "", newCourseName: "", newSyllabus: "", newProgression: "" });
});

app.post("/courses/add", (req, res) => {
    let newCourseCode = req.body.courseCode;
    let newCourseName = req.body.courseName;
    let newSyllabus = req.body.syllabus;
    let newProgression = req.body.progression;

    let message = [];

    // Validate
    if (newCourseCode.length < 3 || newCourseName.length < 3 || newSyllabus.length < 3) {
        message.push("All field contents (except Progression) must be at least 3 characters long");
    }
    if (newProgression.length !== 1) {
        message.push("Progression must be exactly 1 character long");
    }

    if (message.length === 0) {
        courseList.push({ courseCode: newCourseCode, courseName: newCourseName, syllabus: newSyllabus, progression: newProgression });
        res.redirect("/courses?success=1");
        return;
    }
    

    // Render the addcourse page with the error messages and the previously entered values
    res.render("addcourse", { message, newCourseCode, newCourseName, newSyllabus, newProgression });
});


// Start the Express server
app.listen(port, () => { console.log(`Server running on port ${port}`); });   