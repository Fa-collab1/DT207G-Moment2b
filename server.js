// Importera nödvändiga moduler och konfigurera inställningar
const express = require('express'); // Importera Express.js
const app = express(); // Skapa en Express-app
const db = require('./database'); // Importera anslutning till databasen
app.set("view engine", "ejs"); // Ange EJS som vy-motorn
app.use(express.static("public")); // Ange mapp för statiska filer
app.use(express.urlencoded({ extended: true })); // Middleware för att tolka URL
const methodOverride = require('method-override'); // Importera method-override för att använda PUT och DELETE
app.use(methodOverride('_method')); // Middleware för att använda PUT och DELETE

// Dynamisk import av node-fetch
let fetch;
import('node-fetch').then(({ default: fetchImport }) => {
  fetch = fetchImport;
  
}).catch(err => console.error('Failed to load node-fetch', err));



const port = process.env.PORT || 3000;


// Route för att hämta arbetslivserfarenhet från databasen
app.get("/workexperience", (req, res) => {
    // Hämta arbetslivserfarenhet mha Fetch API-anrop
    fetch('https://jn2307-api-server-8db335f8b5ca.herokuapp.com/get')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching work experience');
            }
            return response.json();
        })
        .then(data => {
            const message = "Work experience successfully fetched!";
            res.render("workexperience", { workExperienceList: data, message });
        })
        .catch(error => {
            // Hantera fel här
            const message = "Error fetching work experience!";
            console.error(error);
            res.render("workexperience", { workExperienceList: [], message });
        });
});




// Route för att redigera en befintlig erfarenhetspost
app.get('/workexperience/edit/:id', (req, res) => {
    const { id } = req.params; // Extrahera erfarenhets-ID från URL:en

    // Hämta arbetslivserfarenhet mha Fetch API GET-begäran
    fetch(`https://jn2307-api-server-8db335f8b5ca.herokuapp.com/get/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching work experience');
            }
            return response.json();
        })
        .then(data => {
            const message = "Work experience successfully fetched!";
            res.render("editworkexperience", { workExperience: data, message });
        })
        .catch(error => {
            const message = "Error fetching work experience!";
            console.error(error);
            res.render("workexperience", { workExperienceList: [], message });
        });
});

// Route för att ta bort en befintlig erfarenhetspost
app.delete('/workexperience/delete/:id', (req, res) => {
    const { id } = req.params; // Extrahera erfarenhets-ID från URL:en

    // Ta bort arbetslivserfarenhet mha Fetch API DELETE-begäran
    fetch(`https://jn2307-api-server-8db335f8b5ca.herokuapp.com/delete/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error deleting work experience');
        }
        return response.json();
    })
    .then(data => {
        // Efter framgångsrik radering, omdirigera till en annan sida
        res.redirect('/workexperience');
    })
    .catch(error => {
        console.error(error);
        // implementera sedan en logik för att hantera fel här
        res.redirect('/error-page-or-retry');
    });
});

app.post('/workexperience/save', (req, res) => {
    const { companyname, jobtitle, location, startdate, enddate, description } = req.body;

    fetch('https://jn2307-api-server-8db335f8b5ca.herokuapp.com/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            companyname, 
            jobtitle, 
            location, 
            startdate,
            enddate: enddate ? enddate : null, // Om enddate finns, använd det, annars använd null
            description: description ? description : null,
        })
    }) 
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message);
        res.redirect('/workexperience');
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
        res.status(500).send("An error occurred while saving the work experience.");
    });
});


app.get('/workexperience/add', (req, res) => {
    // Rendera en vy med ett formulär för att lägga till ny arbetslivserfarenhet
    res.render('addworkexperience', { message: [] })  
    });


