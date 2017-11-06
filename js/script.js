
var newsSource = [];
newsSource.push({key: "20min", name: "20 minutos", url: "http://www.20minutos.com/rss/", icon: "20minutos.png"});
newsSource.push({key: "elmundo", name: "El Mundo", url: "http://estaticos.elmundo.es/elmundo/rss/portada.xml", icon: "elmundo.png"});
newsSource.push({key: "emt", name: "El Mundo Today", url: "http://www.elmundotoday.com/feed/", icon: "emt.png"});
newsSource.push({key: "elpais", name: "El Pais", url: "http://ep00.epimg.net/rss/tags/ultimas_noticias.xml", icon: "elpais.png"});


$(document).ready(function(){

	updateTrads();
	updateBackground();
	updateClock();
	updateGreetings();
	updateWeather();
	updateLinks();
	updateNews();
	loadNewsSource();
	
	$('#weather, #miniweather').on('click', function(e){
		$('#weather, #miniweather').toggle();
	});
	$('#settingsButton').on('click', function(e){
		$(this).hide();
		$('#settings').css('left', 0);
	});
	$('#close-settings').on('click', function(e){
		$('#settings').css('left', '').on('transitionend', function(){
			if(parseInt($('#settings').css('left')) < 0) {
				$('#settingsButton').show();
			}
		});
	});
	$('input[name="location"]').on('keypress', function(e){
		setLocation(e, this.value);
	});
	$('input[name="name"]').on('keydown', function(e){
		changeName(e, this.value)
	});
	$('#deleteData').on('click', function(e){
		var c = confirm('All data will be deleted. Do you wish to continue?');
		if(c) {
			deleteAllStorage();
		}
	});
	$("#settings input[type='checkbox']").click(function(){		
		setInStorage($(this).attr('name'), $(this).is(":checked"));
	});
	$('input[name="newLinkUrl"]').on('keypress', function(e){
		if(e.which == 13) {
			setLink($('input[name="newLinkUrl"]').val());
			$('input[name="newLinkUrl"]').val('');
		}
	});

	// SETTINGS
	if(typeof chrome.app != 'undefined') {
		var author = chrome.app.getDetails().author;
		var version = chrome.app.getDetails().version_name;
		$("#footer").html(author + " ~ " + version);
	}

});

$(document).mouseup(function(e) 
{
    var container = $("#weather");

	// if the target of the click isn't the container nor a descendant of the container
    if (!$("#weather").is(e.target) && $("#weather").has(e.target).length === 0 && $("#weather").is(':visible')) {
        $("#weather").click();
    } else if(!$("#settings").is(e.target) && $("#settings").has(e.target).length === 0 && parseInt($("#settings").css('left')) == 0) {
		$('#close-settings').click();
	}
});

// ================ MAIN FUNCTIONS ================

function updateBackground() {
	getFromStorage('background', function(data){
		if(isInStorage(data, 'background')) {
			// Tengo fondo, se pone
			$('#background').css('background-image', 'url("'+data.background.img+'")').waitForImages(function() {
				$('#background').addClass('show');
				cacheBackground(false);
			}, $.noop, true);
		} else {
			cacheBackground(true);
		}
	});
}

function updateClock() {
    var now = new Date(); // current date
	time = ("0" + now.getHours()).slice(-2) + ' : ' + ("0" + now.getMinutes()).slice(-2) + ' : ' + ("0" + now.getSeconds()).slice(-2);
    $('#clock h1').html(time);
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
		if(isInStorage(data, 'username')) {
			$('#greetings').html(message+', '+data.username);
			$('input[name="name"]').val(data.username);
		} else {
			var input = $('<input />');
			input.on('keydown', function(e){
				changeName(e, this.value)
			});
			$('#greetings').html(message+', ');
			$('#greetings').append(input);
			$('input[name="name"]').val('');
		}
	});

	getFromStorage('extendWeather',function(data){
		if(data.extendWeather !== undefined && data.extendWeather === true) {
			$("#settings input[name='extendWeather']").click();
		}
	});

	
}

function updateWeather() {
	var path = "https://api.openweathermap.org/data/2.5/weather?appid=45dc870e41c6c3980d4d1e446bf6d079&units=metric&lang=es";

	getFromStorage('location',function(data){
		if(isInStorage(data, 'location')) {
			$('input[name="location"]').val(data.location);
			var url = path + '&q=' + data.location;
			setHTMLWeather(url);
		} else {
			getLocation(function(pos){
				var url = path + "&lat=" + pos.latitude + "&lon=" + pos.longitude;
				setHTMLWeather(url);
			});
		}
	});
}

