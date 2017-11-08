class App extends Base {

	constructor() {

		super();

		this.factories = {};
		this.factories.settings = new Settings();
		this.factories.weather = new Weather();
		this.factories.links = new Links();

		this.updateClock();
		this.updateGreetings();
		this.updateBackground();

		this.setEvents();

	}

	updateClock() {
		var now = new Date(); // current date
		var time = ("0" + now.getHours()).slice(-2) + ' : ' + ("0" + now.getMinutes()).slice(-2) + ' : ' + ("0" + now.getSeconds()).slice(-2);
		$('#clock h1').html(time);
		//this.updateGreetings();
		setTimeout(this.updateClock.bind(this), 1000);
	}

	updateGreetings() {
		let self = this;
		var now = new Date();
		var hour = now.getHours();
		var message = '';
		if(hour >= 5 && hour < 12) {
			message = this.getTrad("greetingsMorning");
		} else if(hour >= 12 && hour < 21) {
			message = this.getTrad("greetingsAfternoon");
		} else if(hour >= 21 || hour < 5) {
			message = this.getTrad("greetingsEvening");
		}

		this.getFromStorage('username',function(data){
			if(self.isInStorage(data, 'username')) {
				$('#greetings').html(message+', '+data.username);
				$('input[name="name"]').val(data.username);
			} else {
				var input = $('<input />');
				input.on('keydown', function(e){
					self.factories.settings.changeName(e, this.value, self.updateGreetings.bind(self));
				});
				$('#greetings').html(message+', ');
				$('#greetings').append(input);
				$('input[name="name"]').val('');
			}
		});
	
		this.getFromStorage('extendWeather',function(data){
			if(data.extendWeather !== undefined && data.extendWeather === true) {
				$("#settings input[name='extendWeather']").click();
			}
		});
		
	}


	updateBackground() {
		let self = this;
		this.getFromStorage('background', function(data){
			if(self.isInStorage(data, 'background')) {
				// Tengo fondo, se pone
				$('#background').css('background-image', 'url("'+data.background.img+'")').waitForImages(function() {
					$('#background').addClass('show');
					self.cacheBackground(false);
				}, $.noop, true);
			} else {
				self.cacheBackground(true);
			}
		});
	}


	cacheBackground(reload = false) {
		let self = this;
		var photo = new UnsplashPhoto();
		var url = photo.fromCategory('nature')/*.of(["trees", "water"])*/.size(1920,1080).fetch();

		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			var reader = new FileReader();
			reader.onloadend = function() {

				var now = new Date();
				self.setInStorage('background', {img: reader.result, timestamp: now.getTime()},function() {
					if(reload) {
						self.updateBackground();
					}
				});
			}
			reader.readAsDataURL(xhr.response);
		};
		xhr.open('GET', url);
		xhr.responseType = 'blob';
		xhr.send();
	}

	setEvents() {
		var self = this;
		$('input[name="name"]').on('keydown', function(e){
			self.factories.settings.changeName(e, this.value, self.updateGreetings.bind(self));
		});
	}

}



$(document).ready(function(){
	top.app = new App();
	//app.deleteAllStorage();
});