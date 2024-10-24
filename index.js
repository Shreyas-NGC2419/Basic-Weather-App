const express = require("express")
const app = express()
const dotenv = require("dotenv")
const { imgmap } = require("./utils/image_map.js")
const { titleCase } = require("./utils/stringUtils.js")

app.listen(3000)
dotenv.config({ path: "./.env" })

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'));
app.set("view engine", "ejs")

app.post("/weather", async (req, res) => {
    try {
        const location = req.body.cityname;
        const response = await fetch(`https:geocode.maps.co/search?q=${location}&api_key=${process.env.GEOCODER_API_KEY}`)
        const coordinates = await response.json()

        const lat = coordinates[0].lat || coordinates[1].lat;
        const lon = coordinates[0].lon || coordinates[1].lon;

        const weather_response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`);

        const climate = await weather_response.json();

        console.log(climate);
        

        res.render("index", { climate, imgmap, titleCase })
    }
    catch (error) {
        console.error("Something Went Wrong: ", error)
        res.status(500).send("Error Fetching Data")
    }
})

app.get("/", (req, res) => {
    res.render("weather", { climate: {}, imgmap,titleCase })
})


