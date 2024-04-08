// Importera nödvändiga moduler och konfigurera inställningar
const express = require("express"); // Importera Express.js
const app = express(); // Skapa en Express-app
const db = require("./database"); // Importera anslutning till databasen
app.set("view engine", "ejs"); // Ange EJS som vy-motorn
app.use(express.static("public")); // Ange mapp för statiska filer
app.use(express.urlencoded({ extended: true })); // Middleware för att tolka URL
const methodOverride = require("method-override"); // Importera method-override för att använda PUT och DELETE
app.use(methodOverride("_method")); // Middleware för att använda PUT och DELETE

const port = process.env.PORT || 3000;

app.get("/workexperience", (req: any, res: any) => {
  let errormessage: string[] = [];
  console.log("Fetching work experience list");
  renderWorkExperienceList(res, errormessage);
});

app.get("/workexperience/edit/:id", (req: any, res: any) => {
    // Extrahera felmeddelande och formulärdata från query-parametrar
  const { id } = req.params; // Extrahera erfarenhets-ID från URL:en
  const { error,companyname, jobtitle, location, startdate, enddate, description } = req.query;
  // Initialisera en array för felmeddelanden
  let errormessage: string[] = newFunction(error);

    console.log("Fetching work experience with ID:", id); // Logga ID:et till konsolen
    // Hämta arbetslivserfarenhet med hjälp av den definierade funktionen ovan
    renderSingleWorkExperience(id, res, errormessage);
});




