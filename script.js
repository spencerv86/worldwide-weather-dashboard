// var currentIconEl = $("#currentIcon");
var currentDate = document.getElementById("#");
var citiesSearchedFor = JSON.parse(localStorage.getItem("Cities")) || [];
console.log(citiesSearchedFor);
var defaultCity = "Atlanta";
var lastCity = citiesSearchedFor.length - 1;
var apiKey = "bc0c1f8c95416e6d650b2f0f1d8e489c";

console.log(citiesSearchedFor[lastCity]);

// This if/else states that if there are recent searches in local storage that the last city searched should be the loaded first, otherwise the default city of Atlanta should be loaded.
if (citiesSearchedFor[lastCity] === undefined){
    getCurrentWeather(defaultCity);
} else {
    getCurrentWeather(citiesSearchedFor[lastCity])
}


// This is the function that sets all queryURLs and does all ajax calls for weather data, the cityName is dependant on what event listener is triggering the function
function getCurrentWeather(cityName) {
  // This first query and call will pull the current weather data for the searched for city
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=imperial&appid=" +
    apiKey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    // This function fills in the data pulled for Name, date, temp, humidity and wind speed as well as pulling a icon to display the weather
    $("#citySearched").text(response.name);
    $("#todaysDate").text(moment.unix(response.dt).format("MM/DD/YYYY"));
    $("#current-icon").attr(
      "src",
      "https://openweathermap.org/img/wn/" +
        response.weather[0].icon +
        "@2x.png"
    );
    $("#current-icon").attr("alt", response.weather[0].description);
    $("#currentTemp").text(response.main.temp);
    $("#currentHumid").text(response.main.humidity);
    $("#currentWind").text(response.wind.speed);

    // The following Ajax calls require the latitude and longitude of the searched for city, this sets them as variable to keep the code clean and easy to input
    var cityLat = response.coord.lat;
    var cityLong = response.coord.lon;

    // This query and function calls the UV Index data for the long/lat of the searched for city and returns it to the UV index ID in the current weather card
    var UVQueryURL =
      "https://api.openweathermap.org/data/2.5/uvi?lat=" +
      cityLat +
      "&lon=" +
      cityLong +
      "&appid=" +
      apiKey;

    $.ajax({
      url: UVQueryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      var currentUVEl = $("#currentUV");
      $(currentUVEl).text(response.value);
    //   $(currentUVEl).attr("style", "color: white")
      if (response.value < 3) {
          $(currentUVEl).attr("class", "badge badge-success")
      } else if (response.value > 2 && response.value < 8) {
          $(currentUVEl).attr("class", "badge badge-warning")
      } else if (response.value > 8) {
          $(currentUVEl).attr("class", "badge badge-danger")
      }

    });

    // This query and function calls for the 7 day forecast which will be used to fill the 5-day forecast boxes and their data-points
    var fiveDayQueryURL =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      cityLat +
      "&lon=" +
      cityLong +
      "&exclude=minutely,hourly,alerts&units=imperial&appid=" +
      apiKey;

    $.ajax({
      url: fiveDayQueryURL,
      method: "GET",
    }).then(function (forecast) {
      console.log(forecast);
      console.log(moment.unix(forecast.daily[1].dt).format("MM/DD/YYYY"));

    //   This for loop will create the cards that will display the 5-day forecast and fill their data points
    $("#forecast-grid").empty();

      for (var i = 1; i < 6; i++) {
        var forecastBox = $("<div>").attr(
          "class",
          "card text-white bg-primary mb-3 col futurecast"
        );
        $(forecastBox).attr("style", "max-width: 18rem");

        var forecastDate = $("<h4>").attr("id", "future-header");
        $(forecastDate).text(
          moment.unix(forecast.daily[i].dt).format("MM/DD/YYYY")
        );
        forecastBox.append(forecastDate);

        var forecastBody = $("<div>").attr("class", "card-body future-data");
        
        
        var forecastSky = forecast.daily[i].weather[0];
        var forecastIcon = $("<img>").attr(
          "src",
          "https://openweathermap.org/img/wn/" +
            forecastSky.icon +
            "@2x.png"
        );
        $(forecastIcon).attr("alt", forecastSky.description);
        forecastBody.append(forecastIcon);

        var forecastTemp = $("<p>");
        $(forecastTemp).text("Temp: " + forecast.daily[i].temp.day + " °F");
        forecastBody.append(forecastTemp);

        var forecastHumid = $("<p>");
        $(forecastHumid).text("Humidity: " + forecast.daily[i].humidity);

        forecastBody.append(forecastHumid);

        forecastBox.append(forecastBody);

        $("#forecast-grid").append(forecastBox);
      }
    });
  });
}

// This for loop pulls from any cities found in local storage to recreate their list elements in the sidebar.
for (var i = 0; i < citiesSearchedFor.length; i++) {
  var cityName = citiesSearchedFor[i];
  var newCity = $("<a>");
  $(newCity).attr(
    "class",
    "list-group-item list-group-item-action previous-cities"
  );
  newCity.text(cityName);
  $("#cityList").append(newCity);
}

// This event listener runs the getCurrentWeather function for the user inputted city
$("#searchBtn").on("click", function (event) {
  event.preventDefault();
  console.log($("#searchCity").val());
  var cityName = $("#searchCity").val();
  var newCity = $("<a>");
  $(newCity).attr(
    "class",
    "list-group-item list-group-item-action previous-cities"
  );
  newCity.text(cityName);
  $("#cityList").append(newCity);
  getCurrentWeather(cityName);

  citiesSearchedFor.push(cityName);
  localStorage.setItem("Cities", JSON.stringify(citiesSearchedFor));
});

$("#cityList").on("click", ".previous-cities", function (event) {
  var cityName = $(this).text();
  getCurrentWeather(cityName);
});

$("#clear-button").on("click", function (event) {
  localStorage.setItem("Cities", JSON.stringify([]));
  $("#cityList").empty();
  $(
    "#cityList"
  ).html(`<a href="#" class="list-group-item list-group-item-action previous-cities"
    >Atlanta</a>`);

  $("#current-card").empty();

  $("#current-card").html(`
  <h1 id="currentH1">  
    <span id="citySearched"> Atlanta</span>
    <span id="todaysDate"></span>
    <img id="current-icon" src="" alt="" />
  </h1>
  <br />
  <p>Temperature: <span id="currentTemp"></span> °F</p>
  <p>Humidity: <span id="currentHumid"></span>%</p>
  <p>Wind Speed: <span id="currentWind"></span> MPH</p>
  <p>UV Index: <span id="currentUV"></span></p>`);

  var cityName = "Atlanta";
  getCurrentWeather(cityName);
});