function setHTMLWeather(url) {
	$.get({
		url: url,
	}).done(function(response){
		$('#location').text(response.name);
		$('#tempnow').text(normalizeTemp(response.main.temp));
		$('#others').text(normalizeTemp(response.main.temp_min)+' / '+normalizeTemp(response.main.temp_max));
		response.weather.forEach(function(value, key){
			console.info("Weather: "+value.description+" ("+value.id+")");
			if($("i."+getWeatherIcon(value.id)).length == 0) {
				$('#sumicon').html('<i class="wi '+getWeatherIcon(value.id)+'"></i>');
				$('#miniicon').html('<i class="wi '+getWeatherIcon(value.id)+'"></i>');
			}
		});
		$('#humValue').text(response.main.humidity+" ");
		$('#windValue').text(response.wind.speed);
		var dir = getWindDirection(response.wind.deg);
		$('#windSpeed > i').addClass("towards-"+dir+"-deg");
		
		$('#minitemp').text(normalizeTemp(response.main.temp));

		getFromStorage('extendWeather',function(data){
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

function updateLinks() {
	$('#linkbar').html('');
	$('#linkList').html('');
	getFromStorage('links',function(data){
		if(isInStorage(data, 'links')) {
			console.log(data);
			data.links.forEach(function(value, key){
				if(value) {
					var a = $('<a>');
					a.prop('href', value.link);
					var img = $('<img>');
					img.prop('src', 'https://icons.better-idea.org/icon?size=64&url='+value.link);
					a.append(img);
					$('#linkbar').append(a);
					var save = $('<i class="material-icons" data-key="'+key+'">save</i>');
					save.on('click', function(e){
						setLink($('input[name="linkUrl'+$(this).data('key')+'"]').val(), $(this).data('key'));
					});
					var close = $('<i class="material-icons" data-key="'+key+'">close</i>');
					close.on('click', function(e){
						deleteLink($(this).data('key'));
					});
					var p = $('<p>');
					var inputUrl = $('<input>');
					inputUrl.prop('name', 'linkUrl'+key);
					inputUrl.prop('type', 'text');
					inputUrl.val(value.link);
					p.append(inputUrl);
					p.append(' ');
					p.append(save);
					p.append(close);
					$('#linkList').append(p);
				}
			});
		}
	});
}

function loadNewsSource() {

	$(newsSource).each(function(elem){
		$("p#news").next("ul").append("<li><input class='news' type='checkbox' name='news[]' value='"+this.key+"' /> "+this.name+"</li>");
	});


	$("input.news").change(function() {

		var n = [];
		$("input.news:checked").each(function(){
			n.push($(this).val());
		});

		setInStorage("news", n, function(){
			console.log(n);
		});


		getFromStorage('news', function(data){
			if(isInStorage(data, 'news')) {
				//console.log(data);
				updateNews();
			}	
		});
	});

}

function updateNews() {

	$(".marquee > p").text("");

	getFromStorage('news', function(data){
		if(isInStorage(data, 'news')) {
			$(data.news).each(function(e){
				var _k = this;
				$(newsSource).each(function(elem){
					if(this.key == _k) {
						console.log(this.name);
						getNews(this.url, this.icon);
					}
				});

			})
		}
	});

	//getNews("http://www.20minutos.com/rss/");
	//getNews("http://www.20minutos.com/rss/", "20minutos.png");
	//getNews("http://www.elmundotoday.com/feed/", "emt.png");


}

function getNews( rss, img = null) {

	$.get({
		url: "https://api.rss2json.com/v1/api.json",
		data : {
			rss_url: rss,
			api_key: "oogqwcfxocr0aisyxknad6erosucxt3kprkwsmhn"
		}
/*
//https://antc-rss-json.herokuapp.com/?rss
		url: "https://adrianmora.me/rss.php",
		data : {
			rss: rss
		}
		*/
	}).done(function(response){
		console.log(response);
		
		if(response != undefined && response.status != undefined && response.status == "ok" && response.items != undefined) {
			var max = 10;
			$(".marquee").show();

			for(var i = 0; i < response.items.length && i < max; i++ ) {
				var link = (img == null) ? "<i class='material-icons'>sms_failed</i>" : "<img src='../img/news/"+img+"' />";
				link += "<a href='"+response.items[i].guid+"'>"+response.items[i].title+"</a>";					
				$(".marquee > p").append(link);
			}
		} 

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

function cacheBackground(reload = false) {
	var photo = new UnsplashPhoto();
	var url = photo.fromCategory('nature')/*.of(["trees", "water"])*/.size(1920,1080).fetch();

	var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {

			var now = new Date();
			setInStorage('background', {img: reader.result, timestamp: now.getTime()},function() {
				if(reload) {
					updateBackground();
				}
			});
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

function setLocation(e, location) {
	if(e.which == 13) {
		setInStorage('location', location, function(){
			updateWeather();
		});
	}
}

function changeName(e, value) {
	if (e.keyCode == 13) {
		setInStorage('username', value, function(setData){
			updateGreetings();
		});
	}
}

function setLink(link, key) {
	getFromStorage('links',function(data){
		if(!isInStorage(data, 'links')) {
			data.links = [];
		}
		if(link.indexOf('http://') != 0 && link.indexOf('https://') != 0) {
			link = 'http://'+link;
		}
		if(typeof key != 'undefined') {
			data.links[key] = {link: link};
		} else {
			data.links.push({link: link});
		}
		setInStorage('links', data.links, function(){
			updateLinks();
		});
	});
}

function deleteLink(key) {
	getFromStorage('links',function(data){
		if(!isInStorage(data, 'links')) {
			data.links = [];
		}
		if(typeof data.links[key] != 'undefined') {
			delete data.links[key];
		}
		setInStorage('links', data.links, function(){
			updateLinks();
		});
	});
}

// ================ UTIL ================

function isInStorage(data, field) {
	return data && typeof data[field] !== 'undefined' && ((typeof data[field] == 'string' && data[field] != '') || (typeof data[field] == 'object' && !$.isEmptyObject(data[field])));
}

function normalizeTemp(temp) {
	return Math.round((temp * 10)/10) + "º";
}

function deleteAllStorage() {
	setInStorage('username', '');
	setInStorage('background', {});
	setInStorage('location', '');
	setInStorage('links', []);
	location.reload();
}

function updateTrads() {
	var trads = $.find("[trad]");
	$( $.find("[trad]")).each(function(){
		var trad = getTrad($(this).attr("trad"));
		$(this).text(trad);
	});
}

function getWindDirection(value) {
	var t = Math.ceil(value / (45/2));
	return ((Math.ceil(t / 2) * 23) + (Math.floor(t / 2) * 22));
}
