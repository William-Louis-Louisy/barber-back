import mongoose, { Schema } from "mongoose";
import { IOpeningHours } from "../interfaces/schemas.interfaces";

const OpeningHoursSchema = new Schema<IOpeningHours>({
  dayOfWeek: { type: Number, required: true }, // 0 = Sunday, 1 = Monday, etc.
  open: { type: Date, required: true },
  close: { type: Date, required: true },
});

export default mongoose.model<IOpeningHours>(
  "OpeningHours",
  OpeningHoursSchema
);
