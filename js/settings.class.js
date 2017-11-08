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

	setEvents() {
		let self = this;		
		
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
				self.deleteAllStorage();
			}
		});

		$("#settings input[type='checkbox']").click(function(){		
			self.setInStorage($(this).attr('name'), $(this).is(":checked"));
		});

		$('input[name="newLinkUrl"]').on('keypress', function(e){
			if(e.which == 13) {
				top.app.factories.links.setLink($('input[name="newLinkUrl"]').val());
				$('input[name="newLinkUrl"]').val('');
			}
		});
	}
	
}