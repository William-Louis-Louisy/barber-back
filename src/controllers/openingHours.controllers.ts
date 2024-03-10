import { Response, Request } from "express";
import OpeningHoursSchema from "../models/openingHours.models";
import { IOpeningHours } from "../interfaces/schemas.interfaces";
import { generateTimeSlots } from "../services/timeslots.services";

// OPENING HOURS CONTROLLER
export const openingHoursController = {
  // CREATE OPENING HOURS
  createOpeningHours: async function (req: Request, res: Response) {
    const { dayOfWeek, open, close }: IOpeningHours = req.body;

    try {
      if (dayOfWeek === null || !open || !close) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const openingHours = await OpeningHoursSchema.create({
        dayOfWeek,
        open,
        close,
      });
      res.status(201).json({ openingHours: openingHours._id });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  // RETTRIEVE OPENING HOURS
  retrieveOpeningHours: async function (req: Request, res: Response) {
    const { id } = req.params;
    try {
      const openingHours = await OpeningHoursSchema.findById(id);
      if (!openingHours) {
        return res.status(400).json({ error: "Opening hours not found" });
      }
      res.status(200).json(openingHours);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  // RETRIEVE ALL OPENING HOURS
  retrieveAllOpeningHours: async function (req: Request, res: Response) {
    try {
      const openingHours = await OpeningHoursSchema.find();
      if (!openingHours || openingHours.length === 0) {
        return res.status(400).json({ error: "No opening hours found" });
      }
      res.status(200).json(openingHours);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  // UPDATE OPENING HOURS
  updateOpeningHours: async function (req: Request, res: Response) {
    const { dayOfWeek } = req.params;
    const { open, close }: IOpeningHours = req.body;

    try {
      const updatedOpeningHours = await OpeningHoursSchema.findOneAndUpdate(
        { dayOfWeek: dayOfWeek },
        { open: open, close: close },
        { new: true }
      );

      if (!updatedOpeningHours) {
        return res.status(400).json({ error: "Opening hours not found" });
      }

      res.status(200).json(updatedOpeningHours);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
};
