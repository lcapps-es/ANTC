class App extends Base {

	constructor() {

		super();

		this.factories = {};
		this.factories.settings = new Settings();
		this.factories.weather = new Weather();
		this.factories.links = new Links();
		this.factories.news = new News();

		this.updateTrads();

		this.updateClock();
		this.updateGreetings();
		this.updateBackground();

		this.setEvents();

	}

	updateClock() {
		var now = new Date(); // current date
		if((now.getHours() == 5 || now.getHours() == 12 || now.getHours() == 21) && now.getMinutes() == 0 && now.getSeconds() == 0) {
			this.updateGreetings();
		}
		var time = ("0" + now.getHours()).slice(-2) + ' : ' + ("0" + now.getMinutes()).slice(-2) + ' : ' + ("0" + now.getSeconds()).slice(-2);
		$('#clock h1').html(time);
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
	}


	updateBackground() {
		let self = this;
		this.getFromStorage('background', function(data){
			if(self.isInStorage(data, 'background')) {
				// Tengo fondo, se pone
				$('#background').css('background-image', 'url("'+data.background.img+'")').waitForImages(function() {
					$('#background').addClass('show');
					self.cacheBackground(false);
					self.showLikeBackground(data.background.id);
				}, $.noop, true);
			} else {
				self.cacheBackground(true);
			}
		});
	}

	cacheBackground(reload = false) {
		let self = this;
		
		this.factories.settings.getSettingLikedBackgrounds(function(likedBackgrounds){
			if(likedBackgrounds) {
				self.getFromStorage('bgBookmarks', function(data){
					if(self.isInStorage(data, 'bgBookmarks')) {
						var id = data.bgBookmarks[Math.floor(Math.random() * data.bgBookmarks.length)];
						self.getBackground(id);
					}
				});
			} else {
				var photo = new WallhavenApi();
				photo.getByKeyword('nature', {sorting: 'random'}, function(resp){
					if(typeof resp.images != 'undefined') {
						var image = resp.images[0];
						self.getBackground(image.id);
					}
				});
			}
		});
	}

	getBackground(id) {
		let self = this;
		var photo = new WallhavenApi();
		var xhr = new XMLHttpRequest();
		var url = photo.getFullImageURL(id);
		xhr.onload = function() {
			var reader = new FileReader();
			reader.onloadend = function() {

				var now = new Date();
				self.setInStorage('background', {img: reader.result, timestamp: now.getTime(), id: id}, function() {
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

	showLikeBackground(id) {
		let self = this;
		this.getFromStorage('bgBookmarks', function(data){
			if(self.isInStorage(data, 'bgBookmarks')) {
				if(data.bgBookmarks.indexOf(id) >= 0) {
					$('#likeContainer i').text('star');
					$('#likeContainer').click(function(event){
						top.app.removeLikeBackground(id);
					});
				} else {
					$('#likeContainer i').text('star_border');
					$('#likeContainer').click(function(event){
						top.app.addLikeBackground(id);
					});
				}
			} else {
				$('#likeContainer i').text('star_border');
				$('#likeContainer').click(function(event){
					top.app.addLikeBackground(id);
				});
			}
			$('#likeContainer').data('id', id);
		});
	}

	addLikeBackground(id) {
		let self = this;
		this.getFromStorage('bgBookmarks', function(data){
			if(self.isInStorage(data, 'bgBookmarks')) {
				if(data.bgBookmarks.indexOf(id) >= 0) {
					$('#likeContainer i').text('star');
					$('#likeContainer').click(function(event){
						top.app.removeLikeBackground(id);
					});
				} else {
					data.bgBookmarks.push(id);
					self.setInStorage('bgBookmarks', data.bgBookmarks, function() {
						$('#likeContainer i').text('star');
						$('#likeContainer').click(function(event){
							top.app.removeLikeBackground(id);
						});
					});
				}
			} else {
				var bgBookmarks = [id];
				self.setInStorage('bgBookmarks', bgBookmarks, function() {
					$('#likeContainer i').text('star');
					$('#likeContainer').click(function(event){
						top.app.removeLikeBackground(id);
					});
				});
			}
		});
	}

	removeLikeBackground(id) {
		let self = this;
		this.getFromStorage('bgBookmarks', function(data){
			if(self.isInStorage(data, 'bgBookmarks')) {
				var index = data.bgBookmarks.indexOf(id);
				if(index >= 0) {
					data.bgBookmarks.splice(index, 1);
					self.setInStorage('bgBookmarks', data.bgBookmarks, function() {
						$('#likeContainer i').text('star_border');
						$('#likeContainer').click(function(event){
							top.app.addLikeBackground(id);
						});
					});
				} else {
					$('#likeContainer i').text('star_border');
					$('#likeContainer').click(function(event){
						top.app.addLikeBackground(id);
					});
				}
			}
		});
	}

	setEvents() {
		let self = this;
		
		$('input[name="name"]').on('keydown', function(e){
			self.factories.settings.changeName(e, this.value, self.updateGreetings.bind(self))
		});

		//$('#likeContainer').on('click');
		
		$(document).mouseup(function(e) {
			// if the target of the click isn't the container nor a descendant of the container
			if (!$("#weather").is(e.target) && $("#weather").has(e.target).length === 0 && $("#weather").is(':visible')) {
				$("#weather").click();
			} else if(!$("#settings").is(e.target) && $("#settings").has(e.target).length === 0 && parseInt($("#settings").css('left')) == 0) {
				$('#close-settings').click();
			}
		});
		
	}

}



$(document).ready(function(){
	top.app = new App();
	//app.deleteAllStorage();
});