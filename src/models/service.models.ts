import mongoose, { Schema } from "mongoose";
import { IService } from "../interfaces/schemas.interfaces";

const ServiceSchema = new Schema<IService>({
  title: {
    en: { type: String, required: true },
    es: { type: String, required: true },
    fr: { type: String, required: true },
  },
  description: {
    en: { type: String, required: true },
    es: { type: String, required: true },
    fr: { type: String, required: true },
  },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  vip: { type: Boolean, required: true, default: false },
});

export default mongoose.model<IService>("Service", ServiceSchema);
