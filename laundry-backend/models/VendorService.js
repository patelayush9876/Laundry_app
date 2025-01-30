const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Vendor = require("./Vendor");
const Service = require("./Service");

const VendorService = sequelize.define("VendorService", {});

Vendor.belongsToMany(Service, { through: VendorService });
Service.belongsToMany(Vendor, { through: VendorService });

module.exports = VendorService;
