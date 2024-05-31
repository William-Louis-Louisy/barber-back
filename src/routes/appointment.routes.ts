import { appointmentController } from "../controllers/appointment.controllers";

const express = require("express");
const appointmentRouter = express.Router();

// CREATE APPOINTMENT
appointmentRouter.post(
  "/create-appointment",
  appointmentController.createAppointment
);

// GET APPOINTMENTS BY USER
appointmentRouter.get(
  "/get-appointments-by-user/:userId",
  appointmentController.getAppointmentsByUser
);

// GET APPOINTMENTS BY DATE
appointmentRouter.get(
  "/get-appointments-by-date",
  appointmentController.getAppointmentsByDate
);

// GET ALL APPOINTMENTS
appointmentRouter.get(
  "/get-all-appointments",
  appointmentController.getAllAppointments
);

// DELETE APPOINTMENT
appointmentRouter.delete(
  "/delete-appointment/:id",
  appointmentController.deleteAppointment
);

export default appointmentRouter;
