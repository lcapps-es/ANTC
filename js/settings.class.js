/**
 * Barra de configuracion
 */
class Settings extends Base {

	constructor() {
		super();

		if(typeof chrome.app != 'undefined') {
			var author = chrome.app.getDetails().author;
			var version = chrome.app.getDetails().version_name;
			$("#footer").html(author + " ~ " + version);
		}

		this.setEvents();
		this.getWallpaperList();
	}


	changeName(e, value, callback) {
		if (e.keyCode == 13) {
			this.setInStorage('username', value, function(setData) {
				if(typeof callback == "function") {
					callback();
				}
			});
		}
	}

	getSettingLikedBackgrounds(callback) {
		let self = this;
		this.getFromStorage('showLikedBackgrounds', function(data){
			if(self.isInStorage(data, 'showLikedBackgrounds')) {
				if(data.showLikedBackgrounds) {
					callback(true);
				} else {
					callback(false);
				}
			} else {
				callback(false);
			}
		});
	}

	setEvents() {
		$('#settingsButton, #close-settings').on('click', function(e){
			$('#settings').toggle();
		});

		$('#settingsTabs li').on('click', function(e){
			$('#tabContent section').hide();
			$('#tabContent section').removeClass('show');
			$('#settingsTabs li').removeClass('active');
			$('#tabContent section#'+$(this).data('tab')).show();
			$('#tabContent section#'+$(this).data('tab')).addClass('show');
			$(this).addClass('active');
		});
		
		$('#deleteData').on('click', function(e){
			var c = confirm(top.app.getTrad('deleteData'));
			if(c) {
				top.app.deleteAllStorage();
			}
		});

		this.getSettingLikedBackgrounds(function(bool){
			if(bool) {
				$("#settings input[name='showLikedBackgrounds']").prop('checked', true);
			}
		});

		$("#settings input[name='extendWeather']").click(function(){
			top.app.setInStorage($(this).attr('name'), $(this).is(":checked"));
		});

		$("#settings input[name='showLikedBackgrounds']").click(function(){
			top.app.setInStorage($(this).attr('name'), $(this).is(":checked"));
			top.app.cacheBackground();
		});

		$('input[name="newLinkUrl"]').on('keypress', function(e){
			if(e.which == 13) {
				top.app.factories.links.setLink($('input[name="newLinkUrl"]').val());
				$('input[name="newLinkUrl"]').val('');
			}
		});

		$('#tabContent section#generalTab').show();
		$('#tabContent section#generalTab').addClass('show');
	}

	getWallpaperList() {
		let self = this;
		$('#wallpaperList').html('');
		this.getFromStorage('bgBookmarks', function(data){
			if(self.isInStorage(data, 'bgBookmarks')) {
				console.log(data);
				var photo = new WallhavenApi();
				data.bgBookmarks.forEach(function(element){
					var a = $('<a>');
					a.prop('href', photo.getFullImageURL(element));
					a.prop('target', '_blank');
					var img = $('<img>');
					img.prop('src', photo.getThumbImageURL(element));
					var close = $('<i class="material-icons" data-id="'+element+'">close</i>');
					close.on('click', function(e){
						var _w = $(this).prev('a').width();
						var _id = $(this).data('id');
						$(this).replaceWith("<div id='" + $(this).data('id') + "' class='deleteDiv'></div>");
						$("#"+_id).width(_w);
						// IMPORTANTE: El tiempo debe ser igual al del efecto definido en los estilos
						setTimeout(function(){
							top.app.removeLikeBackground(_id);
						}, 400);
					});
					a.append(img);
					var div = $('<div>');
					div.addClass('col-4');
					div.append(a);
					div.append(close);
					$('#wallpaperList').append(div);
				});
			}
		});
	}
	
}