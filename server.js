// server.js
const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg"); // PostgreSQL module

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// PostgreSQL connection (Render DB)
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

pool.connect(err => {
  if (err) throw err;
  console.log("Connected to Render PostgreSQL Database!");
});

// Login route
app.post("/login", (req, res) => {
  const { app_id, password } = req.body;

  const sql = "SELECT * FROM students WHERE app_id=$1 AND password=$2"; // PostgreSQL uses $1, $2
  pool.query(sql, [app_id, password], (err, result) => {
    if (err) throw err;

    if (result.rows.length > 0) {
      const student = result.rows[0];

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});