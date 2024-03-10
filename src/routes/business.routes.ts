import { businessController } from "../controllers/business.controllers";

const express = require("express");
const businessRouter = express.Router();

// CREATE BUSINESS
businessRouter.post(
  "/business-informations",
  businessController.createBusiness
);

// RETRIEVE BUSINESS
businessRouter.get(
  "/business-informations",
  businessController.retrieveBusiness
);

// UPDATE BUSINESS
businessRouter.put("/business-informations", businessController.updateBusiness);

export default businessRouter;
