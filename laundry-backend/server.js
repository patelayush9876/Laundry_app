require("dotenv").config();
const express = require("express");
const sequelize = require("./config/db");
const vendorRoutes = require("./routes/vendorRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api", vendorRoutes);

sequelize.sync().then(() => {
  app.listen(5000,"0.0.0.0", () => console.log("Server running on port 5000"));
});
