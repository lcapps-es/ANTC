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
		this.printTags();

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
						self.getBackground(id, reload);
					}
				});
			} else {
				var photo = new WallhavenApi();

				var tags = "nature";
				self.getFromStorage('tags', function (data) {
					if (self.isInStorage(data, 'tags')) {
						tags = data.tags;
					}

					photo.getByKeyword(tags, {sorting: 'random', limit: 1}, function(resp){
						if (typeof resp.images != 'undefined' && resp.images.length > 0) {
							var image = resp.images[0];
							self.getBackground(image.id, reload);
						} else {
							photo.getByKeyword("nature", { sorting: 'random', limit: 1 }, function (resp) {
								if (typeof resp.images != 'undefined' && resp.images.length > 0) {
									var image = resp.images[0];
									self.getBackground(image.id, reload);
								}
							});
						}
					});

				});
			}
		});
	}

	getBackground(id, reload = false) {
		let self = this;
		var photo = new WallhavenApi();
		var xhr = new XMLHttpRequest();
		var url = photo.getFullImageURL(id);
		xhr.onload = function() {
			var reader = new FileReader();
			reader.onloadend = function() {

				var now = new Date();
				self.setInStorage('background', {img: reader.result, timestamp: now.getTime(), id: id}, function() {
					console.log("Save next background");
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
					if($('#likeContainer').data('id') == id) {
						$('#likeContainer i').text('star');
						$('#likeContainer').off('click');
						$('#likeContainer').click(function(event){
							top.app.removeLikeBackground(id);
						});
					}
				} else {
					data.bgBookmarks.push(id);
					self.setInStorage('bgBookmarks', data.bgBookmarks, function() {
						if($('#likeContainer').data('id') == id) {
							$('#likeContainer i').text('star');
							$('#likeContainer').off('click');
							$('#likeContainer').click(function(event){
								top.app.removeLikeBackground(id);
							});
						}
					});
				}
			} else {
				var bgBookmarks = [id];
				self.setInStorage('bgBookmarks', bgBookmarks, function() {
					if($('#likeContainer').data('id') == id) {
						$('#likeContainer i').text('star');
						$('#likeContainer').off('click');
						$('#likeContainer').click(function(event){
							top.app.removeLikeBackground(id);
						});
					}
				});
			}
			top.app.factories.settings.getWallpaperList();
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
						if($('#likeContainer').data('id') == id) {
							$('#likeContainer i').text('star_border');
							$('#likeContainer').off('click');
							$('#likeContainer').click(function(event){
								top.app.addLikeBackground(id);
							});
						}
					});
				} else {
					if($('#likeContainer').data('id') == id) {
						$('#likeContainer i').text('star_border');
						$('#likeContainer').off('click');
						$('#likeContainer').click(function(event){
							top.app.addLikeBackground(id);
						});
					}
				}
			}
			top.app.factories.settings.getWallpaperList();
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
			}
		});
	}

	setTag(tag) {

		let self = this;
		tag = tag.toLowerCase();

		this.getFromStorage('tags', function (data) {
			if (!self.isInStorage(data, 'tags')) {
				data.tags = [tag];
			} else {
				if(data.tags.indexOf(tag) === -1) {
					data.tags.push(tag);
				}
			}

			self.setInStorage('tags', data.tags, function () {
				self.printTags();
			});

		});
	}

	printTags() {

		let self = this;		

		this.getFromStorage('tags', function (data) {
			if(self.isInStorage(data, 'tags')) {

				$("#listTags").html('');
				$.each(data.tags, function(i,v){
					$("#listTags").append("<span class='tag' data-tag='"+v+"'>" + v + "<i class='material-icons'>close</i></span>");
				});

				$("#listTags > span > i").click(function(){
					var tag = $(this).parent().data('tag');
					$($(this).parent()).fadeOut("fast", function () {
						var pos = data.tags.indexOf(tag);
						data.tags.splice(pos,1);
						self.setInStorage('tags', data.tags, null);
					});

				});

			}
		});
	}
}

$(document).ready(function(){
	top.app = new App();
	//app.deleteAllStorage();
});