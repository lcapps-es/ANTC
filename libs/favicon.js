//shortcut icon

class Favicon {

	get(url, callback) {
		$.get(url).done(function(response) {
			var html = $(response);
			html.find('link').each(function(k,v){
				if(v.attr('rel').indexOf('icon') >= 0) {
					callback(v.attr('href'));
					return false;
				}
			});
		});
	}
}