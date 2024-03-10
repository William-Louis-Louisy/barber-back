import { Response, Request } from "express";
import ScheduleSchema from "../models/schedule.models";
import { ISchedule, ITimeSlot } from "../interfaces/schemas.interfaces";

function padTo2Digits(num: number) {
  return num.toString().padStart(2, "0");
}

function formatDate(date: Date) {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join("-");
}

function formatTime(date: Date) {
  return [padTo2Digits(date.getHours()), padTo2Digits(date.getMinutes())].join(
    ":"
  );
}

// SCHEDULE CONTROLLER
export const scheduleController = {
  // RETRIEVE SCHEDULE
  retrieveSchedule: async function (req: Request, res: Response) {
    const { id } = req.params;
    try {
      const schedule = await ScheduleSchema.findById(id);
      if (!schedule) {
        return res.status(400).json({ error: "Schedule not found" });
      }
      res.status(200).json(schedule);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
  // RETRIEVE ALL SCHEDULES
  retrieveAllSchedules: async function (req: Request, res: Response) {
    try {
      const schedules = await ScheduleSchema.find();
      if (!schedules || schedules.length === 0) {
        return res.status(400).json({ error: "No schedules found" });
      }
      res.status(200).json(schedules);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
  // RETRIEVE SCHEDULES EXCLUDING PASSED DATES
  retrieveSchedules: async function (req: Request, res: Response) {
    try {
      const today = formatDate(new Date());
      const schedules = await ScheduleSchema.find({
        date: { $gte: today },
      });
      if (!schedules || schedules.length === 0) {
        return res.status(400).json({ error: "No schedules found" });
      }
      res.status(200).json(schedules);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  // UPDATE SCHEDULE
  updateSchedule: async function (req: Request, res: Response) {
    const { id } = req.params;
    const { date, timeSlots }: ISchedule = req.body;
    try {
      const schedule = await ScheduleSchema.findById(id);
      if (!schedule) {
        return res.status(400).json({ error: "Schedule not found" });
      }
      schedule.date = date;
      schedule.timeSlots = timeSlots;
      await schedule.save();
      res.status(200).json({ status: 200, message: "Schedule updated" });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  // DELETE SCHEDULE
  deleteSchedule: async function (req: Request, res: Response) {
    const { id } = req.params;
    try {
      const schedule = await ScheduleSchema.findByIdAndDelete(id);
      if (!schedule) {
        return res.status(400).json({ error: "Schedule not found" });
      }
      res.status(200).json({ status: 200, message: "Schedule deleted" });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  // TURN TIME SLOTS INTO UNAVAILABLE OF A SCHEDULE
  turnTimeSlotsUnavailable: async function (req: Request, res: Response) {
    const { id } = req.params;
    try {
      const schedule = await ScheduleSchema.findById(id);
      if (!schedule) {
        return res.status(400).json({ error: "Schedule not found" });
      }
      schedule.timeSlots.forEach((slot: ITimeSlot) => {
        slot.available = false;
      });
      await schedule.save();
      res.status(200).json({ status: 200, message: "Time slots updated" });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  // RETRIEVE SCHEDULES EXCLUDING PASSED DATES AND UNAVAILABLE TIME SLOTS WITH PAGINATION
  retrieveSchedulesWithPagination: async function (
    req: Request,
    res: Response
  ) {
    const { page } = req.params;
    const pageNumber = parseInt(page, 10);

    if (isNaN(pageNumber)) {
      return res.status(400).json({ error: "Invalid page number provided" });
    }

    try {
      const today = new Date();
      const formattedDate = formatDate(today);
      const pageSize = 7;
      // Retrieve schedules for the given page, starting from today.
      const schedules = await ScheduleSchema.find({
        date: { $gte: formattedDate },
      })
        .limit(pageSize)
        .skip(pageSize * (pageNumber - 1));
      // Handle case where no schedules are found.
      if (!schedules || schedules.length === 0) {
        return res.status(400).json({ error: "No schedules found" });
      }

      // Calculate total pages by counting all schedules from today onwards.
      const totalSchedulesCount = await ScheduleSchema.countDocuments({
        date: { $gte: formattedDate },
      });
      const totalPages = Math.ceil(totalSchedulesCount / pageSize);
      // Respond with the found schedules and pagination details.
      res.status(200).json({
        schedules: schedules,
        page: pageNumber,
        totalPages: totalPages,
      });
    } catch (err) {
      // Handle unexpected errors.
      res
        .status(400)
        .json({ error: `An error occurred: ${(err as Error).message}` });
    }
  },
};
