//api key : 05763633a9b64264b6c12601232506
const apiKey = '05763633a9b64264b6c12601232506';
const urlNoLocation = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=`;
let obtainedData;

async function getWeatherData(location) {
    const weather = await fetch(urlNoLocation + location);
    const json = await weather.json();
    console.log(json);
    console.log(getDataFromJson(json));
    const data = getDataFromJson(json);
    return data; 
}

//displayWeather("london");

function getDataFromJson(json) {
    return {
        current: json.current.condition.text,
        tempC: json.current.temp_c, 
        tempF: json.current.temp_f, 
        humidity: json.current.humidity
    };
}

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const location = document.querySelector("#search-box");
    obtainedData = getWeatherData(location.value);
    obtainedData.then(data => displayDataOnPage(data));
    obtainedData.then(data => presentGif(data.current));
});

//display the info on the page

function displayDataOnPage(data) {
    const currentWeather = data.current;
    const temp = data.tempF;
    const humidity = data.humidity;
    document.querySelector(".current-weather").innerHTML = currentWeather;
    document.querySelector(".temp").innerHTML = `${temp}&deg;`;
    document.querySelector(".humidity").innerHTML = `${humidity}%`;
}

//display a gif from Giphy API
async function presentGif(weather) {
    try {
        const url = `https://api.giphy.com/v1/gifs/translate?api_key=bb2006d9d3454578be1a99cfad65913d&s=${weather}`;
        const gif = await fetch(url, {mode: 'cors'});
        const json = await gif.json();
        const img = document.querySelector("img");
        img.src = json.data.images.original.url;
    } catch (e) {
        console.log(e);
    }
}

//to toggle the switch, data from the fetch operation needs to be accessed
//but async function only return promise and i do not want to re-fetch the data if i only want to toggle the temp
//therefore, use obtainedData as a global variable to save the promise returned from the fetch operation
const toggleButtons = document.querySelectorAll(".cel, .far");
toggleButtons.forEach(toggleButton => {
    toggleButton.addEventListener("click", (e) =>{
        toggleButtons[0].disabled = false;
        toggleButtons[1].disabled = false;
        if (e.target.className === "cel") {
            e.target.disabled = true;
            obtainedData.then(data => {
                document.querySelector(".temp").innerHTML = `${data.tempC}&deg;`;
            })
        }
        if (e.target.className === "far") {
            e.target.disabled = true;
            obtainedData.then(data => {
                document.querySelector(".temp").innerHTML = `${data.tempF}&deg;`;
            })
        }
    })
})
