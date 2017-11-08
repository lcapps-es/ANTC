class Weather extends Base {

	constructor() {
		super();

		this.updateWeather();

		this.setEvents();
	}
	

	updateWeather() {
		let self = this;
		var path = "https://api.openweathermap.org/data/2.5/weather?appid=45dc870e41c6c3980d4d1e446bf6d079&units=metric&lang=es";
	
		this.getFromStorage('location',function(data){
			if(self.isInStorage(data, 'location')) {
				$('input[name="location"]').val(data.location);
				var url = path + '&q=' + data.location;
				self.setHTMLWeather(url);
			} else {
				self.getLocation(function(pos){
					var url = path + "&lat=" + pos.latitude + "&lon=" + pos.longitude;
					self.setHTMLWeather(url);
				});
			}
		});
	}


	setHTMLWeather(url) {
		let self = this;

		$.get({
			url: url,
		}).done(function(response){
			$('#location').text(response.name);
			$('#tempnow').text(self.normalizeTemp(response.main.temp));
			$('#others').text(self.normalizeTemp(response.main.temp_min)+' / '+self.normalizeTemp(response.main.temp_max));
			response.weather.forEach(function(value, key){
				console.info("Weather: "+value.description+" ("+value.id+")");
				if($("i."+self.getWeatherIcon(value.id)).length == 0) {
					$('#sumicon').html('<i class="wi '+self.getWeatherIcon(value.id)+'"></i>');
					$('#miniicon').html('<i class="wi '+self.getWeatherIcon(value.id)+'"></i>');
				}
			});
			$('#humValue').text(response.main.humidity+" ");
			$('#windValue').text(response.wind.speed);
			var dir = self.getWindDirection(response.wind.deg);
			$('#windSpeed > i').addClass("towards-"+dir+"-deg");
			
			$('#minitemp').text(self.normalizeTemp(response.main.temp));
	
			self.getFromStorage('extendWeather',function(data){
				if(data.extendWeather !== undefined && data.extendWeather === true) {
					$('#weather').show();
					$('#miniweather').hide();
				} else {
					$('#miniweather').show();
					$('#weather').hide();
				}
			});
		});
	}
	

	setLocation(e, location) {
		let self = this;

		if(e.which == 13) {
			this.setInStorage('location', location, function(){
				self.updateWeather();
			});
		}
	}

	getLocation(callback) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position){
				callback(position.coords);
			});
		} else {
			console.info( "Geolocation is not supported by this chrome.");
		}
	}

	getWeatherIcon(id) {
		//https://openweathermap.org/weather-conditions
		//https://erikflowers.github.io/weather-icons/
		
		var icons = [];
	
		icons[200] = "wi-storm-showers";
		icons[210] = "wi-thunderstorm";
		icons[211] = "wi-thunderstorm";
		icons[212] = "wi-thunderstorm";
	
		icons[300] = "wi-hail";
	
		icons[500] = "wi-hail";
		icons[520] = "wi-rain";
		icons[521] = "wi-rain";
		icons[522] = "wi-rain";
		icons[531] = "wi-rain";
	
		icons[600] = "wi-snow";
	
		icons[700] = "wi-fog";
	
		icons[800] = "wi-day-sunny";
		icons[801] = "wi-cloudy";
		icons[802] = "wi-cloudy";
		icons[803] = "wi-cloudy";
		icons[804] = "wi-cloudy";
	
		icons[900] = "wi-tornado";
		icons[901] = "wi-night-alt-rain";
		icons[902] = "wi-hurricane";
		icons[903] = "wi-snowflake-cold";
		icons[904] = "wi-hot";
		icons[905] = "wi-windy";
		icons[906] = "wi-hail";
	
		if(icons[id] == undefined) {
			var generic = parseInt(id.toString().charAt(0)+'00');
			if(icons[generic] == undefined) {
				return "wi-alien";
			} else {
				return icons[generic];
			}
		} else {
			return icons[id];
		}
	}


	getWindDirection(value) {
		var t = Math.ceil(value / (45/2));
		return ((Math.ceil(t / 2) * 23) + (Math.floor(t / 2) * 22));
	}


	normalizeTemp(temp) {
		return Math.round((temp * 10)/10) + "º";
	}

	setEvents() {
		let self = this;

		$('#weather, #miniweather').on('click', function(e){
			$('#weather, #miniweather').toggle();
		});

		$('input[name="location"]').on('keypress', function(e){
			self.setLocation(e, this.value);
		});
	}




}