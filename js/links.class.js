class Links extends Base {

	constructor() {
		super();

		this.updateLinks();
	}

	updateLinks() {
		let self = this;
		$('#linkbar').html('');
		$('#linkList').html('');
		this.getFromStorage('links',function(data){
			if(self.isInStorage(data, 'links')) {
				data.links.forEach(function(value, key){
					if(value) {
						var a = $('<a>');
						a.prop('href', value.link);
						var img = $('<img>');
						img.prop('src', self.faviconURL+value.link);
						a.append(img);
						$('#linkbar').append(a);
						var save = $('<i class="material-icons" data-key="'+key+'">save</i>');
						save.on('click', function(e){
							top.app.factories.links.setLink($('input[name="linkUrl'+$(this).data('key')+'"]').val(), $(this).data('key'));
						});
						save.addClass('non-draggable');
						var close = $('<i class="material-icons" data-key="'+key+'">close</i>');
						close.on('click', function(e){
							top.app.factories.links.deleteLink($(this).data('key'));
						});
						close.addClass('non-draggable');
						var p = $('<p>');
						var inputUrl = $('<input>');
						inputUrl.prop('name', 'linkUrl'+key);
						inputUrl.prop('type', 'text');
						inputUrl.addClass('non-draggable');
						inputUrl.val(value.link);
						p.append(inputUrl);
						p.append(' ');
						p.append(save);
						p.append(close);
						p.append('<span class="handler"><i class="material-icons">drag_handle</i></span>')
						$('#linkList').append(p);
					}
				});
				$('#linkList').sortable({
					handler: '.handler',
					filter: '.non-draggable',
					animation: 150,
					onEnd: top.app.factories.links.reorderLinks
				});
			}
		});
	}

	setLink(link, key) {
		let self = this;
		this.getFromStorage('links',function(data){
			if(!self.isInStorage(data, 'links')) {
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
			self.setInStorage('links', data.links, function(){
				self.updateLinks();
			});
		});
	}

	reorderLinks() {
		let self = this;
		var links = [];
		$('#linkList input').each(function(index, element){
			links.push({link: $(element).val()});
		});
		top.app.setInStorage('links', links, function(){
			top.app.factories.links.updateLinks();
		});
	}

	deleteLink(key) {
		let self = this;
		this.getFromStorage('links',function(data){
			if(!self.isInStorage(data, 'links')) {
				data.links = [];
			}
			if(typeof data.links[key] != 'undefined') {
				delete data.links[key];
			}
			self.setInStorage('links', data.links, function(){
				self.updateLinks();
			});
		});
	}

	
}