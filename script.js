// var currentIconEl = $("#currentIcon");
var currentDate = document.getElementById("#");
var citiesSearchedFor = JSON.parse(localStorage.getItem("Cities")) || [];
console.log(citiesSearchedFor);

var apiKey = "bc0c1f8c95416e6d650b2f0f1d8e489c";

getCurrentWeather(cityName="Atlanta");

function getCurrentWeather(cityName) {
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
    var cityLat = response.coord.lat;
    var cityLong = response.coord.lon;

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
      $("#currentUV").text(response.value);
    });

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
    }).then(function (response) {
      console.log(response);
    });
  });
}

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
  $("#cityList").html(`<a href="#" class="list-group-item list-group-item-action previous-cities"
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

