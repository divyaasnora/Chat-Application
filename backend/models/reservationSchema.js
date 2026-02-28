const mongoose = require("mongoose");
const validator = require("validator");

const reservationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    minlength: [3, "First name must contain at least 3 characters"],
    maxlength: [30, "First name cannot exceed 30 characters"],
  },

  lastName: {
    type: String,
    required: [true, "Last name is required"],
    minlength: [3, "Last name must contain at least 3 characters"],
    maxlength: [30, "Last name cannot exceed 30 characters"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    validate: [validator.isEmail, "Provide a valid email"],
  },

  phone: {
    type: String,
    required: [true, "Phone number is required"],
    minlength: [11, "Phone number must contain 11 digits"],
    maxlength: [11, "Phone number must contain 11 digits"],
  },

  time: {
    type: String,
    required: [true, "Time is required"],
  },

  date: {
    type: String,
    required: [true, "Date is required"],
  },
});

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = { Reservation };