const express = require("express");
const mysql = require("mysql2/promise"); // استخدام promise لتسهيل الانتظار
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// دالة للانتظار حتى تصبح DB جاهزة
const waitForDB = async () => {
  let retries = 20;
  while (retries) {
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });
      console.log("Connected to MySQL");
      await connection.end();
      break; // الاتصال نجح، الخروج من الحلقة
    } catch (err) {
      console.log("DB not ready, retrying in 3s...");
      retries--;
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  if (retries === 0) {
    console.error("Could not connect to the database. Exiting...");
    process.exit(1);
  }
};

const startServer = async () => {
  await waitForDB(); // الانتظار حتى تصبح DB جاهزة

  const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  app.get("/tasks", async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM tasks");
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

  app.post("/tasks", async (req, res) => {
    const { title } = req.body;
    try {
      await db.query("INSERT INTO tasks (title) VALUES (?)", [title]);
      res.sendStatus(201);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

  app.listen(3001, () => console.log("Backend running on http://localhost:3001"));
};

startServer();
