const express = require('express'); // import express
const app = express(); // create express app
const bodyParser = require("body-parser");
const port = 3000;
app.set("view engine", "ejs"); // set the view engine to ejs
app.use(express.static("public")); // set the public folder as static
app.use(express.urlencoded({ extended: true }));

let courseList = [
    {courseCode: "DT173G", courseName: "Webbutveckling I", syllabus: "https://www.miun.se/utbildning/kurser/Sok-kursplan/kursplan/?kursplanid=20992", progression: "A"},
    {courseCode: "DT057G", courseName: "Webbutveckling II", syllabus: "https://www.miun.se/utbildning/kurser/Sok-kursplan/kursplan/?kursplanid=20993", progression: "B"},
    {courseCode: "DT084G", courseName: "Webbutveckling III", syllabus: "https://www.miun.se/utbildning/kurser/Sok-kursplan/kursplan/?kursplanid=20994", progression: "C"}
];



//route
app.get("/", (req, res) => {
    res.render("index");
    }   );
    app.get("/courses", (req, res) => {
    
        res.render("courses", { courseList });
    });
    
    
        app.get("/about", (req, res) => {
            res.render("about");
            });
        
    


app.get("/courses/add", (req, res) => {
    res.render("addcourse", { message: "", newCourseCode: "", newCourseName: "", newSyllabus: "", newProgression: ""});
});

app.post("/courses/add", (req, res) => {
    let newCourseCode = req.body.courseCode;
    let newCourseName = req.body.courseName;
    let newSyllabus = req.body.syllabus;
    let newProgression = req.body.progression;

    let message = "";

    // Validate
    if (newCourseCode.length < 3 || newCourseName.length < 3 || newSyllabus.length < 3 || newProgression.length < 3) {
        message = "All field content must be at least 3 characters long";
    } else {
        courseList.push({ courseCode: newCourseCode, courseName: newCourseName, syllabus: newSyllabus, progression: newProgression});
        message = "course successfully added!"; // Set success message on successful addition
        res.redirect("/courses"); // Redirect to the courses page
    }

    // Render the addcourse page with either an error or a success message
    res.render("addcourse", { message, newCourseCode, newCourseName, newSyllabus, newProgression });});


    // Start the Express server
app.listen(port, () => {console.log(`Server running on port ${port}`);});   