import { Application } from "express";
import userRouter from "./src/routes/user.routes";
import serviceRouter from "./src/routes/service.routes";
import openingHoursRouter from "./src/routes/opening.routes";
import scheduleRouter from "./src/routes/schedule.routes";
import appointmentRouter from "./src/routes/appointment.routes";
import businessRouter from "./src/routes/business.routes";

export function setupRoutes(app: Application) {
  app.use(userRouter);
  app.use(serviceRouter);
  app.use(scheduleRouter);
  app.use(businessRouter);
  app.use(appointmentRouter);
  app.use(openingHoursRouter);
}
