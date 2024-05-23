const mysql = require("mysql");

//Anslutningsinställningar
const connection = mysql.createConnection ({
    host:"localhost",
    user: "dt207g",
    password: "",
    database: "dt207g"  
});

connection.connect((error) => {
    if(error) {
        console.error("Connection failed" + error);
        return;
    }

    console.log("Connected through mySql");
});

/******************************************************/

connection.query(`DROP TABLE IF EXISTS courses`);

//SQL-frågor (UNIQUE används för att göra kurskoden unik. Förhindrar att samma kurskod läggs in flera gånger.)
connection.query(`CREATE TABLE courses (
courseID INT AUTO_INCREMENT PRIMARY KEY,  
courseCode VARCHAR(255) UNIQUE, 
courseName VARCHAR(255),
courseProgression VARCHAR(255),
courseSyllabus VARCHAR(255))`, (error, results) => {
        
    if(error) throw error;

    console.log("Table courses created: " + results);
})
//INSERT IGNORE används för att ignorera error ifall dubbletter av kurskod läggs in. MySQL kommer ignorera insättningen av dubletten.

const courses = [           //Array som lagrar kurserna
    [1, "DT057G", "Webbutveckling", "A", "https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT057G/"],
    [2, "DT084G", "Introduktion till programmering i JavaScriptWebbutveckling", "A", "https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT084G/"],
    [3, "DT200G", "Grafisk teknik för webb", "A", "https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT200G/"],
    [4, "DT068G", "Webbanvändbarhet", "B", "https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT068G/"],
    [5, "DT003G", "Databaser", "A", "https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT003G/"],
    [6, "DT211G", "Frontend-baserad webbutveckling", "B", "https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT211G/"]
];

//Loopar igenom array och skriver ut samtliga objekt enligt table Courses struktur
courses.forEach(course => {     
    connection.query("INSERT IGNORE INTO courses(courseID, courseCode, courseName, courseProgression, courseSyllabus) VALUES(?, ?, ?, ?, ?)", course, (error, results) => {
        if (error) {
            if (error.code === "ER_DUP_ENTRY") {
                console.error("Kurskod finns redan i databasen.");
            } else {
                throw error;
            }
        } else {
            console.log("Course inserted: " + JSON.stringify(results));
        }
    });
});    

