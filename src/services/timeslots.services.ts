import ScheduleSchema from "../models/schedule.models";
import OpeningHoursSchema from "../models/openingHours.models";
import { IOpeningHours } from "../interfaces/schemas.interfaces";

const moment = require("moment");

export function generateTimeSlots(
  startDate: Date,
  openingHours: IOpeningHours[],
  dayToGenerate: number = 60
) {
  let schedules = [];

  for (let day = 0; day < dayToGenerate; day++) {
    let currentDate = moment(startDate).add(day, "days").toDate();
    let dayOfWeek = moment(currentDate).day();
    let hoursForDay = openingHours.find((oh) => oh.dayOfWeek === dayOfWeek);
    let dailyTimeSlots = [];

    if (hoursForDay) {
      let currentTime = moment(hoursForDay.open)
        .year(moment(currentDate).year())
        .month(moment(currentDate).month())
        .date(moment(currentDate).date());
      let closingTime = moment(hoursForDay.close)
        .year(moment(currentDate).year())
        .month(moment(currentDate).month())
        .date(moment(currentDate).date());

      while (currentTime < closingTime) {
        let endTime = moment(currentTime).add(30, "minutes");
        dailyTimeSlots.push({
          start: currentTime.toDate(),
          end: endTime.toDate(),
        });
        currentTime = endTime;
      }
    }

    if (dailyTimeSlots.length > 0) {
      schedules.push({
        date: currentDate,
        timeSlots: dailyTimeSlots,
      });
    }
  }

  return schedules;
}

export async function addDailyTimeSlots() {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 60);
    const openingHours = await OpeningHoursSchema.find();
    const timeSlotsForOneDay = generateTimeSlots(startDate, openingHours, 1);

    if (timeSlotsForOneDay.length > 0) {
      await ScheduleSchema.create(timeSlotsForOneDay[0]);
      console.log("Additional time slots for one day saved to the database.");
    }
  } catch (error) {
    console.error("Failed to add daily time slots:", error);
  }
}

export async function initializeTimeSlots() {
  try {
    const existingSchedule = await ScheduleSchema.find();

    if (existingSchedule.length === 0) {
      const startDate = new Date();
      const openingHours = await OpeningHoursSchema.find();
      const schedules = generateTimeSlots(startDate, openingHours);

      await ScheduleSchema.insertMany(schedules);
      console.log("Schedules initialized for the next 60 days.");
    }
  } catch (error) {
    console.error("Failed to initialize schedules:", error);
  }
}
