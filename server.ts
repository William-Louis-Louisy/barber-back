import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import * as cron from "node-cron";
import { setupRoutes } from "./routes";
import cookieParser from "cookie-parser";
import {
  initializeTimeSlots,
  addDailyTimeSlots,
} from "./src/services/timeslots.services";
import {
  deleteOldAppointments,
  deleteOldSchedules,
} from "./src/services/cleaning.services";

// DATABASE CONNECTION
mongoose
  .connect(`${process.env.MONGO_URL}`, {
    autoIndex: true,
  })
  .then(() => console.log("🟢 Connected to database"))
  .catch((err: any) => console.error(err));

const app = express();

// MIDDLEWARE
app.use(
  cors({
    origin: [
      "*",
      "localhost:3000",
      "http://localhost:3000",
      "https://tommy-barber.vercel.app",
      "tommy-barber.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
    ],
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTES
setupRoutes(app);

// START SERVER
app.listen(process.env.PORT, async () => {
  console.log(`🟢 Listening on port ${process.env.PORT}`);

  // Initialize time slots
  await initializeTimeSlots();

  // Add time slots for next day
  cron.schedule("0 0 * * *", async () => {
    await addDailyTimeSlots();
    await deleteOldAppointments();
    await deleteOldSchedules();
  });
});
