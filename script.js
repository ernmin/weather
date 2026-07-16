let global_weather = null;
let global_county = null;
let global_city = null;

async function getCountry(data_call, city, country) {
    let results = data_call.results
    for (let i = 0; i < 10; i++){
        console.log(results[i].name)
        console.log(results[i].country)
        if ((city == results[i].name) && (country == results[i].country)){
            return i
        }
    }
}

async function formSubmit(event) {
    event.preventDefault();
    const city = document.querySelector('#get-city').value;
    const country = document.querySelector('#get-country').value;
    global_city = city
    data_call = await fetchCoord(city);
    data_call_index = await getCountry(data_call, city, country);
    destroyChart()
    
    console.log(data_call);
    
    try {
        let country = data_call.results[data_call_index].country
        global_country = country
        let latitude = data_call.results[data_call_index].latitude;
        let longitude = data_call.results[data_call_index].longitude;
        let weather = await fetchWeather(latitude, longitude);
        global_weather = await weather
        console.log(weather);
        indicateCityCountry(city, country)
        drawChart(weather);
    }
    catch (error) {
        let cityDiv = document.querySelector('#city-country')
        console.error('Fetch error:', error);
        cityDiv.textContent = 'Try Again'

    }
}

async function fetchCoord(city) {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`);
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

function indicateCityCountry(city, country) {
    let cityDiv = document.querySelector('#city-country')
    cityDiv.textContent = `${city}, ${country}`
}

function checkDegrees(e) {
    if (global_city == null) {
        return
    }
    else{
        if (e.target.checked) {
            console.log("Checked!");
            destroyChart()
            drawChart(global_weather)
            indicateCityCountry(global_city, global_country)
        } else {
            console.log("Unchecked!");
            destroyChart()
            drawChart(global_weather)
            indicateCityCountry(global_city, global_country)
        }
    }

}

const form = document.querySelector('#city-form');

form.addEventListener('submit', formSubmit);

const checkBox = document.querySelector('#degrees-checked');

checkBox.addEventListener('change', checkDegrees);