// Route för att ta bort en befintlig erfarenhetspost
app.delete("/workexperience/delete/:id", (req: any, res: any) => {
  const { id } = req.params; // Extrahera erfarenhets-ID från URL:en

  // Ta bort arbetslivserfarenhet mha Fetch API DELETE-begäran
  fetch(`https://jn2307-api-server-8db335f8b5ca.herokuapp.com/delete/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        // Om svaret inte är OK, kasta ett fel med statuskoden och meddelandet från servern
        return response.json().then((errData) => {
          const errorMsg = `Fel ${response.status}: ${errData.message || "Fel vid radering av arbetslivserfarenhet"}`;
          throw new Error(errorMsg);
        });
      }
      return response.json();
    })
    .then((data) => {
      // Efter lyckad borttagning, omdirigera till en annan sida
      res.redirect("/workexperience");
    })
    .catch((error) => {
      console.error(error);
      // Om det uppstår ett fel, omdirigera till redigeringssidan med felmeddelandet
      const errorMsg = encodeURIComponent(error.message);
      res.redirect(`/workexperience/edit/${id}?error=${errorMsg}`);
    });

});

// Route för att spara en ny erfarenhetspost
app.post("/workexperience/save", (req: any, res: any) => {
  // Extrahera nödvändig data från request body
  const { companyname, jobtitle, location, startdate, enddate, description } = req.body;

  // Använd Fetch API för att göra en POST-begäran till den externa API:n
  fetch("https://jn2307-api-server-8db335f8b5ca.herokuapp.com/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Konvertera data till JSON-format och skicka med i begäran
    body: JSON.stringify({
      companyname,
      jobtitle,
      location,
      startdate,
      enddate: enddate ? enddate : null, // Kontrollera om slutdatum finns och sätt till null om det inte finns
      description: description ? description : null, // Kontrollera om beskrivning finns och sätt till null om det inte finns
    }),
  })
    .then((response) => {
      if (!response.ok) {
        // Om responsen inte är OK, hantera felmeddelanden från API:n
        return response.json().then((errData: any) => {
          // Hämta felmeddelande från API-responsen och formatera det
          const messageFromApi = errData.error ? errData.error.join(', ') : "Okänt fel inträffade";
          // Kasta ett Error-objekt med felmeddelandet
          throw new Error(`Fel ${response.status}: ${messageFromApi}`);
        }).catch((error) => {
          throw error; // Kasta det uppkomna felet vidare
        });
      }
      return response.json(); // Om responsen är OK, konvertera den till JSON-format
    })
    .then((data: any) => {
      // Efter framgångsrikt sparande, omdirigera användaren till erfarenhetslistan
      res.redirect("/workexperience");
    })
    .catch((error) => {
      // Om det uppstår ett fel, omdirigera användaren till lägga till-sidan med felmeddelandet och den inskickade datan
      const errorMsg = encodeURIComponent(error.message); // Kodera felmeddelandet för URL
      const formData = {
        companyname,
        jobtitle,
        location,
        startdate,
        enddate,
        description
      };
      // Skapa en querysträng från den inskickade datan
      const queryString = Object.entries(formData).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
      // Omdirigera till sidan för att lägga till erfarenhet med felmeddelande och den inskickade datan
      res.redirect(`/workexperience/add?error=${errorMsg}&${queryString}`);
    });
});

// Route för att visa sidan för att lägga till ny arbetslivserfarenhet
app.get("/workexperience/add", (req: any, res: any) => {
  // Extrahera felmeddelande och formulärdata från query-parametrar
  const { error, companyname, jobtitle, location, startdate, enddate, description } = req.query;
  
  // Initialisera en array för felmeddelanden
  let errormessage: string[] = newFunction(error);

  // Rendera sidan för att lägga till arbetslivserfarenhet med felmeddelande och formulärdata
  res.render("addworkexperience", { 
    errormessage,
    companyname,
    jobtitle,
    location,
    startdate,
    enddate,
    description
  });
});



// Route för att uppdatera en befintlig arbetslivserfarenhetspost
app.put("/workexperience/put/:id", (req: any, res: any) => {
  const { id } = req.params; // Extrahera erfarenhets-ID från URL:en
    
  const data = {
    companyname: req.body.companyname,
    jobtitle: req.body.jobtitle,
    location: req.body.location,
    startdate: req.body.startdate,
    enddate: req.body.enddate ? req.body.enddate : null,
    description: req.body.description ? req.body.description : null,
  };

  // Uppdatera en arbetslivserfarenhet mha Fetch API PUT-begäran
  fetch(`https://jn2307-api-server-8db335f8b5ca.herokuapp.com/put/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // Skicka datan som en JSON-sträng
  })
  .then((response) => {
    if (!response.ok) {
      // Om responsen inte är OK, hantera felmeddelanden från API:n
      return response.json().then((errData: any) => {
        // Hämta felmeddelande från API-responsen och formatera det
        const messageFromApi = errData.error ? errData.error.join(', ') : "Okänt fel inträffade";
        // Kasta ett Error-objekt med felmeddelandet
        throw new Error(`Fel ${response.status}: ${messageFromApi}`);
      }).catch((error) => {
        throw error; // Kasta det uppkomna felet vidare
      });
    }
    return response.json(); // Om responsen är OK, konvertera den till JSON-format
  })
  .then((data: any) => {
    // Efter framgångsrikt sparande, omdirigera användaren till erfarenhetslistan
    res.redirect("/workexperience");
  })
    .catch((error) => {
      // Om det uppstår ett fel, omdirigera användaren till lägga till-sidan med felmeddelandet och den inskickade datan
      const errorMsg = encodeURIComponent(error.message); // Kodera felmeddelandet för URL
      const formData = {
        id,
        companyname:req.body.companyname,
        jobtitle:req.body.jobtitle,
        location:req.body.location,
        startdate:req.body.startdate,
        enddate:req.body.enddate,
        description:req.body.description
      };
      // Skapa en querysträng från den inskickade datan
      const queryString = Object.entries(formData).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
      // Omdirigera till sidan för att ändra en erfarenhet med felmeddelande och den inskickade datan
      res.redirect(`/workexperience/edit/${id}?error=${errorMsg}&${queryString}`);
    });
});

// Route för "start" sidan som omdirigerar till "workexperience" sidan
app.get("/", (req: any, res: any) => {
  res.redirect("workexperience"); // Rendera "Courses" sidan
});


function newFunction(error: any) {
  let errormessage: string[] = [];

  // Om det finns ett felmeddelande, extrahera och lägg till det i felmeddelande-arrayen
  if (error) {
    // Dekodera felmeddelandet och dela upp det i enskilda felmeddelanden
    const splitErrors = decodeURIComponent(error).split(',').map(error => error.trim());
    // Lägg till de enskilda felmeddelandena i felmeddelande-arrayen
    errormessage.push(...splitErrors);
  }
  return errormessage;
}

