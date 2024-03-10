import mongoose, { Schema } from "mongoose";
import { IAppointment } from "../interfaces/schemas.interfaces";

const AppointmentSchema = new Schema<IAppointment>({
  date: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
  timeSlots: [{ type: Schema.Types.ObjectId, ref: "TimeSlot", required: true }],
  scheduleId: { type: Schema.Types.ObjectId, ref: "Schedule", required: true },
});

export default mongoose.model<IAppointment>("Appointment", AppointmentSchema);
