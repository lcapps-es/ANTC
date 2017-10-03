$(document).ready(function(){
	$('#background').css('background-image', "url('https://source.unsplash.com/random/1920x1080')").waitForImages(function() {
		$('#background').addClass('show');
	}, $.noop, true);

	updateClock();
	//updateGreetings();

	$('#search input').keypress(function(e) {
		if(e.which == 13) {
			e.preventDefault();
			top.location = 'https://www.google.com/search?q='+$(this).val();
		}
	});

	getWeather();
});

function updateClock() {
    var now = new Date(); // current date
	time = ("0" + now.getHours()).slice(-2) + ':' + ("0" + now.getMinutes()).slice(-2) + ':' + ("0" + now.getSeconds()).slice(-2);

    // set the content of the element with the ID time to the formatted string
    $('#clock h1').html(time);

    // call this function again in 1000ms
    setTimeout(updateClock, 1000);
}


function getLocation(callback) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position){
			callback(position.coords);
		});
	} else {
		console.info( "Geolocation is not supported by this browser.");
	}
}


function getWeather() {
	var path = "http://api.openweathermap.org/data/2.5/weather?appid=45dc870e41c6c3980d4d1e446bf6d079&units=metric&lang=es";

	getLocation(function(pos){		
			var url = path + "&lat=" + pos.latitude + "&lon=" + pos.longitude;
			console.log(url);
			
			var xhttp = new XMLHttpRequest();
			xhttp.open("GET", url, true);
			xhttp.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					var data = JSON.parse(this.response);

					console.log(data);
					
					document.getElementById("location").innerHTML = data.name;
					document.getElementById("temperature").getElementsByTagName("span")[0].innerHTML = data.main.temp + "º";
					document.getElementById("others").getElementsByTagName("span")[0].innerHTML = data.main.temp_min + "º";
					document.getElementById("others").getElementsByTagName("span")[1].innerHTML = data.main.temp_max + "º";
					document.getElementById("iWeather").className += getWeatherIcon(data.weather[0].id);
				}
			};
			xhttp.send();

		});

}


function getWeatherIcon(id) {

	var icons = [];

	//https://openweathermap.org/weather-conditions
	//https://erikflowers.github.io/weather-icons/

	icons[200] = "wi-day-thunderstorm";
	icons[800] = "wi-day-sunny";

	if(icons[id] == undefined) {
		return "wi-alien";
	}
	return icons[id];
}
