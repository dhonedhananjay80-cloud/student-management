const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "dhananjay@188111",
  database: "student_db"
});

db.connect(err => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// Login route
app.post("/login", (req, res) => {
  const { app_id, password } = req.body;

  const sql = "SELECT * FROM students WHERE app_id=? AND password=?";
  
  db.query(sql, [app_id, password], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      const student = result[0];

      res.send(`
        <h2>Welcome ${student.name}</h2>
        <p>Email: ${student.email}</p>
        <p>Course: ${student.course}</p>
        <p>Marks: ${student.marks}</p>
      `);
    } else {
      res.send("Invalid ID or Password");
    }
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});