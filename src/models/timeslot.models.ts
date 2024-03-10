import mongoose from "mongoose";
import { ITimeSlot } from "../interfaces/schemas.interfaces";

const TimeSlotSchema = new mongoose.Schema<ITimeSlot>({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  available: { type: Boolean, required: true, default: true },
});

export default TimeSlotSchema;
