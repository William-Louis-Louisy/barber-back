import { Types, Document, Date } from "mongoose";

export interface IUser extends Document {
  mail: string;
  phone: string;
  password: string;
  firstName: string;
  isAdmin?: boolean;
}

export interface IService extends Document {
  title: { en: string; es: string; fr: string };
  description: { en: string; es: string; fr: string };
  duration: number;
  price: number;
  vip: boolean;
}

export interface ITimeSlot extends Document {
  start: Date;
  end: Date;
  available: boolean;
}

export interface ISchedule extends Document {
  date: Date;
  timeSlots: ITimeSlot[];
}

export interface IOpeningHours extends Document {
  dayOfWeek: { type: Number; required: true }; // 0 = Sunday, 1 = Monday, etc.
  open: { type: Date; required: true };
  close: { type: Date; required: true };
}

export interface IAppointment extends Document {
  date: Date;
  user: Types.ObjectId;
  service: Types.ObjectId;
  timeSlots: Types.ObjectId[];
  scheduleId: Types.ObjectId;
}

export interface IBusiness extends Document {
  name: string;
  shop: string;
  address: string;
  phone: string;
  email: string;
  facebook?: string;
  instagram?: string;
}
