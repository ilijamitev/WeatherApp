console.log("=========== Weather App ===========")

// START SCREEN ELEMENTS
let startScreen = document.getElementById("start-screen");
let urlTodays = null;
let urlHourly = null;

let unit = null;
let cityName = null;
let language = null;

// MAIN SCREEN 
let mainScreen = document.getElementById('main-screen-content');
let selectOtherCityIcon = document.getElementById('select-other-city');

// TODAY'S ELEMENTS
let todaysInfo = document.getElementsByClassName('current-day-info')[0];
let todayMainInfo = document.getElementById("today-main-info")
let todayAdditionalInfoShowHide = document.getElementById("additional-info-show-hide");

// HOURLY ELEMENTS
let hourlyDivContainer = document.getElementsByClassName('hourly-weather container')[0];
let hourlyMainEditInner = document.getElementsByClassName("hourly-weather main-innerHTML")[0];

// ABOUT ELEMENTS
let aboutScreen = document.getElementById('about');

// FUNCTIONS

let windSpeedUnit = (data) => {
    if (unit === "metric" || unit === "standard") {
        return `${Number(data * 3.6).toFixed(2)} km/h`
    }
    else if (unit === "imperial") {
        return `${data} mph`
    }
}

let temperatureUnit = () => {
    if (unit === "standard") {
        return `K`
    }
    else if (unit === "metric") {
        return `C`
    }
    else if (unit === "imperial") {
        return `F`
    }
}

let convertUnixTime = (unix) => {
    let milliseconds = Number(unix) * 1000;
    let dateObj = new Date(milliseconds);
    let humanDateFormat = dateObj.toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "numeric" });
    return humanDateFormat
}

let callWeatherApi = (url, func) => {
    fetch(url)
        .then(response => response.json())
        .then(result => {
            func(result)
        })
        .catch(error => {
            console.log(error);
        });
}

// TODAY'S WEATHER FUNCTIONS

let showTodaysMainInfo = (weatherInfo) => {
    todayMainInfo.innerHTML = ``
    todayMainInfo.innerHTML = `
        <div class="current-day title">
            <h2 class="current-day weather-location">Today's Forecast for ${weatherInfo.name}, ${weatherInfo.sys.country}</h2>
            <small class="current-day last-updated">Last updated : ${convertUnixTime(weatherInfo.dt)}</small>
        </div>

        <div class="current-day main-info">
            <span>
                <span id="currentDay-feels-like-temp">${Math.round(weatherInfo.main.feels_like)}<sup>o</sup>${temperatureUnit()}</span>
                <br>
                <i style="padding-left: 5px;">Feels Like</i>
            </span>

            <span id="currentDay-icon"><img src="http://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png" width="105px"></span>

            <span id="currentDay-main">${weatherInfo.weather[0].main}</span>

            <span id="currentDay-icon-humidity">
                <img src="../assets/icons/icons8-humidity-30.png" alt="humidity-icon">
                ${weatherInfo.main.humidity}%
            </span>

            <span id="currentDay-icon-windSpeed">
                <img src="../assets/icons/icons8-wind-30.png" alt="wind-icon">
                ${windSpeedUnit(weatherInfo.wind.speed)}
            </span>

            <img id="arrow-icon-btn-down" src="../assets/icons/icons8-expand-arrow-30.png" width="40px"
                class="arrow-icon-btn" alt="down-arrow" title="Show Details">
        </div>`

    // Today's info events
    let arrowIconBtn = document.getElementsByClassName('arrow-icon-btn')[0];
    document.getElementById('today-btn').addEventListener('click', () => {
        todaysInfo.removeAttribute('hidden');
        aboutScreen.setAttribute('hidden', 'hidden');
        hourlyDivContainer.setAttribute('hidden', 'hidden');
        todayAdditionalInfoShowHide.setAttribute('hidden', 'hidden');
        arrowIconBtn.setAttribute('src', '../assets/icons/icons8-expand-arrow-30.png');
        callWeatherApi(urlTodays, showTodaysMainInfo);
    });

    document.getElementsByClassName("current-day-info")[0].addEventListener("click", (event) => {
        if (event.target.id === "arrow-icon-btn-down") {
            arrowIconBtn.setAttribute('src', '../assets/icons/icons8-collapse-arrow-30.png');
            arrowIconBtn.setAttribute('id', 'arrow-icon-btn-up');
            todayAdditionalInfoShowHide.removeAttribute('hidden');
            callWeatherApi(urlTodays, showTodaysAdditionalInfo);
        }
        else if (event.target.id === "arrow-icon-btn-up") {
            arrowIconBtn.setAttribute('src', '../assets/icons/icons8-expand-arrow-30.png');
            arrowIconBtn.setAttribute('id', 'arrow-icon-btn-down');
            todayAdditionalInfoShowHide.setAttribute('hidden', 'hidden');
        };
    });
}

