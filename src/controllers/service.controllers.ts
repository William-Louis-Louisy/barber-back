import { Response, Request } from "express";
import ServiceSchema from "../models/service.models";
import { IService } from "../interfaces/schemas.interfaces";

// SERVICE CONTROLLER
export const serviceController = {
  // CREATE SERVICE
  createService: async function (req: Request, res: Response) {
    const { title, description, price, duration, vip }: IService = req.body;
    try {
      if (
        !title ||
        !description ||
        price === null ||
        duration === null ||
        vip === null
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const service = await ServiceSchema.create({
        title,
        description,
        price,
        duration,
        vip,
      });
      res.status(201).json({ service: service._id });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  // RETTRIEVE SERVICE
  retrieveService: async function (req: Request, res: Response) {
    const { id } = req.params;
    try {
      const service = await ServiceSchema.findById(id);
      if (!service) {
        return res.status(400).json({ error: "Service not found" });
      }
      res.status(200).json(service);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  // RETRIEVE ALL SERVICES
  retrieveAllServices: async function (req: Request, res: Response) {
    try {
      const services = await ServiceSchema.find();
      if (!services || services.length === 0) {
        return res.status(400).json({ error: "No services found" });
      }
      res.status(200).json(services);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  // UPDATE SERVICE
  updateService: async function (req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, price, duration, vip }: IService = req.body;
    try {
      if (
        !title ||
        !description ||
        price === null ||
        duration === null ||
        vip === null
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const service = await ServiceSchema.findByIdAndUpdate(
        id,
        { title, description, price, duration, vip },
        { new: true }
      );
      if (!service) {
        return res.status(400).json({ error: "Service not found" });
      }
      res.status(200).json({
        status: 200,
        data: service,
        message: "Service updated successfully",
      });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  // DELETE SERVICE
  deleteService: async function (req: Request, res: Response) {
    const { id } = req.params;
    try {
      const service = await ServiceSchema.findByIdAndDelete(id);
      if (!service) {
        return res.status(400).json({ error: "Service not found" });
      }
      res.status(200).json({
        status: 200,
        message: "Service deleted successfully",
      });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
};