function renderSingleWorkExperience(id: any, res: any, errormessage: string[]) {
  const url = `https://jn2307-api-server-8db335f8b5ca.herokuapp.com/get/${id}`;
  console.log("Fetching URL:", url); // Logga URL:en som hämtas för att säkerställa att den är korrekt

  fetch(url)
      .then((response) => {
          if (!response.ok) {
              // Konstruera ett specifikt felmeddelande inklusive statuskoden och statusmeddelandet
              const errorMessage = `Fel: ${response.status} ${response.statusText}`;
              errormessage.push(errorMessage);
              // Kasta för att hantera detta i den yttre catch-blocken
              throw new Error(errorMessage);
          }
          return response.json();
      })
      .then((data) => {
          // Kontrollera om den hämtade datan inte är tom
          if (!data || Object.keys(data).length === 0) {
              errormessage.push("Inga data returnerades från API:et.");
              throw new Error("Inga data returnerades från API:et."); // Kasta för att undvika ytterligare exekvering
          }
          // Rendera redigera arbetslivserfarenhetsidan med den hämtade datan
          res.render("editworkexperience", {
              workExperience: data,
              message: null,
              errormessage,
          });
      })
      .catch((error) => {
          console.error("Fetch-fel:", error);
          // Se till att felmeddelandet inte dupliceras i listan innan rendering
          if (!errormessage.includes(error.message)) {
              errormessage.push(error.message);
          }
          // Anrop för att rendera listan med endast fel en gång här för att hantera alla felscenarier
          res.render("workexperience", {
              workExperienceList: [],
              message: null,
              errormessage,
          });
      });
}
function renderWorkExperienceList(res: any, errormessage: string[]) {
  fetch("https://jn2307-api-server-8db335f8b5ca.herokuapp.com/get")
      .then((response) => {
          if (!response.ok) {
              // Försök att tolka svarsdatan som JSON
              return response.json().then((errData: any) => {
                  // Konstruera ett specifikt felmeddelande inklusive statuskoden och meddelandet från API:et
                  const messageFromApi = errData.message || `Inget detaljerat felmeddelande tillhandahållet.`;
                  const fullErrorMessage = `Fel ${response.status}: ${messageFromApi}`;
                  
                  // Lägg till det konstruerade felmeddelandet i felmeddelande-arrayen
                  errormessage.push(fullErrorMessage);
                  
                  // Rendera sidan för arbetslivserfarenhet med inga data och felmeddelandet
                  res.render("workexperience", {
                      workExperienceList: [],
                      message: null,
                      errormessage,
                  });

                  // Kasta ett nytt fel för att avsluta promise-kedjan
                  throw new Error(fullErrorMessage);
              }).catch(() => {
                  // Detta catch hanterar fall där svaret inte är i JSON-format eller något annat parsingfel
                  const fallbackError = `Fel ${response.status}: Misslyckades med att tolka felmeddelandet`;
                  errormessage.push(fallbackError);
                  res.render("workexperience", {
                      workExperienceList: [],
                      message: null,
                      errormessage,
                  });
              });
          }
          // Om svaret är OK, tolka JSON-datan för att fortsätta med renderingen
          return response.json();
      })
      .then((data) => {
          // Rendera sidan för arbetslivserfarenhet med hämtad data och inga fel
          res.render("workexperience", {
              workExperienceList: data,
              message: null,
              errormessage,
          });
      })
      .catch((error) => {
          // Allmän felhantering för nätverksproblem eller fel kastade i tidigare .then-block
          console.error("Fetch-fel:", error);
          if (!errormessage.some(msg => error.message.includes(msg))) {
              errormessage.push(error.message);
          }
          res.render("workexperience", {
              workExperienceList: [],
              message: null,
              errormessage,
          });
      });
}


// Route för "Om arbetslivserfarenhet" sidan
app.get("/aboutwe", (req: any, res: any) => {
  res.render("aboutwe"); // Rendera "About" sidan
});




