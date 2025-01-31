const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Vendor = sequelize.define("Vendor", {
  name: { type: DataTypes.STRING, allowNull: false },
  latitude: { type: DataTypes.FLOAT, allowNull: false },
  longitude: { type: DataTypes.FLOAT, allowNull: false },
  location_name: { type: DataTypes.STRING, allowNull: false },
  services:{type:DataTypes.STRING,allowNull:false},
});

module.exports = Vendor;
