// Global Variables
// Search section
const inputSelection = document.getElementById('search-city');
const submitBtn = document.getElementById('submit-btn');
const historyList = document.querySelector('.search-history-list');
var savedLocalCities = [];
var savedStorage;
var newLi;
var newLiButton;
var urlGeoCode;
var urlWeather;
var urlIcon;

// Result section
var resultContainer = document.querySelector('.result-container');
var resultTitle = document.getElementById('result-city-title');
var resultDate = document.getElementById('result-city-date');
var resultIcon = document.getElementById('result-city-icon');
var resultList = document.querySelector('.result-city-info-list');
var dateTime;
var dateUnix;
var futureCards = document.querySelector('.future-day-cards');

// Event listener for the submit button to submit the search City name into the GeoCoder url, and then calls the API function
submitBtn.addEventListener('click', event =>{
    event.preventDefault();
    var input = inputSelection.value;
    if (input === "") {
        alert("Please enter a valid city.");
        return;
    };
    urlGeoCode = `http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=3&appid=d9b9bc1832593b46ab69e998211f9b08`;
    getApiLatLon(input);
});

// Function that creates the buttons of history cities typed in
const createHistoryList = (input) => {
    newLi = document.createElement('li');
    newLiButton = document.createElement('button');
    newLi.appendChild(newLiButton);
    newLiButton.className = "search-history-item";
    historyList.appendChild(newLi);
    newLiButton.textContent = input;
    createBtnEvent(input);
};

// Initialization function that creates the history section on refresh page by using a for loop to iterate through the local storage array of stored city names
const init = () => {
    savedLocalCities = JSON.parse(localStorage.getItem("inputCityArray"));
    savedStorage = savedLocalCities;
    if (savedLocalCities === null) {
        return;
    } else {
        for (var i = 0; i < savedLocalCities.length; i++) {
            newLi = document.createElement('li');
            newLiButton = document.createElement('button');
            newLi.appendChild(newLiButton);
            newLiButton.className = "search-history-item";
            historyList.appendChild(newLi);
            newLiButton.textContent = savedLocalCities[i];
            createBtnEvent(savedLocalCities[i]);
        };
    };  
};

// Function that adds an event listener to the history selected buttons, which calls the API function
const createBtnEvent = (input) => {
    newLiButton.addEventListener('click', event => {
        event.preventDefault();
        urlGeoCode = `http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=3&appid=36152fcc0ae44d6202fb3b8144f7dc20`;
        getApiLatLon(input);
    });
};

// Function that takes in the city named and saves it to the local storage into an array, which then calls to create the history saved list
const storeLocally = input => {
    if (savedStorage === null) {
        savedStorage = [input];
        localStorage.setItem("inputCityArray", JSON.stringify(savedStorage));
        createHistoryList(input);
        return;
    } else if (savedStorage.includes(input)) {
        return;
    } else {
        savedStorage.push(input);
        localStorage.setItem("inputCityArray", JSON.stringify(savedStorage));
    }
    createHistoryList(input);
};

// Function that receives the city name input and then fetches the GeoCode API, which then returns the latitude and longitude, which then calls the API weather function
const getApiLatLon = input => {
    fetch(urlGeoCode)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if(data.length > 0) {
                storeLocally(input);
            } else {
                alert("Please Insert Valid City");
            };
            var latGeoCode = data[0].lat;
            var lonGeoCode = data[0].lon;
            getApiWeather(latGeoCode, lonGeoCode, input);
        });
};

// Function that takes in the latitude, longitude and input city name and fetches the one call API, which then returns the information about the weather for current day
const getApiWeather = (lat, lon, input) => {
    urlWeather = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=cb187059a60a4d1624b2d6be95ebcdf1`;
    fetch(urlWeather)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var currentTemp = data.current.temp;
            var currentWind = data.current.wind_speed;
            var currentHumidity = data.current.humidity;
            var currentUvi = data.current.uvi;
            var currentIcon = data.current.weather[0].icon;
            currentDayResult(currentTemp, currentWind, currentHumidity, currentUvi, input, currentIcon);
            createFiveDayResults(data);
        });
        return;
};

var resultListTemp = document.createElement('li');
var resultListWind = document.createElement('li');
var resultListHumidity = document.createElement('li');
var resultListUvi = document.createElement('li');
var resultListUviNum = document.createElement('span');
var resultListIcon = document.createElement('img');

// Function that takes in the information of the weather and then creates the current day information onto the webpage through Javascript DOM
const currentDayResult = (temp, wind, humidity, uvi, input, icon) => {
    resultTitle.textContent = input + "-";
    dateTime = moment();
    resultDate.textContent = dateTime.format("dddd, MMMM Do Y");

    resultListIcon.className = 'icon-img';
    resultListIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    resultIcon.append(resultListIcon);
    
    resultListTemp.textContent = "Temp: " + temp + "°C";
    resultList.append(resultListTemp);
    
    resultListWind.textContent = "Wind: " + wind + " km/h";
    resultList.append(resultListWind);

    resultListHumidity.textContent = "Humidity: " + humidity + "%";
    resultList.append(resultListHumidity);

    resultListUvi.textContent = "UV Index: ";
    if (uvi >= 0 && uvi < 2) {
        resultListUviNum.textContent = uvi;
        resultListUviNum.className = 'color-code-green';
        resultListUvi.append(resultListUviNum);
    } else if (uvi >= 2 && uvi < 5) {
        resultListUviNum.textContent = uvi;
        resultListUviNum.className = 'color-code-orange';
        resultListUvi.append(resultListUviNum);
    } else if (uvi >= 5) {
        resultListUviNum.textContent = uvi;
        resultListUviNum.className = 'color-code-red';
        resultListUvi.append(resultListUviNum);
    }
    resultList.append(resultListUvi);
    return;
};

// Function that iterates through the data retrieved from the fetch function and finds the relevant data for the next 5 days
const createFiveDayResults = data => {
    var dailyData = data.daily;
    var dailyTemp;
    var dailyWind;
    var dailyHumidity;
    var dailyUnix;
    futureCards.textContent = '';
    for (var i = 1; i < 6; i++) {
        dailyTemp = dailyData[i].temp.day;
        dailyWind = dailyData[i].wind_speed;
        dailyHumidity = dailyData[i].humidity;
        dailyUnix = dailyData[i].dt;
        dailyIcon = dailyData[i].weather[0].icon;
        printCardFiveDay(dailyUnix, dailyTemp, dailyWind, dailyHumidity, dailyIcon);
    };
};


// Function that takes in the weather information for the next 5 day cards and creates them through Javascript DOM
const printCardFiveDay = (unix, temp, wind, humidity, icon) => {
    var card = document.createElement('div');
    card.className = 'future-card';
    futureCards.append(card);
    
    var cardDate = document.createElement('h3');
    dateUnix = moment.unix(unix).format("DD/MM/Y");
    cardDate.textContent = dateUnix;
    card.append(cardDate);

    var cardIcon = document.createElement('img');
    cardIcon.className = 'icon-img';
    cardIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    card.append(cardIcon);

    var cardTemp = document.createElement('p');
    cardTemp.textContent = 'Temp: ' + temp + '°C';
    card.append(cardTemp);

    var cardWind = document.createElement('p');
    cardWind.textContent = 'Wind: ' + wind + ' km/h';
    card.append(cardWind);

    var cardHumidity = document.createElement('p');
    cardHumidity.textContent = 'Humidity: ' + humidity + '%';
    card.append(cardHumidity);
};

// Calling the initialization function to load the history city choices
init()