// Global Variables
// Search section
const inputSelection = document.getElementById('search-city');
const submitBtn = document.getElementById('submit-btn');
const historyList = document.querySelector('.search-history-list');

var url;

// EVENT LISTENER FOR THE SEARCH BAR LINKED TO THE SUBMIT BUTTON
// NEED TO INPUT THE FUNCTION NAME AND PASS THE PARAMETER FROM THE SEARCH-CITY VALUE
submitBtn.addEventListener('click', function(){
    event.preventDefault();
    var input = inputSelection.value;
    console.log(input)
    localStorage.setItem("inputCity", input);
    getHistory()
    url = `http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=3&appid=d9b9bc1832593b46ab69e998211f9b08`;
    console.log(url)
    getApiLatLon();// HAVE PARAMETER AS INPUT
});


// FUNCTION THAT RETRIEVES THE SEARCHES FROM THE LOCAL STORAGE
const getHistory = () => {
    var outputCity = localStorage.getItem("inputCity");
    createHistoryList(outputCity)
    console.log(outputCity)
}

// FUNCTION THAT STORES THE SEARCH HISTORY SELETIONS IN THE DIV UNDER SEARCH BAR
const createHistoryList = cityHistory => {
    var newLi = document.createElement('li');
    var newLiButton = document.createElement('button');
    newLi.appendChild(newLiButton);
    newLiButton.className = "search-history-item"
    newLiButton.textContent = cityHistory;
    
    historyList.appendChild(newLi);
}


// FUNCTION THAT GETS THE API FROM THE WEATHER DATABSE FOR GEOCODER AND RETURNS THE LAT AND LONG INTO THE OTHER FUNCTION THAT TURNS IT INTO ONECALL INFO
const getApiLatLon = () => { // HAVE ARGUMENT AS cityChosen
    fetch(url)
        .then(function(response) {
            console.log(response)
            console.log(response.ok)
            return response.json();
        })
        .then(function(data) {
            if(data.length === 0) {
                alert("Please Insert Valid City")
                // MAYBE ADD REMOVE FROM LOCAL STORAGE AS WELL BECAUSE DONT WANT HISTORY OF ONE THAT WAS INVALID
            }
            console.log(data)
        })
};
    


// NEED A FUNCTION TAHT TAKES IN THE LAT AND LONG FROM GEOCODER API AND THEN TRANSFORMS THAT INTO THE REQUEST FOR THE WEATHER INFORMATION FOR THE ONECALL API REQUEST




// FUNCTION THAT STORES THE SEARCH RESULT INTO THE LOCAL STORAGE



// FUNCTION THAT RETREIVES THE API SEARCH INTO THE MAIN SECTION

// FUNCTION THAT USES THE API DATA TO INPRINT OUT THE DAY WEATHER AND IT"S CHARACTERSITICS

// FUNCTION THAT USES THE API DATA FOR THE NEXT FIVE DAYS 



// FUNCTION THAT PRINTS OUT CARDS OF THE FIVE DAYS WITH INFORMATION ON THEM