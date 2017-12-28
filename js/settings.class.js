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

		$('#deleteData').on('click', function(e){
			var c = confirm('All data will be deleted. Do you wish to continue?');
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
	}
	
}