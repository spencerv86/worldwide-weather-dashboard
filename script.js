var apiKey = "bc0c1f8c95416e6d650b2f0f1d8e489c";
var cityName = "Atlanta";

function getCurrentWeather() {
  
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
    $("#currentTemp").text(response.main.temp);
    $("#currentHumid").text(response.main.humidity);
    $("#currentWind").text(response.wind.speed);
    var cityLat = response.coord.lat;
    var cityLong = response.coord.lon;

    var UVQueryURL =
      "https://api.openweathermap.org/data/2.5/uvi?lat="+cityLat+"&lon="+cityLong+"&appid="+apiKey;

    $.ajax({
      url: UVQueryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
    });
  });
}

function getFiveDay() {
    var fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+cityName+"&appid="+apiKey

    $.ajax({
        url: fiveDayQueryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
    })
}


getCurrentWeather();
getFiveDay();

// function getUVIndex (cityName) {
//     var queryURL = "http://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API key}"
// }

// function getFiveDay(cityName) {

// }

// function clickFunc() {

//     getFiveDay()
//     getUVIndex()
//     getCurrentWeather();
// }

// clickFunc();