//här under är det gammal kod för kursdatabasen

// Route för att hämta kurser från databasen
app.get("/courses", (req: any, res: any) => {
  let rows:any[] = []; // Array för att lagra data från databasen
  let successMessage; // Meddelande om lyckad eller misslyckad åtgärd

  // Switch-sats för att hantera olika typer av framgångsmeddelanden
  switch (req.query.success) {
    case "0":
      successMessage = "Database failure!"; // Meddelande om databasfel
      res.render("courses", { courseList: rows, successMessage });
      return;
    case "1":
      successMessage = "Course successfully added!";
      break;
    case "2":
      successMessage = "Course successfully updated!";
      break;
    case "-2":
      successMessage = "Course chosen for editing not found!";
      break;
    case "3":
      successMessage = "Course successfully deleted!";
      break;
    case "-3":
      successMessage = "Course chosen for deletion not found!";
      break;
    default:
      successMessage = "";
      break;
  }

  // Hämta alla kurser från databasen
  db.all("SELECT * FROM courses", [], (err:any, rows:any) => {
    if (err) {
      console.error(err.message);
      res.redirect("/courses?success=0"); // Omdirigera till sidan för kurser med felmeddelande
      return;
    }
    res.render("courses", { courseList: rows, successMessage }); // Rendera sidan med kurslista och ev. meddelande
  });
});

// Route för "About" sidan
app.get("/about", (req: any, res: any) => {
  res.render("about"); // Rendera "About" sidan
});

// Route för att rendera sidan för att lägga till ny kurs
app.get("/courses/add", (req: any, res: any) => {
  res.render("addcourse", {
    message: [],
    newCourseCode: "",
    newCourseName: "",
    newSyllabus: "",
    newProgression: "",
    success: req.query.success,
  });
  // Rendera sidan för att lägga till kurs med tomma fält och eventuella meddelanden
});

// Route för att hantera tillägg av ny kurs
app.post("/courses/add", (req: any, res: any) => {
  const { courseCode, courseName, syllabus, progression } = req.body; // Extrahera data från begäran

  // Valideringslogik för inmatningsfälten
  let message = dataValidation(courseCode, courseName, syllabus, progression);

  // Kolla om kurskoden redan finns i databasen
  db.get(
    "SELECT COUNT(*) AS count FROM courses WHERE courseCode = ?",
    [courseCode.toUpperCase()],
    (err:any, row:any) => {
      if (err) {
        console.error("Error checking course code existence", err);
        message.push("Database failure!"); // Lägg till felmeddelande om databasfel
        res.render("addcourse", {
          message,
          newCourseCode: courseCode.toUpperCase(),
          newCourseName: courseName,
          newSyllabus: syllabus,
          newProgression: progression.toUpperCase(),
        });
        return;
      }
      if (row.count > 0) {
        // Om kurskoden redan finns, rendera sidan för att lägga till kurs med ett felmeddelande
        message = ["This course code already exists in the database!"]; // Uppdatera meddelandearrayen med felmeddelande
        res.render("addcourse", {
          message,
          newCourseCode: courseCode.toUpperCase(),
          newCourseName: courseName,
          newSyllabus: syllabus,
          newProgression: progression.toUpperCase(),
        });
      } else {
        // Om kurskoden inte finns, fortsätt med att lägga till den nya kursen i databasen
        if (message.length === 0) {
          const sql = `INSERT INTO courses (courseCode, courseName, syllabus, progression) VALUES (?, ?, ?, ?)`;
          const params = [
            courseCode.toUpperCase(),
            courseName,
            syllabus,
            progression.toUpperCase(),
          ];
          db.run(sql, params, function (err:any) {
            if (err) {
              console.error(err.message);
              message.push("Database failure!"); // Lägg till felmeddelande om databasfel
              res.render("addcourse", {
                message,
                newCourseCode: courseCode,
                newCourseName: courseName,
                newSyllabus: syllabus,
                newProgression: progression,
              });
              return;
            }
            res.redirect("/courses?success=1"); // Omdirigera till sidan för kurser med framgångsmeddelande
          });
        } else {
          // Om valideringen misslyckas, rendera sidan för att lägga till kurs med felmeddelanden
          res.render("addcourse", {
            message,
            newCourseCode: courseCode,
            newCourseName: courseName,
            newSyllabus: syllabus,
            newProgression: progression,
          });
        }
      }
    }
  );
});

