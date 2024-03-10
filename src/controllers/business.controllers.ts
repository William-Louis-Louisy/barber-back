import { Response, Request } from "express";
import BusinessSchema from "../models/business.models";
import { IBusiness } from "../interfaces/schemas.interfaces";

// BUSINESS CONTROLLER
export const businessController = {
  // CREATE BUSINESS
  createBusiness: async function (req: Request, res: Response) {
    const {
      name,
      shop,
      address,
      phone,
      email,
      facebook,
      instagram,
    }: IBusiness = req.body;
    try {
      if (!name || !shop || !address || !phone || !email) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const business = await BusinessSchema.create({
        name,
        shop,
        address,
        phone,
        email,
        facebook,
        instagram,
      });
      res.status(201).json({ business: business._id });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  // RETRIEVE BUSINESS
  retrieveBusiness: async function (req: Request, res: Response) {
    try {
      const business = await BusinessSchema.findOne();
      if (!business) {
        return res.status(400).json({ error: "Business not found" });
      }
      res.status(200).json(business);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  // UPDATE BUSINESS
  updateBusiness: async function (req: Request, res: Response) {
    const {
      name,
      shop,
      address,
      phone,
      email,
      facebook,
      instagram,
    }: IBusiness = req.body;
    try {
      const business = await BusinessSchema.findOne();
      if (!business) {
        return res.status(400).json({ error: "Business not found" });
      }
      business.name = name;
      business.shop = shop;
      business.address = address;
      business.phone = phone;
      business.email = email;
      business.facebook = facebook;
      business.instagram = instagram;
      await business.save();
      res.status(200).json({ business: business._id });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
};
