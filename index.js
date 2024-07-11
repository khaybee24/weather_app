const express = require('express');
const env = require('dotenv').config();
const port  = process.env.PORT || 3000;
const axios = require('axios');
const requestIp = require('request-ip');
const app = express();

app.use(express.json())
app.use(requestIp.mw())
app.set('trustproxy', true);
app.enable('trustproxy');



app.get('/', (req, res) => {
    res.send("Homepage")
});

app.get('/weather', async (req, res) => {
    try {
        const name =req.query.name;
        const ip = req.clientIp;

        if (!name) {
            return res.status(404).json({ message:'please provide a name'})
        }

        if (ip === "::1" || ip === "127.0. 0.1") {
            return res.status(404).json({ message:"ip address is not available"})
        }

        const response = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.GEOLOCATION_KEY}&ip=${ip}`)

        const lat = response.data.latitude;
        const lng = response.data.longitude;

        const weatherResponse = await axios.get(` http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_KEY}&q=${lat},${lng}`);
        // console.log(weatherResponse);

        const temp = weatherResponse.data.current.temp_c
        const location = weatherResponse.data.location.region;
         //console.log(temp);
        // console.log(location);

        const data = {
            
           message: `Hello ${name} from ${location} your weather condition is ${temp}`

        }
        return res.status(200).json({message: "sucess", data});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'error fetching weather data'})
    }
})

app.listen(port, () =>{
    console.log(`Server is running on port http://localhost:${port}`);
})