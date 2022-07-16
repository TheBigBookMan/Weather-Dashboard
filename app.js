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

// Result section
var resultContainer = document.querySelector('.result-container')
var resultTitle = document.getElementById('result-city-title')
var resultDate = document.getElementById('result-city-date')
var resultIcon = document.getElementById('result-city-icon')
var resultList = document.querySelector('.result-city-info-list')
var dateTime;
var dateUnix;
var futureCards = document.querySelector('.future-day-cards')

// EVENT LISTENER FOR THE SEARCH BAR LINKED TO THE SUBMIT BUTTON
// NEED TO INPUT THE FUNCTION NAME AND PASS THE PARAMETER FROM THE SEARCH-CITY VALUE
submitBtn.addEventListener('click', event =>{
    event.preventDefault();
    var input = inputSelection.value;
    if (input === "") {
        alert("Please enter a valid city.")
        return;
    }
    urlGeoCode = `http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=3&appid=d9b9bc1832593b46ab69e998211f9b08`;
    getApiLatLon(input);
});


// FUNCTION THAT STORES THE SEARCH HISTORY SELETIONS IN THE DIV UNDER SEARCH BAR
const createHistoryList = (input) => {
    newLi = document.createElement('li');
    newLiButton = document.createElement('button');
    newLi.appendChild(newLiButton);
    newLiButton.className = "search-history-item"
    historyList.appendChild(newLi);
    newLiButton.textContent = input
    createBtnEvent(input)
}

// Initialization function that creates the history section on refresh page
const init = () => {
    savedLocalCities = JSON.parse(localStorage.getItem("inputCityArray"))
    savedStorage = savedLocalCities
    if (savedLocalCities === null) {
        return;
    } else {
        for (var i = 0; i < savedLocalCities.length; i++) {
            newLi = document.createElement('li');
            newLiButton = document.createElement('button');
            newLi.appendChild(newLiButton);
            newLiButton.className = "search-history-item"
            historyList.appendChild(newLi);
            newLiButton.textContent = savedLocalCities[i]
        };
    }
    
};

// ADD EVENT LISTENER TO THE HISTORY LIST BUTTONS SO THEY CALL THE API FUNCTION TO GET THE INFORMATION
const createBtnEvent = (input) => {
    newLiButton.addEventListener('click', event => {
        event.preventDefault()
        console.log(input)
        urlGeoCode = `http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=3&appid=d9b9bc1832593b46ab69e998211f9b08`;
        getApiLatLon(input)
    })
}


// PUT IF ELSE STATEMENT BEFORE THE CREATEHISTORY TO CHECK IF ITS ALREADY IN HISTORY SECTION TO STOP IT FROM CREATING ANOTHER BUTTON
// FUNCTION TO SET ITEM TO LOCAL STORAGE AND THEN GET HISTORY FUNCTION
const storeLocally = input => {
    if (savedStorage === null) {
        savedStorage = [input]
        localStorage.setItem("inputCityArray", JSON.stringify(savedStorage));
        createHistoryList(input)
        return;
    } else if (savedStorage.includes(input)) {
        return;
    } else {
        savedStorage.push(input);
        localStorage.setItem("inputCityArray", JSON.stringify(savedStorage));
    }
    createHistoryList(input)
}



// FUNCTION THAT GETS THE API FROM THE WEATHER DATABSE FOR GEOCODER AND RETURNS THE LAT AND LONG INTO THE OTHER FUNCTION THAT TURNS IT INTO ONECALL INFO
const getApiLatLon = input => { // HAVE ARGUMENT AS cityChosen
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
            var latGeoCode = data[0].lat
            var lonGeoCode = data[0].lon
            getApiWeather(latGeoCode, lonGeoCode, input)
        })
};

// NEED A FUNCTION TAHT TAKES IN THE LAT AND LONG FROM GEOCODER API AND THEN TRANSFORMS THAT INTO THE REQUEST FOR THE WEATHER INFORMATION FOR THE ONECALL API REQUEST
//NEED TEMP= temp, WIND=wind_speed + "km/h", HUMIDITY= humidity + %, UV INDEX = uvi (add in an if statement for color coding 0-2 green, 2-5 orange, 5+ red)

