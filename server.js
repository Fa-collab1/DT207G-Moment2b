const express = require('express'); // import express
const app = express(); // create express app
const bodyParser = require("body-parser");
const port = 3000;
app.set("view engine", "ejs"); // set the view engine to ejs
app.use(express.static("public")); // set the public folder as static
app.use(express.urlencoded({ extended: true }));

let ponyList = [
    {name: "Rainbow Dash", email: "rain@pony.se", courseCode: "DT173G", courseName: "Webbutveckling I", syllabus: "https://www.miun.se/utbildning/kurser/Sok-kursplan/kursplan/?kursplanid=20992", progression: "A"},
    {name: "Pinkie Pie", email: "pinkie@pony.se", courseCode: "DT057G", courseName: "Webbutveckling II", syllabus: "https://www.miun.se/utbildning/kurser/Sok-kursplan/kursplan/?kursplanid=20993", progression: "B"},
    {name: "Twilight Sparkle", email: "lovemetender@pony.se", courseCode: "DT084G", courseName: "Webbutveckling III", syllabus: "https://www.miun.se/utbildning/kurser/Sok-kursplan/kursplan/?kursplanid=20994", progression: "C"}
];



//route
app.get("/kent", (req, res) => {
    res.send("Hello my little world");
    });


app.get("/", (req, res) => {
    res.render("index", {name: "Kent"});
    }   );
    app.get("/ponies", (req, res) => {
    
        res.render("ponies", { ponyList }); // Or simply { ponyList } in ES6
    });
    
    
        app.get("/about", (req, res) => {
            res.render("about");
            });
        
    

    app.get("/ola", (req, res) => {
        res.send("<h1>Hello my little Ola<h1>");
        });


// Corrected GET route for adding a pony
app.get("/ponies/add", (req, res) => {
    res.render("addpony", { message: "", newName: "", newEmail: "", newCourseCode: "", newCourseName: "", newSyllabus: "", newProgression: ""});
});

app.post("/ponies/add", (req, res) => {
    let newName = req.body.name;
    let newEmail = req.body.email;
    let newCourseCode = req.body.courseCode;
    let newCourseName = req.body.courseName;
    let newSyllabus = req.body.syllabus;
    let newProgression = req.body.progression;

    let message = "";

    // Validate
    if (newName.length < 3 || newEmail.length < 3) {
        message = "Name and email must be at least 3 characters long";
    } else {
        ponyList.push({ name: newName, email: newEmail, courseCode: newCourseCode, courseName: newCourseName, syllabus: newSyllabus, progression: newProgression});
        message = "Pony successfully added!"; // Set success message on successful addition
        //newName = ""; // Clear the input fields
        //newEmail = "";  // Clear the input fields
        res.redirect("/ponies"); // Redirect to the ponies page
    }

    // Render the addpony page with either an error or a success message
    res.render("addpony", { message, newName, newEmail, newCourseCode, newCourseName, newSyllabus, newProgression });});


    // Start the Express server
app.listen(port, () => {console.log(`Server running on port ${port}`);});   