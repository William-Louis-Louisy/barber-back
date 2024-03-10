import { openingHoursController } from "../controllers/openingHours.controllers";

const express = require("express");
const openingHoursRouter = express.Router();

// CREATE OPENING HOURS
openingHoursRouter.post(
  "/opening-hours",
  openingHoursController.createOpeningHours
);

// RETRIEVE OPENING HOURS
openingHoursRouter.get(
  "/opening-hours/:id",
  openingHoursController.retrieveOpeningHours
);

// RETRIEVE ALL OPENING HOURS
openingHoursRouter.get(
  "/opening-hours",
  openingHoursController.retrieveAllOpeningHours
);

// UPDATE OPENING HOURS
openingHoursRouter.put(
  "/opening-hours/:dayOfWeek",
  openingHoursController.updateOpeningHours
);

export default openingHoursRouter;
