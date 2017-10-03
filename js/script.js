$(document).ready(function(){
	$('#background').css('background-image', "url('https://source.unsplash.com/random/1920x1080')").waitForImages(function() {
		$('#background').addClass('show');
	}, $.noop, true);

	updateClock();
});

function updateClock() {
    var now = new Date(); // current date
	time = now.getHours() + ':' + ("0" + now.getMinutes()).slice(-2) + ':' + ("0" + now.getSeconds()).slice(-2);

    // set the content of the element with the ID time to the formatted string
    $('#clock h1').html(time);

    // call this function again in 1000ms
    setTimeout(updateClock, 1000);
}