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

module.exports = (generateTerms);