const express = require("express");
const Vendor = require("../models/Vendor");
const Service = require("../models/Service");

const router = express.Router();

// Add a new vendor
router.post("/register-vendor", async (req, res) => {
  try {
    const { name, latitude, longitude, location_name, services } = req.body;

    const vendor = await Vendor.create({ name, latitude, longitude, location_name });

    if (services && services.length) {
      const serviceRecords = await Service.findAll({ where: { name: services } });
      await vendor.addServices(serviceRecords);
    }

    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vendors by location
router.get("/vendors/location", async (req, res) => {
  const { location_name } = req.query;

  const vendors = await Vendor.findAll({ where: { location_name } });
  console.log(vendors);
  res.json(vendors);
});

// Get vendors by service
router.get("/vendors/service", async (req, res) => {
  const { service_name } = req.query;

  const service = await Service.findOne({ where: { name: service_name }, include: Vendor });
  res.json(service ? service.Vendors : []);
});

module.exports = router;
