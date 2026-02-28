const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


dotenv.config({ path: "./config/config.env" });

const { dbConnection } = require("./database/dbConnection");
const { errorMiddleware } = require("./error/error");
const { reservationRouter } = require("./routes/reservationRoute");

const app = express();


dbConnection();


app.use(
  cors({
    origin: process.env.FRONTEND_URL,  // no need for array unless multiple
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/reservation", reservationRouter);


app.use(errorMiddleware);

module.exports = app;