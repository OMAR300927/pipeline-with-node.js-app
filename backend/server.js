const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


db.connect(err => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;
  db.query(
    "INSERT INTO tasks (title) VALUES (?)",
    [title],
    () => res.sendStatus(201)
  );
});

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));
