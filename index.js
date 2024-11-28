import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import morgan from "morgan";
import {
  validateQueryParam,
  validateSchoolData,
} from "./validateData.utits.js";

const app = express();

dotenv.config();
app.use(morgan("tiny"));
const PORT = process.env.PORT || 3000;
var pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATBASE,
  port: process.env.DB_PORT,
  connectionLimit: 10,
  idleTimeout: 60000, //60 seconds
});

app.use(express.json()); //for json response
app.use(express.urlencoded({ extended: true })); //for URL-encoded values

app.post("/addSchool", (req, res) => {
  const body = req.body;
  const { success, data, error } = validateSchoolData(body);
  if (!success) {
    return res.status(400).json({ message: "Invalid Data", err: error.stack });
  }
  const query = `INSERT INTO school(name,address,latitude,longitude) VALUES(?,?,?,?)`;
  pool.query(
    query,
    [data.name, data.address, data.latitude, data.longitude],
    (err) => {
      if (err) {
        console.error("DATBASE ERROR:", err);
        return res.status(400).json({
          message: "Error occured durign qureying the data",
          err: err.stack,
        });
      }
      return res
        .status(201)
        .json({ message: "Data inserted successfully", data });
    }
  );
});

app.get("/listSchools", (req, res) => {
  const { data, error, success } = validateQueryParam({
    latitude: req.query?.latitude,
    longitude: req.query?.longitude,
  });
  if (!success) {
    return res
      .status(400)
      .json({ message: "Invalid Params", err: error.stack });
  }

  const query = `
    SELECT name,address,latitude,longitude, 
        (6371 * acos( cos( radians(?) ) * cos( radians(latitude) ) * 
        cos( radians(?) - radians(longitude) ) + 
        sin( radians(?) ) * sin( radians(latitude)))) AS distance
    FROM school 
    ORDER BY distance`;

  pool.query(query, [data.latitude, data.longitude, data.latitude], (err,result) => {
    if (err) {
      console.error("DATBASE ERROR:", err);
      return res.status(400).json({
        message: "Error occured durign qureying the data",
        err: err.stack,
      });
    }
    return res.status(200).json({ message: "School data", data: result });
  });
});

// Cutstom Error Handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res
    .status(err.statusCode || 500)
    .json({ message: "Internal server Error", error: err.stack });
});

app.listen(PORT, () => console.log("server running:http://localhost:" + PORT));

//Graceful shutdown
process.on("SIGINT", () => {
  console.log("Closing connections...");
  pool.end(() => {
    console.log("Database pool closed");
    process.exit(0);
  });
});