const getApiWeather = (lat, lon, input) => {
    urlWeather = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=cb187059a60a4d1624b2d6be95ebcdf1`
    fetch(urlWeather)
        .then(function(response) {
            console.log(response)
            return response.json();
        })
        .then(function(data) {
            var currentTemp = data.current.temp
            var currentWind = data.current.wind_speed
            var currentHumidity = data.current.humidity
            var currentUvi = data.current.uvi
            currentDayResult(currentTemp, currentWind, currentHumidity, currentUvi, input)
            createFiveDayResults(data)
        })
        return;
}

var resultListTemp = document.createElement('li')
var resultListWind = document.createElement('li')
var resultListHumidity = document.createElement('li')
var resultListUvi = document.createElement('li')
var resultListUviNum = document.createElement('span')

// FUNCTION THAT RETREIVES THE API SEARCH INTO THE MAIN SECTION
const currentDayResult = (temp, wind, humidity, uvi, input) => {
    resultTitle.textContent = input + "-"
    dateTime = moment();
    resultDate.textContent = dateTime.format("dddd, MMMM Do Y");
    //ADD IN ICON AFTER THE DATE
    
    resultListTemp.textContent = "Temp: " + temp + "°C";
    resultList.append(resultListTemp)
    
    resultListWind.textContent = "Wind: " + wind + " km/h";
    resultList.append(resultListWind)

    resultListHumidity.textContent = "Humidity: " + humidity + "%"
    resultList.append(resultListHumidity)

    resultListUvi.textContent = "UV Index: "
    if (uvi >= 0 && uvi < 2) {
        resultListUviNum.textContent = uvi
        resultListUviNum.className = 'color-code-green'
        resultListUvi.append(resultListUviNum)
    } else if (uvi >= 2 && uvi < 5) {
        resultListUviNum.textContent = uvi
        resultListUviNum.className = 'color-code-orange'
        resultListUvi.append(resultListUviNum)
    } else if (uvi >= 5) {
        resultListUviNum.textContent = uvi
        resultListUviNum.className = 'color-code-red'
        resultListUvi.append(resultListUviNum)
    }
    resultList.append(resultListUvi)
    return;
}

// FUNCTION THAT USES THE API DATA FOR THE NEXT FIVE DAYS 
const createFiveDayResults = data => {
    console.log(data)
    var dailyData = data.daily 
    console.log(dailyData)
    var dailyTemp;
    var dailyWind;
    var dailyHumidity;
    var dailyUnix;
    futureCards.textContent = ''
    for (var i = 1; i < 6; i++) {
        dailyTemp = dailyData[i].temp.day
        dailyWind = dailyData[i].wind_speed
        dailyHumidity = dailyData[i].humidity
        dailyUnix = dailyData[i].dt
        printCardFiveDay(dailyUnix, dailyTemp, dailyWind, dailyHumidity)
    }
}


// FUNCTION THAT PRINTS OUT CARDS OF THE FIVE DAYS WITH INFORMATION ON THEM
const printCardFiveDay = (unix, temp, wind, humidity) => {
    
    var card = document.createElement('div')
    card.className = 'future-card'
    futureCards.append(card)
    

    var cardDate = document.createElement('h3')
    dateUnix = moment.unix(unix).format("DD/MM/Y")
    cardDate.textContent = dateUnix
    card.append(cardDate)

    // ADD IN LOGO

    var cardTemp = document.createElement('p')
    cardTemp.textContent = 'Temp: ' + temp + '°C'
    card.append(cardTemp)

    var cardWind = document.createElement('p')
    cardWind.textContent = 'Wind: ' + wind + ' km/h'
    card.append(cardWind)

    var cardHumidity = document.createElement('p')
    cardHumidity.textContent = 'Humidity: ' + humidity + '%'
    card.append(cardHumidity)
}



// GET API ICONS FOR THE CLOUD, SUN ETC



// FUNCTION THAT USES THE API DATA TO INPRINT OUT THE DAY WEATHER AND IT"S CHARACTERSITICS






init()