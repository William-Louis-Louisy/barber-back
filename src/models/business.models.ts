import mongoose, { Schema } from "mongoose";
import { IBusiness } from "../interfaces/schemas.interfaces";

const BusinessSchema = new Schema<IBusiness>({
  name: { type: String, required: true },
  shop: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  facebook: { type: String },
  instagram: { type: String },
});

export default mongoose.model<IBusiness>("Business", BusinessSchema);
