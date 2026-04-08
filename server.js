const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg"); // PostgreSQL साठी

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432
});

pool.connect(err => {
  if (err) throw err;
  console.log("Connected to Render PostgreSQL Database!");
});

// Home page route (must be after app initialization)
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to Student Management</h1>
    <form action="/login" method="POST">
      <input type="text" name="app_id" placeholder="App ID" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <button type="submit">Login</button>
    </form>
  `);
});

// Login route
app.post("/login", (req, res) => {
  const { app_id, password } = req.body;

  const sql = "SELECT * FROM students WHERE app_id=$1 AND password=$2";

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

app.listen(3000, () => {
  console.log("Server running on port 3000");
});