$(document).ready(function(){
	$('#background').css('background-image', "url('https://source.unsplash.com/random/1920x1080')").waitForImages(function() {
		$('#background').addClass('show');

		BackgroundCheck.init({
			targets: '.changeColor',
			images: '#background',
			debug: true
		});
		BackgroundCheck.refresh();
	}, $.noop, true);

	updateClock();

	$('#search input').keypress(function(e) {
		if(e.which == 13) {
			e.preventDefault();
			top.location = 'https://www.google.com/search?q='+$(this).val();
		}
	});

	$('#weather, #miniweather').on('click', function(e){
		$('#weather, #miniweather').toggle();
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
	var path = "https://api.openweathermap.org/data/2.5/weather?appid=45dc870e41c6c3980d4d1e446bf6d079&units=metric&lang=es";

	getLocation(function(pos){		
		var url = path + "&lat=" + pos.latitude + "&lon=" + pos.longitude;
		
		$.get({
			url: url,
		}).done(function(response){
			$('#location').text(response.name);
			$('#tempnow').text(normalizeTemp(response.main.temp));
			$('#others').text(normalizeTemp(response.main.temp_min)+' / '+normalizeTemp(response.main.temp_max));
			$('#iWeather').addClass(getWeatherIcon(response.weather[0].id));
			
			$('#miniiWeather').addClass(getWeatherIcon(response.weather[0].id));
			$('#minitemp').text(normalizeTemp(response.main.temp));

			$('#miniweather').show();
		});
	});
}

function normalizeTemp(temp) {
	return Math.round(temp * 10)/10 + "º";
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
