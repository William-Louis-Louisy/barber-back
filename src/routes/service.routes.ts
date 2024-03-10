import { serviceController } from "../controllers/service.controllers";

const express = require("express");
const serviceRouter = express.Router();

// CREATE SERVICE
serviceRouter.post("/service", serviceController.createService);
// RETRIEVE SERVICE
serviceRouter.get("/service/:id", serviceController.retrieveService);
// RETRIEVE ALL SERVICES
serviceRouter.get("/services", serviceController.retrieveAllServices);
// UPDATE SERVICE
serviceRouter.put("/service/:id", serviceController.updateService);
// DELETE SERVICE
serviceRouter.delete("/service/:id", serviceController.deleteService);

export default serviceRouter;
