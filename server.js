const express = require("express")                  //Importerar express
const bodyParser = require("body-parser");          //Möjliggör för att läsa in formulärdata
const mysql = require("mysql");                     //Import mySQL för anslutning
const app = express();                              //Startar applikationen
const port = 3000;                                  //Använder port 3000

app.set("view engine", "ejs");                      //EJS används som view-engine
app.use(express.static("public"));                  //Statiska filer i katalog public
app.use(bodyParser.urlencoded({extended:true}));    //Nu kan vi läsa in alla typer av formulärdata

//Anslutningsinställningar för MySQL
const connection = mysql.createConnection({
    host: "localhost",
    user: "dt207g",
    password: "",
    database: "dt207g"
});

//Kontroll om anslutning ej fungerar
connection.connect((error) => {
    if (error) {
        console.error("Connection failed" + error);
        return;
    }

    console.log("Connected through mySql");
});


 
//Route för att Hämta kurser från databas
app.get("/", async(req,res) => {
    connection.query("SELECT * FROM courses", (error, result) => {
        if (error) throw error;                                            //Kontrollsats
        console.log("Results from database:", result);
        
        // Definiera errors-variabeln
        let errors = [];

        if (result && result.length > 0) {
            res.render("index.ejs", { data: result, errors: errors }); // Skicka med errors även när det inte finns några fel för att undvika "errors undefined"
        } else {
            errors.push("Inga kurser finns tillgängliga.");            //Lägger till felmeddelande om inga kurser hittas
            res.render("index.ejs", { data: [], errors: errors });      //Renderar sidan utan kursdata men med felmeddelande
        }
    });
});

//Hämtar in formulärdata från användare
app.post("/", async(req, res) => {      //Läser in formulärdata, req ger vilket anrop som är gjort till URL:en

    let errors = [];

    const newCourseCode = req.body.code;                //Hämtar kurskod från formulär
    const newCourseName = req.body.name;                //Hämtar kursnamn från formulär
    const newCourseSyllabus = req.body.syllabus;        //Hämta kursplan från formulär
    const newCourseProgression = req.body.progression;  //Hämtar progression från formulär

  // Validering för varje inmatningsfält
  if (!newCourseCode) {
    errors.push("Kurskod måste anges.");
}
if (!newCourseName) {
    errors.push("Kursnamn måste anges.");
}
if (!newCourseSyllabus) {
    errors.push("Kursurl måste anges.");
}
if (!newCourseProgression) {
    errors.push("Kursprogression måste anges.");
}

// Om det finns några valideringsfel, skicka tillbaka dem till klienten
if (errors.length > 0) {
    // Hämta befintliga kurser från databasen
    connection.query("SELECT * FROM courses", (error, result) => {
        if (error) throw error;
        console.log("Results from database:", result);

        // Rendera sidan med befintliga kurser och valideringsfel
        res.render("index.ejs", { data: result, errors: errors });
    });
    return;
}

    // Om ingen valideringsfel uppstår, utför SQL-fråga för att lägga till den nya kursen
    connection.query(
        "INSERT INTO courses (courseCode, courseName, courseSyllabus, courseProgression) VALUES (?, ?, ?, ?)",
        [newCourseCode, newCourseName, newCourseSyllabus, newCourseProgression],
        (error, result) => {
            if (error) {
                if (error.code === "ER_DUP_ENTRY") {
                    errors.push("Kurskoden finns redan i databasen.");          //Felmeddelande om kurs finns
                    res.render("index.ejs", { errors: errors });
                } else {
                    console.error("Error adding course:", error);               //Felmeddelande för övriga fel
                    res.render("index.ejs", { errors: errors });
                }
            } else {
                console.log("Course added successfully:", result);
                res.redirect("/"); // Omdirigera till startsidan efter att kursen har lagts till
            }
        }
    );
});

//Ta bort kurs
app.post("/remove-course", (req, res) => {
    const courseCodeToRemove = req.body.courseCodeToRemove;                 //Hämtar kurskod att ta bort från formuläret
    let errors = []; 
    const remove = "DELETE FROM courses WHERE courseCode = ?";
    
    connection.query(remove, [courseCodeToRemove], (error, result) => {
        if (error) {
            console.error("Error removing course: ", error);
            errors.push("Fel uppstod vid borttagning av kurs.");
            
            // Rendera sidan med befintliga kurser och felmeddelanden
            connection.query("SELECT * FROM courses", (selectError, selectResult) => {
                if (selectError) throw selectError;
                res.render("index.ejs", { data: selectResult, errors: errors });
            });
            return;
        }
        
        if (result.affectedRows === 0) {                                    //0 = ingen rad matchade kurskod som ska raderas
            console.error("Kurskod finns ej");
            errors.push("Kurskod finns ej");
        } else {
            console.log("Course removed successfully");
        }

        // Hämta befintliga kurser från databasen
        connection.query("SELECT * FROM courses", (selectError, selectResult) => {
            if (selectError) throw selectError;
            res.render("index.ejs", { data: selectResult, errors: errors });        //Renderar sidan med uppdaterat errors-objekt
        });
    });
});

//Startar applikationen
app.listen(port, () => {
    console.log("Server started on port " + port);
});