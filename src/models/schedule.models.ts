import mongoose, { Schema } from "mongoose";
import { ISchedule } from "../interfaces/schemas.interfaces";
import TimeSlotSchema from "./timeslot.models";

const ScheduleSchema = new Schema<ISchedule>({
  date: { type: Date, required: true },
  timeSlots: [TimeSlotSchema],
});

export default mongoose.model<ISchedule>("Schedule", ScheduleSchema);