let showTodaysAdditionalInfo = (weatherInfo) => {
    todayAdditionalInfoShowHide.innerHTML = ``
    todayAdditionalInfoShowHide.innerHTML = `
    <div class="current-day additional-info">
         <div class="additional-info div-one">
             <span><img src="../assets/icons/icons8-temperature-35.png" alt="temperature-icon">High ${weatherInfo.main.temp_max}<sup>o</sup>${temperatureUnit()}</span>
             <span>Low ${weatherInfo.main.temp_min}<sup>o</sup>${temperatureUnit()}</span>
             <span>Average ${Number((weatherInfo.main.temp_max + weatherInfo.main.temp_min) / 2).toFixed(2)}<sup>o</sup>${temperatureUnit()}</span>
         </div>

         <div class="additional-info div-two">
             <span><img src="../assets/icons/icons8-wind-30.png" alt="wind-icon" title="Wind">${windSpeedUnit(weatherInfo.wind.speed)}</span>
             <span><img src="../assets/icons/icons8-humidity-30.png" alt="humidity-icon" title="Humidity"> ${weatherInfo.main.humidity}%</span>
             <span><img src="../assets/icons/icons8-atmospheric-pressure-30.png" alt="atmospheric-pressure-icon" title="Pressure"> ${weatherInfo.main.pressure} hPa</span>
         </div>

         <div class="additional-info div-three">
             <span><img src="../assets/icons/icons8-eye-30.png" alt="visibility-icon" title="Visibility"> ${weatherInfo.visibility} m</span>
             <span><img src="../assets/icons/icons8-sunrise-30.png" alt="sunrise-icon" title="Sunrise"> ${convertUnixTime(weatherInfo.sys.sunrise).slice(convertUnixTime(weatherInfo.sys.sunrise).length - 8)}</span>
             <span><img src="../assets/icons/icons8-sunset-30.png" alt="sunset-icon" title="Sunset"> ${convertUnixTime(weatherInfo.sys.sunset).slice(convertUnixTime(weatherInfo.sys.sunrise).length - 8)}</span>
         </div>

         <div class="additional-info div-four">
             <span>${weatherInfo.weather[0].description}</span>
             <span><img src="../assets/icons/icons8-clouds-30.png" alt="clouds-icon" title="Cloudiness"> ${weatherInfo.clouds.all}%</span>
         </div>
    </div>`
}

// HOURLY WEATHER FUNCTIONS

