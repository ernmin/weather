async function formSubmit(event) {
    event.preventDefault();
    const city = document.querySelector('#get-city').value;
    data_call = await fetchCoord(city);
    console.log(data_call);
    latitude = data_call.results[0].latitude;
    longitude = data_call.results[0].longitude;
    weather = await fetchWeather(latitude, longitude);
    console.log(weather);
    drawChart(weather);
    
    // console.log(city);
    // console.log(weather);
}

async function fetchCoord(city) {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);
        return await data;
    }
    catch (error) {
        console.error('Fetch error:', error);
    }
}

async function fetchWeather(latitude, longitude) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max&current=temperature_2m`);
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);
        return await data;
    }
    catch (error) {
        console.error('Fetch error:', error);
    }
}

const form = document.querySelector('#city-form')

form.addEventListener('submit', formSubmit);
