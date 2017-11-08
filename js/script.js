/*

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

$(document).mouseup(function(e) {
    var container = $("#weather");

	// if the target of the click isn't the container nor a descendant of the container
    if (!$("#weather").is(e.target) && $("#weather").has(e.target).length === 0 && $("#weather").is(':visible')) {
        $("#weather").click();
    } else if(!$("#settings").is(e.target) && $("#settings").has(e.target).length === 0 && parseInt($("#settings").css('left')) == 0) {
		$('#close-settings').click();
	}
});





*/








