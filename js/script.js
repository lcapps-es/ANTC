$(document).ready(function(){
	$('#background').css('background-image', "url('https://source.unsplash.com/random/1920x1080')").waitForImages(function() {
		$('#background').addClass('show');
	}, $.noop, true);

	updateClock();
	//updateGreetings();

	$('#search input').keypress(function(e) {
		if(e.which == 13) {
			e.preventDefault();
			top.location = 'https://www.google.com/search?q='+$(this).val();
		}
	});
});

function updateClock() {
    var now = new Date(); // current date
	time = ("0" + now.getHours()).slice(-2) + ':' + ("0" + now.getMinutes()).slice(-2) + ':' + ("0" + now.getSeconds()).slice(-2);

    // set the content of the element with the ID time to the formatted string
    $('#clock h1').html(time);

    // call this function again in 1000ms
    setTimeout(updateClock, 1000);
}