class Links extends Base {


	setLink(link, key) {
		getFromStorage('links',function(data){
			if(!isInStorage(data, 'links')) {
				data.links = [];
			}
			if(link.indexOf('http://') != 0 && link.indexOf('https://') != 0) {
				link = 'http://'+link;
			}
			if(typeof key != 'undefined') {
				data.links[key] = {link: link};
			} else {
				data.links.push({link: link});
			}
			setInStorage('links', data.links, function(){
				updateLinks();
			});
		});
	}

	updateLinks() {
		$('#linkbar').html('');
		$('#linkList').html('');
		getFromStorage('links',function(data){
			if(isInStorage(data, 'links')) {
				console.log(data);
				data.links.forEach(function(value, key){
					if(value) {
						var a = $('<a>');
						a.prop('href', value.link);
						var img = $('<img>');
						img.prop('src', 'https://icons.better-idea.org/icon?size=16..64..128&url='+value.link);
						a.append(img);
						$('#linkbar').append(a);
						var save = $('<i class="material-icons" data-key="'+key+'">save</i>');
						save.on('click', function(e){
							setLink($('input[name="linkUrl'+$(this).data('key')+'"]').val(), $(this).data('key'));
						});
						var close = $('<i class="material-icons" data-key="'+key+'">close</i>');
						close.on('click', function(e){
							deleteLink($(this).data('key'));
						});
						var p = $('<p>');
						var inputUrl = $('<input>');
						inputUrl.prop('name', 'linkUrl'+key);
						inputUrl.prop('type', 'text');
						inputUrl.val(value.link);
						p.append(inputUrl);
						p.append(' ');
						p.append(save);
						p.append(close);
						$('#linkList').append(p);
					}
				});
			}
		});
	}


	deleteLink(key) {
		getFromStorage('links',function(data){
			if(!isInStorage(data, 'links')) {
				data.links = [];
			}
			if(typeof data.links[key] != 'undefined') {
				delete data.links[key];
			}
			setInStorage('links', data.links, function(){
				updateLinks();
			});
		});
	}

	
}