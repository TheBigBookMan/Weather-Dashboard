// Global Variables
// Search section
const inputSelection = document.getElementById('search-city');
const submitBtn = document.getElementById('submit-btn');
const historyList = document.querySelector('.search-history-list');
var savedLocalCities = [];
var savedStorage;
var newLi;
var newLiButton;
var url;



// HAVE ARRAY OF THE PREVIOUS SESSION THAT HAS THE LOCAL STORAGE COME UP THROUGH INIT AND THEN USE THAT ARRAY TO THEN CREATE A NEW ONE WHICH THEN GETS SAVED AND SENT IN TO THE NEXT SESSION LIKE A LOOP

// EVENT LISTENER FOR THE SEARCH BAR LINKED TO THE SUBMIT BUTTON
// NEED TO INPUT THE FUNCTION NAME AND PASS THE PARAMETER FROM THE SEARCH-CITY VALUE
submitBtn.addEventListener('click', event =>{
    event.preventDefault();
    var input = inputSelection.value;
    if (input === "") {
        alert("Please enter a valid city.")
        return;
    }
    url = `http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=3&appid=d9b9bc1832593b46ab69e998211f9b08`;
    // console.log(url)
    getApiLatLon(input);
});


// FUNCTION THAT RETRIEVES THE SEARCHES FROM THE LOCAL STORAGE

// FUNCTION THAT STORES THE SEARCH HISTORY SELETIONS IN THE DIV UNDER SEARCH BAR
const createHistoryList = (input) => {
    newLi = document.createElement('li');
    newLiButton = document.createElement('button');
    newLi.appendChild(newLiButton);
    newLiButton.className = "search-history-item"
    historyList.appendChild(newLi);
    newLiButton.textContent = input
}

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


// FUNCTION TO SET ITEM TO LOCAL STORAGE AND THEN GET HISTORY FUNCTION
const storeLocally = input => {
    if (savedStorage === null) {
        savedStorage = [input]
        localStorage.setItem("inputCityArray", JSON.stringify(savedStorage));
        createHistoryList(input)
        return;
    } else {
        savedStorage.push(input);
        localStorage.setItem("inputCityArray", JSON.stringify(savedStorage));
    }
    createHistoryList(input)
}



// FUNCTION THAT GETS THE API FROM THE WEATHER DATABSE FOR GEOCODER AND RETURNS THE LAT AND LONG INTO THE OTHER FUNCTION THAT TURNS IT INTO ONECALL INFO
const getApiLatLon = input => { // HAVE ARGUMENT AS cityChosen
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if(data.length > 0) {
                storeLocally(input);
            } else {
                alert("Please Insert Valid City");
            };
            // console.log(data)
        })
};
    


// NEED A FUNCTION TAHT TAKES IN THE LAT AND LONG FROM GEOCODER API AND THEN TRANSFORMS THAT INTO THE REQUEST FOR THE WEATHER INFORMATION FOR THE ONECALL API REQUEST


// FUNCTION THAT RETREIVES THE API SEARCH INTO THE MAIN SECTION

// FUNCTION THAT USES THE API DATA TO INPRINT OUT THE DAY WEATHER AND IT"S CHARACTERSITICS

// FUNCTION THAT USES THE API DATA FOR THE NEXT FIVE DAYS 



// FUNCTION THAT PRINTS OUT CARDS OF THE FIVE DAYS WITH INFORMATION ON THEM
init()