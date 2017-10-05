var storageFields = ['username', 'location'];

$(document).ready(function(){

	updateBackground();
	updateClock();
	updateGreetings();

	$('#weather, #miniweather').on('click', function(e){
		$('#weather, #miniweather').toggle();
	});

	updateWeather();
});

// ================ MAIN FUNCTIONS ================

function updateBackground() {
	$('#background').css('background-image', 'url("https://source.unsplash.com/category/nature/1920x1080")').waitForImages(function() {
		$('#background').addClass('show');
	}, $.noop, true);
}

function updateClock() {
    var now = new Date(); // current date
	time = ("0" + now.getHours()).slice(-2) + ' : ' + ("0" + now.getMinutes()).slice(-2) + ' : ' + ("0" + now.getSeconds()).slice(-2);

    // set the content of the element with the ID time to the formatted string
    $('#clock h1').html(time);

    // call this function again in 1000ms
    setTimeout(updateClock, 1000);
}

function updateGreetings() {
	var now = new Date();
	var hour = now.getHours();
	var message = '';
	if(hour >= 5 && hour < 12) {
		message = getTrad("greetingsMorning");
	} else if(hour >= 12 && hour < 21) {
		message = getTrad("greetingsAfternoon");
	} else if(hour >= 21 || hour < 5) {
		message = getTrad("greetingsEvening");
	}
	getFromStorage('username',function(data){
		if(!data || data.length > 0 || data.length === 0 || typeof data.username === 'undefined' || data.username == '') {
			var input = $('<input />');
			input.on('keydown', function(e){
				if (e.keyCode == 13) {
					setInStorage('username', this.value, function(setData){
						updateGreetings();
					});
				}
			});
			$('#greetings').html(message+', ');
			$('#greetings').append(input);
		} else {
			$('#greetings').html(message+', '+data.username);
		}
	});
}

function updateWeather() {
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

// ================ GETTERS ================

function getLocation(callback) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position){
			callback(position.coords);
		});
	} else {
		console.info( "Geolocation is not supported by this chrome.");
	}
}

function getWeatherIcon(id) {
	
	var icons = [];

	//https://openweathermap.org/weather-conditions
	//https://erikflowers.github.io/weather-icons/

	icons[200] = "wi-day-thunderstorm";
	icons[800] = "wi-day-sunny";
	icons[801] = "wi-day-cloudy";

	if(icons[id] == undefined) {
		return "wi-alien";
	}
	return icons[id];
}

function getFromStorage(field, callback) {
	chrome.storage.local.get(field,callback);
}

function getTrad(key) {
	return chrome.i18n.getMessage(key);
}

// ================ SETTERS ================

function setInStorage(field, value, callback) {
	var obj = {};
	obj[field] = value;
	chrome.storage.local.set(obj,callback);
}

// ================ UTIL ================

function isInStorage(data, field) {
	return data && data.length > 0 && typeof data[field] !== 'undefined' &&(data[field] != '' || data[field].length > 0);
}

function normalizeTemp(temp) {
	return Math.round(temp * 10)/10 + "º";
}

function deleteAllStorage() {
	storageFields.forEach(function(value, key){
		setInStorage(value, '');
	});
}