let showHourlyMainInfo = (weatherInfo) => {
    hourlyMainEditInner.innerHTML = "";
    document.getElementById('hourlyForecastTitle').innerText = `Five days Hourly Forecast for ${weatherInfo.city.name}, ${weatherInfo.city.country}`

    for (let i = 0; i < weatherInfo.list.length; i++) {
        hourlyMainEditInner.innerHTML += `
    <details>
        <summary class="hourly-weather mainInfo">
            <span class="hourly-weather time">${convertUnixTime(weatherInfo.list[i].dt).slice(0, 3)}, ${convertUnixTime(weatherInfo.list[i].dt).slice(convertUnixTime(weatherInfo.list[i].dt).length - 8)}</span>

            <span class="hourly-weather feels-like">${Math.round(weatherInfo.list[i].main.feels_like)}<sup>o</sup>${temperatureUnit()}</span>

            <span class="hourly-weather weather-icon"><img src="http://openweathermap.org/img/wn/${weatherInfo.list[i].weather[0].icon}@2x.png" width="55px"></span>

            <span class="hourly-weather weather-main">${weatherInfo.list[i].weather[0].main}</span>

            <span class="hourly-weather humidity">
                <img src="../assets/icons/icons8-humidity-30.png" alt="humidity-icon"> ${weatherInfo.list[i].main.humidity}%
            </span>

            <span class="hourly-weather windSpeed">
                <img src="../assets/icons/icons8-wind-30.png" alt="wind-icon">  ${windSpeedUnit(weatherInfo.list[i].wind.speed)}
            </span >

             <img id="arrow-icon-btnDown" name="arrow-icon-btnDown" src="../assets/icons/icons8-expand-arrow-30.png" width="35px"
                        class="arrow-icon-btnDown" alt="down-arrow" title="Show Details">
        </summary>
                
            <div class="hourly-weather additional-innerHTML">
                <div class="add-info div-one" >
                    <span><img src="../assets/icons/icons8-temperature-35.png" alt="temperature-icon">High ${weatherInfo.list[i].main.temp_max}<sup>o</sup>${temperatureUnit()}</span>
                    <span>Low ${weatherInfo.list[i].main.temp_min}<sup>o</sup>${temperatureUnit()}</span>
                    <span>Average ${Number((weatherInfo.list[i].main.temp_max + weatherInfo.list[i].main.temp_min) / 2).toFixed(2)}<sup>o</sup>${temperatureUnit()}</span>
                </div >

                <div class="add-info div-two">
                    <span><img src="../assets/icons/icons8-wind-30.png" alt="wind-icon" title="Wind">${windSpeedUnit(weatherInfo.list[i].wind.speed)}</span>
                    <span><img src="../assets/icons/icons8-humidity-30.png" alt="humidity-icon"
                                title="Humidity"> ${weatherInfo.list[i].main.humidity}%</span>
                    <span><img src="../assets/icons/icons8-atmospheric-pressure-30.png"
                            alt="atmospheric-pressure-icon" title="Pressure"> ${weatherInfo.list[i].main.pressure} hPa</span>
                </div>

                <div class="add-info div-three" id="div-three">
                    <span><img src="../assets/icons/icons8-eye-30.png" alt="visibility-icon"
                        title="Visibility"> ${weatherInfo.list[i].visibility} m</span>
                    <span> ${weatherInfo.list[i].weather[0].description}</span>
                    <span><img src="../assets/icons/icons8-clouds-30.png" alt="clouds-icon"
                         title="Cloudiness"> ${weatherInfo.list[i].clouds.all} %</span>
                </div>
            </div>
    </details > `
    };
};

//  EVENTS

// First screen
setTimeout(() => {
    document.getElementById('start-screen-menu').removeAttribute('hidden');
    document.getElementById('gifUp').setAttribute('hidden', 'hidden');
}, 2900);

selectOtherCityIcon.addEventListener('click', () => {
    mainScreen.setAttribute('hidden', 'hidden');
    selectOtherCityIcon.setAttribute('hidden', 'hidden');
    startScreen.removeAttribute('hidden');
    cityName = ""
    unit = ""
    language = ""
    urlTodays = ""
    urlHourly = ""
})

document.getElementById('show-weather').addEventListener('click', async (e) => {
    e.preventDefault();
    const apiKey = "592ecdfb21eea5e16842bde55a759e60";
    let cityNameInput = document.getElementById('select-city');
    cityName = cityNameInput.options[cityNameInput.selectedIndex].value;
    let unitInput = document.getElementById('select-unit');
    unit = unitInput.options[unitInput.selectedIndex].value;
    let languageInput = document.getElementById('select-language');
    language = languageInput.options[languageInput.selectedIndex].value;

    urlTodays = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unit}&lang=${language}`;
    urlHourly = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${unit}&lang=${language}`;

    startScreen.setAttribute('hidden', 'hidden');
    hourlyDivContainer.setAttribute('hidden', 'hidden');
    todaysInfo.removeAttribute('hidden')
    mainScreen.removeAttribute('hidden');
    selectOtherCityIcon.removeAttribute('hidden');

    callWeatherApi(urlTodays, showTodaysMainInfo);
})

// Hourly info events

document.getElementById('hourly-btn').addEventListener('click', () => {
    hourlyDivContainer.removeAttribute('hidden');
    todaysInfo.setAttribute('hidden', 'hidden');
    aboutScreen.setAttribute('hidden', 'hidden');

    callWeatherApi(urlHourly, showHourlyMainInfo);
});

// About info events

document.getElementById('about-btn').addEventListener('click', () => {
    aboutScreen.removeAttribute('hidden');
    todaysInfo.setAttribute('hidden', 'hidden');
    hourlyDivContainer.setAttribute('hidden', 'hidden');
})

