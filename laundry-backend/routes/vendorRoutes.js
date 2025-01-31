// const express = require("express");
// const Vendor = require("../models/Vendor");
// const Service = require("../models/Service");

// const router = express.Router();

// // Add a new vendor
// router.post("/register-vendor", async (req, res) => {
//   try {
//     const { name, latitude, longitude, location_name, services } = req.body;

//     const vendor = await Vendor.create({ name, latitude, longitude, location_name });

//     if (services && services.length) {
//       const serviceRecords = await Service.findAll({ where: { name: services } });
//       await vendor.addServices(serviceRecords);
//     }

//     res.status(201).json(vendor);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get vendors by location
// router.get("/vendors/location", async (req, res) => {
//   const { location_name } = req.query;

//   const vendors = await Vendor.findAll({ where: { location_name } });
//   console.log(vendors);
//   res.json(vendors);
// });

// // Get vendors by service
// router.get("/vendors/service", async (req, res) => {
//   const { service_name } = req.query;

//   const service = await Service.findOne({ where: { name: service_name }, include: Vendor });
//   res.json(service ? service.Vendors : []);
// });

// module.exports = router;


const express = require("express");
const Vendor = require("../models/Vendor");
const Service = require("../models/Service");
const { Op, Sequelize } = require("sequelize");

const router = express.Router();
const EARTH_RADIUS_KM = 6371; // Earth's radius in km

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
  
  try {
    const vendors = await Vendor.findAll({ where: { location_name } });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vendors by service
router.get("/vendors/service", async (req, res) => {
  const { service_name } = req.query;

  try {
    const service = await Service.findOne({
      where: { name: service_name },
      include: Vendor,
    });

    res.json(service ? service.Vendors : []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vendors near user location (within 5km radius)
router.get("/vendors/nearby", async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Latitude and Longitude are required" });
  }

  try {
    const vendors = await Vendor.findAll({
      attributes: [
        "id",
        "name",
        "latitude",
        "longitude",
        "location_name",
        "services",
        [
          Sequelize.literal(`
            ${EARTH_RADIUS_KM} * ACOS(
              COS(RADIANS(${latitude})) * COS(RADIANS(latitude)) *
              COS(RADIANS(longitude) - RADIANS(${longitude})) +
              SIN(RADIANS(${latitude})) * SIN(RADIANS(latitude))
            )
          `),
          "distance",
        ],
      ],
      having: Sequelize.literal("distance <= 5"),
      order: Sequelize.literal("distance ASC"),
    });

    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
