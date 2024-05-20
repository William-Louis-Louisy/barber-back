import { scheduleController } from "../controllers/schedule.controllers";

const express = require("express");
const scheduleRouter = express.Router();

// RETRIEVE SCHEDULE
scheduleRouter.get("/schedule/:id", scheduleController.retrieveSchedule);
// RETRIEVE ALL SCHEDULES
scheduleRouter.get("/schedules", scheduleController.retrieveAllSchedules);
// RETRIEVE SCHEDULES EXCLUDING PASSED DATES
scheduleRouter.get(
  "/schedules/available",
  scheduleController.retrieveSchedules
);
// UPDATE SCHEDULE
scheduleRouter.put("/schedule/:id", scheduleController.updateSchedule);
// DELETE SCHEDULE
scheduleRouter.delete("/schedule/:id", scheduleController.deleteSchedule);
// TURN TIME SLOTS INTO UNAVAILABLE OF A SCHEDULE
scheduleRouter.put(
  "/schedule/:id/unavailable",
  scheduleController.turnTimeSlotsUnavailable
);
// TURN TIME SLOTS INTO AVAILABLE OF A SCHEDULE
scheduleRouter.put(
  "/schedule/:id/available",
  scheduleController.turnTimeSlotsAvailable
);
// RETRIEVE SCHEDULES EXCLUDING PASSED DATES AND UNAVAILABLE TIME SLOTS WITH PAGINATION
scheduleRouter.get(
  "/schedules/available/:page",
  scheduleController.retrieveSchedulesWithPagination
);
// TURN A TIME SLOT INTO UNAVAILABLE
scheduleRouter.put(
  "/schedule/:scheduleId/timeSlot/:timeSlotId/unavailable",
  scheduleController.turnTimeSlotUnavailable
);

// TURN A TIME SLOT INTO AVAILABLE
scheduleRouter.put(
  "/schedule/:scheduleId/timeSlot/:timeSlotId/available",
  scheduleController.turnTimeSlotAvailable
);

export default scheduleRouter;
