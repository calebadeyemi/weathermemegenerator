var express = require('express');
var app = express();
var axios = require('axios');
var keys = require('./keys.js');

app.use(express.json());

const fetchData = async url => {
    const response = await axios.get(url)
        .catch(err => { if (err.response) {
            console.log("Error getting response from " + url);
        }});
    console.log(url + ": " + response.status + " " + response.statusText);
    return response.data;
}

const getLatLonFromZip = async zip => {
    const data = await fetchData(`https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${keys.google_key}`);
    if (data.status !== 'ZERO_RESULTS') {
        return {
            latitude: data.results[0].geometry.location.lat,
            longitude: data.results[0].geometry.location.lng,
        };
    } else {
        throw Error("No results for zip");
    }
};

const getAproposWeather = async (lat, lon) => {
    const data = await fetchData(`https://api.darksky.net/forecast/${keys.dark_sky_key}/${lat},${lon}`);
    const weather = data.currently;
    return {
        temperature: weather.temperature,
        windSpeed: weather.windSpeed,
        precipitation: weather.precipIntensity,
        cloudCover: weather.cloudCover
    }
};

const getRandomGif = async message => {
    const data = await fetchData(`http://api.giphy.com/v1/gifs/random?tag=${message}&api_key=${keys.giphy_key}&rating=pg-13`);
    return data.data.images.original.url;
};

const getSearchedGif = async message => {
    const response = await axios.get(`http://api.giphy.com/v1/gifs/search?&api_key=${keys.giphy_key}&q=${message}&limit=1&rating=pg-13&lang=en`)
    const data = response.data.data[0].images.original.url;
    return data;
}

const getTranslatedGif = async message => {
    const response = await axios.get(`http://api.giphy.com/v1/gifs/translate?&api_key=${keys.giphy_key}&s=${message}&rating=pg-13`)
    const data = response.data.data.images.original.url;
    console.log(data);
    return data;
}

const generateTerms = async (weatherObj) => {
    let temp = weatherObj.temperature;
    let precipitation = weatherObj.precipitation;
    let windSpeed = weatherObj.windSpeed;
    let cloudCover = weatherObj.cloudCover;

    console.log("T: " + temp + " P: " + precipitation + " W: " + windSpeed + " C: " + cloudCover)
    let messages = ['weather', 'temperature'];
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
    const zip = req.query.zip;
    console.log('GET request received for zip-code ' + zip);

    // convert zip code to lat long
    const { latitude, longitude } = await getLatLonFromZip(zip).catch(e => { console.log(e); return {latitude: null, longitude: null}});

    // if zip does not match a location, this will be default
    let image = "https://memegenerator.net/img/instances/65969612/zipcode-boundaries-are-serious-business-only-takes-one-bad-zip-code-to-mess-up-your-day.jpg";
    // if there is a latitude and longitude, proceed, else don't
    if (latitude && longitude) {
        // get weather
        const weatherObj = await getAproposWeather(latitude, longitude);

        // generate messages
        const messages = await generateTerms(weatherObj);
        console.log(messages);

        // get image
        image = await getRandomGif(messages);
        //const image = await getTranslatedGif(messages);
    }

    res.send({data: image});
});

app.use('/', express.static(require('path').resolve(__dirname + '/../build')));

app.listen(3001);
console.log("The server is now running on port 3001.");
