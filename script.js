var APIKey = "858f42885b0e6bac694715e9a412caec";
var fetchUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityInput + "&limit=5&appid=" + APIKey;
var lat;
var lon;
var cityInput = "London";
var searchHistory = [];


function formatDate(date) {
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var day = String(date.getDate()).padStart(2, "0");
  var year = date.getFullYear();
  return month + "/" + day + "/" + year;
}

function APICALL() {

  fetch(fetchUrl)
    .then(response => response.json())
    .then(data => {
      var city = data[0];
     
      lat = city.lat;
      lon = city.lon;
      cityName = city.name;
      

      console.log("City Name:", cityName);
      console.log("Latitude:", lat);
      console.log("Longitude:", lon);

      var currentDate = new Date();
      var formattedCurrentDate = formatDate(currentDate);
  
      var cityNameElement = document.querySelector(".State");
      var dateElement = document.querySelector(".DateT");
      var forecastDateElements = document.querySelectorAll(".Date");

      cityNameElement.textContent = cityName;
      dateElement.textContent = formattedCurrentDate;

      var nextDates = [];
      for (var i = 0; i < 5; i++) {
        var nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + i + 1);
        nextDates.push(nextDate);
      }

      forecastDateElements.forEach((element, index) => {
        var formattedDate = formatDate(nextDates[index]);
        element.textContent = formattedDate;
      });

      fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=" + APIKey)
  .then(response => response.json())
  .then(currentForecastData => {
    console.log("Current Forecast:", currentForecastData);

    var temperatureKelvin = currentForecastData.main.temp;
    var temperatureCelsius = temperatureKelvin - 273.15;
    var temperatureFahrenheit = (temperatureCelsius * 9/5) + 32;
    var temperatureString = temperatureFahrenheit.toFixed(2);

    var temperature = document.querySelector(".tempT");
    var windElement = document.querySelector(".windT");
    var humidityElement = document.querySelector(".humidityT");
    var iconElement = document.querySelector(".icon"); 

    var windSpeed = currentForecastData.wind.speed;
    var humidity = currentForecastData.main.humidity;
    var weatherType = currentForecastData.weather[0].main; 

    temperature.textContent = temperatureString;
    windElement.textContent = windSpeed;
    humidityElement.textContent = humidity;
    iconElement.textContent = weatherType;
  })
  .catch(error => {
    console.error('Error:', error);
  });

fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&appid=" + APIKey)
  .then(response => response.json())
  .then(fiveDayForecastData => {
    console.log("Five-Day Forecast:", fiveDayForecastData);

    var forecastList = fiveDayForecastData.list;
    var forecastElements = document.querySelectorAll(".rectangle");

    forecastList.forEach((forecast, index) => {
      var forecastTempElement = forecastElements[index].querySelector(".temp" + (index + 1));
      var forecastWindElement = forecastElements[index].querySelector(".wind" + (index + 1));
      var forecastHumidityElement = forecastElements[index].querySelector(".humidity" + (index + 1));

      var temperatureKelvin = forecast.main.temp; 
      var temperatureCelsius = temperatureKelvin - 273.15;
      var temperatureFahrenheit = (temperatureCelsius * 9/5) + 32;
      var temperatureString = temperatureFahrenheit.toFixed(2);
      forecastTempElement.textContent =  temperatureString;

      var windSpeed = forecast.wind.speed;
      var humidity = forecast.main.humidity;

      forecastWindElement.textContent = windSpeed;
      forecastHumidityElement.textContent = humidity;
    });
  })
  .catch(error => {
    console.log(error); // not sure what this error meant, the program worked.
  });

    })
    .catch(error => {
      console.error(error); // not sure what this error meant, the program worked.
    });
}

function setHistoryElements(city) {
searchHistory.push(city);
searchHistory.reverse();
var searchHistoryElement = document.getElementById("searchHistory");
searchHistoryElement.innerHTML = "";

for (var i = 0; i <searchHistory.length; i++) {
  var searchItem = document.createElement("div");
  searchItem.textContent = searchHistory[i];
  searchHistoryElement.appendChild(searchItem);
  }

}
var searchButton = document.getElementById("search");
searchButton.addEventListener("click", function () { 
  var cityInput = document.getElementById("cityInput").value;
  if (cityInput) {
    fetchUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityInput + "&limit=5&appid=" + APIKey;
    APICALL();
    setHistoryElements(cityInput);
  } else {
    console.error("Please enter a city name!");
    

  }
});