app.put('/workexperience/put/:id', (req, res) => {
    const { id } = req.params; // Extrahera erfarenhets-ID från URL:en
    const data = {
        companyname: req.body.companyname,
        jobtitle: req.body.jobtitle,
        location: req.body.location,
        startdate: req.body.startdate,
        enddate: req.body.enddate ? req.body.enddate : null,
        description: req.body.description ? req.body.description : null,
    };

    // Ändra en arbetslivserfarenhet mha Fetch API PUT-begäran
    fetch(`https://jn2307-api-server-8db335f8b5ca.herokuapp.com/put/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data) // Skicka datan som en JSON-sträng
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error updating work experience');
        }
        return response.json();
    })
    .then(data => {
        // Efter framgångsrik uppdatering, omdirigera till en annan sida
        res.redirect('/workexperience');
    })
    .catch(error => {
        console.error(error);
        // Implementera sedan en logik för att hantera fel här
        res.redirect('/error-page-or-retry');
    });
});









//här under är det gammal kod för kursdatabasen





// Route för att hämta kurser från databasen
app.get("/courses", (req, res) => {
    
    let rows = []; // Array för att lagra data från databasen
    let successMessage; // Meddelande om lyckad eller misslyckad åtgärd

    // Switch-sats för att hantera olika typer av framgångsmeddelanden 
    switch (req.query.success) {
        case '0':
            successMessage = "Database failure!"; // Meddelande om databasfel
            res.render("courses", { courseList: rows, successMessage });
            return;
        case '1':
            successMessage = "Course successfully added!"; 
            break;
        case '2':
            successMessage = "Course successfully updated!";
            break;
        case '-2':
            successMessage = "Course chosen for editing not found!";
            break;
        case '3':
            successMessage = "Course successfully deleted!"; 
            break;
        case '-3':
            successMessage = "Course chosen for deletion not found!"; 
            break;
        default:
            successMessage = ""; 
            break;
    }

    // Hämta alla kurser från databasen
    db.all("SELECT * FROM courses", [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.redirect("/courses?success=0"); // Omdirigera till sidan för kurser med felmeddelande
            return;
        }
        res.render("courses", { courseList: rows, successMessage }); // Rendera sidan med kurslista och ev. meddelande
    });
});

// Route för "About" sidan
app.get("/about", (req, res) => {
    res.render("about"); // Rendera "About" sidan
});

// Route för "start" sidan som omdirigerar till "courses" sidan
app.get("/", (req, res) => {
    res.redirect("courses"); // Rendera "Courses" sidan
});



// Route för att rendera sidan för att lägga till ny kurs
app.get("/courses/add", (req, res) => {
    res.render("addcourse", { message: [], newCourseCode: "", newCourseName: "", newSyllabus: "", newProgression: "", success: req.query.success });
    // Rendera sidan för att lägga till kurs med tomma fält och eventuella meddelanden
});

// Route för att hantera tillägg av ny kurs
app.post("/courses/add", (req, res) => {
    const { courseCode, courseName, syllabus, progression } = req.body; // Extrahera data från begäran

    // Valideringslogik för inmatningsfälten
    let message = dataValidation(courseCode, courseName, syllabus, progression);

    // Kolla om kurskoden redan finns i databasen
    db.get("SELECT COUNT(*) AS count FROM courses WHERE courseCode = ?", [courseCode.toUpperCase()], (err, row) => {
        if (err) {
            console.error('Error checking course code existence', err);
            message.push("Database failure!"); // Lägg till felmeddelande om databasfel
            res.render("addcourse", { message, newCourseCode: courseCode.toUpperCase(), newCourseName: courseName, newSyllabus: syllabus, newProgression: progression.toUpperCase() });
            return;
        }
        if (row.count > 0) {
            // Om kurskoden redan finns, rendera sidan för att lägga till kurs med ett felmeddelande
            message = ["This course code already exists in the database!"]; // Uppdatera meddelandearrayen med felmeddelande
            res.render("addcourse", { message, newCourseCode: courseCode.toUpperCase(), newCourseName: courseName, newSyllabus: syllabus, newProgression: progression.toUpperCase() });
        } else {
            // Om kurskoden inte finns, fortsätt med att lägga till den nya kursen i databasen
            if (message.length === 0) {
                const sql = `INSERT INTO courses (courseCode, courseName, syllabus, progression) VALUES (?, ?, ?, ?)`;
                const params = [courseCode.toUpperCase(), courseName, syllabus, progression.toUpperCase()];
                db.run(sql, params, function (err) {
                    if (err) {
                        console.error(err.message);
                        message.push("Database failure!"); // Lägg till felmeddelande om databasfel
                        res.render("addcourse", { message, newCourseCode: courseCode, newCourseName: courseName, newSyllabus: syllabus, newProgression: progression });
                        return;
                    }
                    res.redirect("/courses?success=1"); // Omdirigera till sidan för kurser med framgångsmeddelande
                });
            } else {
                // Om valideringen misslyckas, rendera sidan för att lägga till kurs med felmeddelanden
                res.render("addcourse", { message, newCourseCode: courseCode, newCourseName: courseName, newSyllabus: syllabus, newProgression: progression });
            }
        }
    });
});


// Route för att redigera en befintlig kurs
app.get('/courses/edit/:id', (req, res) => {
    const { id } = req.params; // Extrahera kurs-ID från URL:en

    // Hämta kursinformation från databasen baserat på ID:et
    db.get("SELECT * FROM courses WHERE id = ?", [id], (err, course) => {
        if (err) {
            console.error('Error fetching course from database', err);
            res.redirect('/courses?success=0'); // Omdirigera till sidan för kurser med felmeddelande
            return;
        }

        if (course) {
            // Om kursen finns, rendera sidan för att redigera kurs med kursinformation och eventuellt framgångsmeddelande
            res.render('editcourse', { course, success: req.query.success });
        } else {
            // Om kursen inte hittas, omdirigera till sidan för kurser med felmeddelande
            res.redirect('/courses?success=-2');
        }
    });
});

// Route för att ta bort en kurs
app.post('/courses/delete/:id', (req, res) => {
    const { id } = req.params; // Extrahera kurs-ID från URL:en

    // Ta bort kursen från databasen baserat på ID:et
    db.run("DELETE FROM courses WHERE id = ?", [id], function (err) {
        if (err) {
            console.error('Error deleting course from database', err);
            res.redirect('/courses?success=-3'); // Omdirigera till sidan för kurser med felmeddelande
            return;
        }

        // Om borttagningen lyckas, omdirigera till sidan för kurser med framgångsmeddelande
        res.redirect('/courses?success=3');
    });
});

// Route för att uppdatera en befintlig kurs
app.post('/courses/update/:id', (req, res) => {
    const { id } = req.params; // Extrahera kurs-ID från URL:en
    const { courseCode, courseName, syllabus, progression, created } = req.body; // Extrahera data från begäran

    // Valideringslogik för inmatningsfälten
    let message = dataValidation(courseCode, courseName, syllabus, progression);

    if (message.length > 0) {
        // Om valideringen misslyckas, rendera sidan för att redigera kurs med felmeddelanden
        res.render("editcourse", { message, course: { id, courseCode, courseName, syllabus, progression, created }, success: req.query.success });
    } else {
        // Om valideringen lyckas, uppdatera kursen i databasen
        db.run(`UPDATE courses SET courseCode = ?, courseName = ?, syllabus = ?, progression = ?, created = ? WHERE id = ?`,
            [courseCode.toUpperCase(), courseName, syllabus, progression.toUpperCase(), created, id],
            function (err) {
                if (err) {
                    console.error('Error updating course in database', err);
                    res.redirect(`/courses/edit/${id}?success=0`); // Omdirigera till sidan för redigering med felmeddelande
                    return;
                }
                console.log(`Course with ID ${id} updated successfully.`);
                res.redirect('/courses?success=2'); // Omdirigera till sidan för kurser med framgångsmeddelande
            });
    }
});

// Route för att hämta och visa listan över mina kurser från databasen
app.get("/mycourses", (req, res) => {
    // Array för att lagra data från databasen
    let rows = [];

    // Hämta alla kurser från databasen och sortera dem efter avslutningsdatum
    db.all("SELECT * FROM mycourses ORDER BY completionDate", [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.redirect("/mycourses?success=0"); // Omdirigera till sidan för kurser med ett felmeddelande
            return;
        }
        res.render("mycourses", { courseList: rows }); // Rendera sidan med kurslistan
    });
});


// Starta servern och lyssna på angiven port
app.listen(port, () => { console.log(`Server running on port ${port}`); });

// Funktion för att validera inmatningsfälten för en ny kurs
function dataValidation(courseCode, courseName, syllabus, progression) {
    let message = [];
    if (courseName.length < 0) {
        message.push("Course name must be at least 3 characters long");
    }
    if (progression.length !== 1) {
        message.push("Progression must be exactly 1 character long");
    }
    if (courseCode.length !== 6) {
        message.push("Course Code must be exactly 6 characters long");
    }

    return message;
}




