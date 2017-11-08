

class Base {

	constructor() {

	}
	

	setInStorage(field, value, callback) {
		var obj = {};
		obj[field] = value;
		chrome.storage.local.set(obj,callback);
	}

	getFromStorage(field, callback) {
		chrome.storage.local.get(field,callback);
	}

	isInStorage(data, field) {
		return data && typeof data[field] !== 'undefined' && ((typeof data[field] == 'string' && data[field] != '') || (typeof data[field] == 'object' && !$.isEmptyObject(data[field])));
	}

	deleteAllStorage() {
		this.setInStorage('username', '');
		this.setInStorage('background', {});
		this.setInStorage('location', '');
		this.setInStorage('links', []);
		location.reload();
	}
	
	getTrad(key) {
		return chrome.i18n.getMessage(key);
	}

	updateTrads() {
		let self = this;
		var trads = $.find("[trad]");
		$( $.find("[trad]")).each(function(){
			var trad = self.getTrad($(this).attr("trad"));
			$(this).text(trad);
		});
	}
	
}