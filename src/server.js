var express = require('express');
var app = express();
var request = require('request');
var axios = require('axios');
var keys = require('./keys.js');

//let cors = require('cors');
app.use(express.json());

const getLatLonFromZip = async zip => {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=77840&key=${keys.google_key}`);
    const data = response.data;
    return {
        latitude: data.results[0].geometry.location.lat,
        longitude: data.results[0].geometry.location.lng,
    };
};

const getAproposWeather = async (lat, lon) => {
    const response = await axios.get(`https://api.darksky.net/forecast/${keys.dark_sky_key}/${lat},${lon}`);
    const data = response.data.currently;
    return {
        temperature: data.temperature,
        windSpeed: data.windSpeed,
        precipitation: data.precipIntensity,
        cloudCover: data.cloudCover
    }
};

const getGif = async (message) => {
    const response = await axios.get(`http://api.giphy.com/v1/gifs/random?tag=${message}&api_key=${keys.giphy_key}&rating=pg-13`)
    const data = response.data.data.images.original.url;
    return data;
};

const generateTerms = async (temp, precipitation, windSpeed, cloudCover) => {
    console.log("temp: " + temp + " precip: " + precipitation + " wind " + windSpeed + " c " + cloudCover)
    let messages = ['weather'];
    // get temp
    if (temp > 90) {
        messages.push( 'hot');
    } else if (temp > 70) {
        messages.push( 'warm');
    } else if (temp > 50) {
        messages.push( 'cool');
    } else if (temp > 32) {
        messages.push( 'cold');
    } else {
        messages.push( 'freezing');
    }

    // precipitation
    if (precipitation > 2) {
        if (temp > 32) {
            messages.push( "raining");
        } else {
            messages.push( 'snowing');
        }
    }

    // windSpeed
    if (windSpeed > 10) {
        messages.push( "windy");
    }

    if (cloudCover < 0.25) {
        messages.push( "sunny");
    }

    return messages.join('+');
};

app.get('/api', async (req, res) => {
    console.log('GET request received');
    let imageUrl;
    let message;

    // convert zip code to lat long
    const { latitude, longitude } = await getLatLonFromZip(77381)

    // get weather
    const { temperature, windSpeed, precipitation, cloudCover } = await getAproposWeather(latitude, longitude);

    // generate messages
    const messages = await generateTerms(temperature, windSpeed, precipitation, cloudCover);
    console.log(messages)

    // get image
    const image = await getGif(messages);

    res.send({data: image});
});

console.log(__dirname + '/../build');
app.use('/', express.static(require('path').resolve(__dirname + '/../build')));

app.listen(3001);
console.log("The server is now running on port 3001.");
