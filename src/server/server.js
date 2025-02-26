const dotenv = require("dotenv");
dotenv.config();

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const app = express();
const skycons = require("skycons");

/* Middleware*/
app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("dist"));
//Creating Routes
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.post("/forecast", async (req, res) => {
  try {
    if (!req.body.url) {
      return res.status(400).json({ error: "Missing API URL in request body" });
    }

    // Fetch data from Weatherbit API
    const getForecast = await fetch(req.body.url);

    // Handle bad API responses
    if (!getForecast.ok) {
      throw new Error(`API request failed with status ${getForecast.status}`);
    }

    // Wait for JSON conversion
    const response = await getForecast.json();

    // Ensure response has data
    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ error: "No weather data found" });
    }

    // Extract relevant data
    const weatherbit = {
      current_temp: response.data[0].temp,
      current_icon: response.data[0].weather.icon,
      daily_tempHigh: response.data[0].max_temp,
      daily_tempLow: response.data[0].low_temp,
      daily_icon: response.data[0].weather.icon,
    };

    res.json(weatherbit);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/data", (req, res) => {
  res.send(trips);
  console.log(trips);
});
// designates what port the app will listen to for incoming requests
app.listen(3000, function () {
  console.log("Example app listening on http://localhost:3000/");
});

module.exports = app;
