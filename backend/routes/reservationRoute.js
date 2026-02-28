const express = require("express");
const {sendReservation} = require('../controller/reservation.js')

const reservationRouter = express.Router();


reservationRouter.post("/send",sendReservation);

module.exports = { reservationRouter };