// Route för att redigera en befintlig kurs
app.get("/courses/edit/:id", (req: any, res: any) => {
  const { id } = req.params; // Extrahera kurs-ID från URL:en

  // Hämta kursinformation från databasen baserat på ID:et
  db.get("SELECT * FROM courses WHERE id = ?", [id], (err:any, course:any) => {
    if (err) {
      console.error("Error fetching course from database", err);
      res.redirect("/courses?success=0"); // Omdirigera till sidan för kurser med felmeddelande
      return;
    }

    if (course) {
      // Om kursen finns, rendera sidan för att redigera kurs med kursinformation och eventuellt framgångsmeddelande
      res.render("editcourse", { course, success: req.query.success });
    } else {
      // Om kursen inte hittas, omdirigera till sidan för kurser med felmeddelande
      res.redirect("/courses?success=-2");
    }
  });
});

// Route för att ta bort en kurs
app.post("/courses/delete/:id", (req: any, res: any) => {
  const { id } = req.params; // Extrahera kurs-ID från URL:en

  // Ta bort kursen från databasen baserat på ID:et
  db.run("DELETE FROM courses WHERE id = ?", [id], function (err:any) {
    if (err) {
      console.error("Error deleting course from database", err);
      res.redirect("/courses?success=-3"); // Omdirigera till sidan för kurser med felmeddelande
      return;
    }

    // Om borttagningen lyckas, omdirigera till sidan för kurser med framgångsmeddelande
    res.redirect("/courses?success=3");
  });
});

// Route för att uppdatera en befintlig kurs
app.post("/courses/update/:id", (req: any, res: any) => {
  const { id } = req.params; // Extrahera kurs-ID från URL:en
  const { courseCode, courseName, syllabus, progression, created } = req.body; // Extrahera data från begäran

  // Valideringslogik för inmatningsfälten
  let message = dataValidation(courseCode, courseName, syllabus, progression);

  if (message.length > 0) {
    // Om valideringen misslyckas, rendera sidan för att redigera kurs med felmeddelanden
    res.render("editcourse", {
      message,
      course: { id, courseCode, courseName, syllabus, progression, created },
      success: req.query.success,
    });
  } else {
    // Om valideringen lyckas, uppdatera kursen i databasen
    db.run(
      `UPDATE courses SET courseCode = ?, courseName = ?, syllabus = ?, progression = ?, created = ? WHERE id = ?`,
      [
        courseCode.toUpperCase(),
        courseName,
        syllabus,
        progression.toUpperCase(),
        created,
        id,
      ],
      function (err:any) {
        if (err) {
          console.error("Error updating course in database", err);
          res.redirect(`/courses/edit/${id}?success=0`); // Omdirigera till sidan för redigering med felmeddelande
          return;
        }
        console.log(`Course with ID ${id} updated successfully.`);
        res.redirect("/courses?success=2"); // Omdirigera till sidan för kurser med framgångsmeddelande
      }
    );
  }
});

// Route för att hämta och visa listan över mina kurser från databasen
app.get("/mycourses", (req: any, res: any) => {
  // Array för att lagra data från databasen
  let rows = [];

  // Hämta alla kurser från databasen och sortera dem efter avslutningsdatum
  db.all("SELECT * FROM mycourses ORDER BY completionDate", [], (err:any, rows:any) => {
    if (err) {
      console.error(err.message);
      res.redirect("/mycourses?success=0"); // Omdirigera till sidan för kurser med ett felmeddelande
      return;
    }
    res.render("mycourses", { courseList: rows }); // Rendera sidan med kurslistan
  });
});

// Starta servern och lyssna på angiven port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Funktion för att validera inmatningsfälten för en ny kurs
function dataValidation(courseCode:string, courseName:string, syllabus:string, progression:string) {
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
