import mongoose, { Error } from "mongoose";
import { Response, Request } from "express";
import ScheduleSchema from "../models/schedule.models";
import AppointmentSchema from "../models/appointment.models";
import { ITimeSlot } from "../interfaces/schemas.interfaces";
import TimeSlotSchema from "../models/timeslot.models";
import BusinessSchema from "../models/business.models";
import {
  sendAppointmentConfirmationToBusiness,
  sendAppointmentConfirmationToUser,
} from "../services/mails.services";

const TimeSlot = mongoose.model("TimeSlot", TimeSlotSchema);

// APPOINTMENT CONTROLLER
export const appointmentController = {
  // CREATE APPOINTMENT
  createAppointment: async function (req: Request, res: Response) {
    const { date, user, service, timeSlots, scheduleId, lang } = req.body;
    try {
      if (!date || !user || !service || !timeSlots || !scheduleId || !lang) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const schedule = await ScheduleSchema.findById(scheduleId);
      if (!schedule) {
        return res.status(404).json({ error: "Schedule does not exist" });
      }

      // Vérification et réservation atomique des créneaux
      let allSlotsAvailable = true;
      for (let ts of timeSlots) {
        const isAvailable = schedule.timeSlots.some(
          (t) => t._id.toString() === ts._id && t.available
        );
        if (!isAvailable) {
          allSlotsAvailable = false;
          break;
        }
      }

      if (!allSlotsAvailable) {
        return res
          .status(409)
          .json({ error: "One or more time slots are not available" });
      }

      // Marquez les créneaux comme réservés
      timeSlots.forEach((ts: ITimeSlot) => {
        const index = schedule.timeSlots.findIndex(
          (t) => t._id.toString() === ts._id
        );
        if (index !== -1) {
          schedule.timeSlots[index].available = false;
        }
      });

      const appointment = await AppointmentSchema.create({
        date,
        user,
        service,
        timeSlots,
        scheduleId,
      });

      await schedule.save();

      // Get business information
      const business = await BusinessSchema.findOne();

      // Send confirmation email to user
      sendAppointmentConfirmationToUser(
        user,
        appointment,
        business,
        service,
        lang
      );
      // Send confirmation email to business
      sendAppointmentConfirmationToBusiness(
        user,
        appointment,
        business,
        service
      );

      return res.status(201).json({ appointment });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // RETRIEVE APPOINTMENTS BY USER
  getAppointmentsByUser: async function (req: Request, res: Response) {
    const { userId } = req.params;
    try {
      if (!userId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const appointments = await AppointmentSchema.find({ user: userId })
        .populate("service")
        .select("_id date service");

      if (!appointments) {
        return res.status(404).json({ error: "No appointments found" });
      }

      const now = new Date() as any;
      const upcomingAppointments = appointments.filter((a) => a.date >= now);
      const pastAppointments = appointments.filter((a) => a.date < now);

      return res.status(200).json({ upcomingAppointments, pastAppointments });
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  },

  // RETRIEVE APPOINTMENTS SORTED BY DATE FROM TODAY
  getAppointmentsByDate: async function (req: Request, res: Response) {
    try {
      const today = new Date() as any;
      // Reset the time to 00:00:00
      today.setHours(0, 0, 0, 0);

      const appointments = await AppointmentSchema.find({
        date: { $gte: today },
      })
        .populate("service user", "-password")
        .select("_id date service scheduleId timeSlots")
        .sort("date");

      if (!appointments) {
        return res.status(404).json({ error: "No appointments found" });
      }

      return res.status(200).json(appointments);
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  },

  // DELETE APPOINTMENT
  deleteAppointment: async function (req: Request, res: Response) {
    const { id } = req.params;

    try {
      if (!id) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Find the appointment document
      const appointment = await AppointmentSchema.findById(id);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      // Find the schedule document
      const schedule = await ScheduleSchema.findById(appointment.scheduleId);
      if (!schedule) {
        return res.status(404).json({ error: "Schedule not found" });
      }

      // Mark the time slots as available
      schedule.timeSlots.forEach((timeSlot) => {
        if (appointment.timeSlots.includes(timeSlot._id.toString())) {
          timeSlot.available = true;
        }
      });

      // Save the schedule
      await schedule.save();

      // Delete the appointment
      await AppointmentSchema.deleteOne({ _id: id });

      return res.status(200).json({
        message: "Appointment deleted and time slots updated",
        code: 200,
      });
    } catch (err) {
      return res.status(400).json({ error: err, code: 400 });
    }
  },
};
