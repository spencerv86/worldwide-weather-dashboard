
function getCurrentWeather(cityName) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName +"&units=imperial&appid=bc0c1f8c95416e6d650b2f0f1d8e489c"
    
    $.ajax({
            url: queryURL, 
            method: "GET"
    }).then(function(response){
        console.log(response);
        $("#citySearched").text(response.name);
        $("#currentTemp").text(response.main.temp);
        $("#currentHumid").text(response.main.humidity);
        $("#currentWind").text(response.wind.speed);
    })
}

// function getUVIndex (cityName) {

// // }


// function clickFunc() {

//     getUVIndex("")
//     getCurrentWeather("Baltimore");
// }


// $(button).on('click', clickFunc )