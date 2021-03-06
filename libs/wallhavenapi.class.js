class WallhavenApi {

	constructor() {
		this.baseURL = 'https://antc-wallpaper.lcapps.es';
		this.searchURL = this.baseURL+'/search';
		this.detailsURL = this.baseURL+'/details/';
		//this.fullImageURL = "https://wallpapers.wallhaven.c<c/wallpapers/full/wallhaven-<id>.jpg";
		this.fullImageURL = "https://w.wallhaven.cc/full/<id2>/wallhaven-<id>.jpg";
		this.thumbURL = "https://alpha.wallhaven.cc/wallpapers/thumb/small/th-<id>.jpg";
	}

	getByKeyword(keyword, optionsOrCallback, callback){

		var self = this;

		var limit = (optionsOrCallback.limit != undefined) ? optionsOrCallback.limit : 24;

		var parameters = {};
		if(typeof optionsOrCallback == 'object') {
			parameters = optionsOrCallback;
		}
		
		if (typeof keyword == "string") {
			keyword = keyword.split(",");
		} 
		
		if(!Array.isArray(keyword)) {
			throw "keyword is not array";
		}
		
		var result = [];
		var loop = 0;
		$.each(keyword, function(index, value){
			
			parameters.keyword = value;
			$.get(this.searchURL, parameters).done(function(resp){
				loop++;

				if (resp.images != 'undefined' && resp.images.length > 0) {
					resp.images = resp.images.sort(function (a, b) { return 0.5 - Math.random() })
					result.push(resp.images);
				}

				if(loop == keyword.length) {

					var resp = {images: []};
					for(var i=0; i<limit; i++) {
						var pos = Math.floor(Math.random() * result.length);
						if (result[pos] != undefined) {
							resp.images.push(result[pos].shift());
						}
					}
					
					if(typeof optionsOrCallback == 'function') {
						optionsOrCallback(resp);
					} else if(typeof callback == 'function') {
						callback(resp);
					}
				}
			});
		}.bind(this));
	}

	getDetails(id, callback) {
		var parameters = {};
		parameters.id = id;
		$.get(this.baseURL, parameters).done(function(resp){
			if(typeof callback == 'function') {
				callback(resp);
			}
		});
	}

	getFullImageURL(id) {
		var id2 = id.substring(0, 2);
		return this.fullImageURL.replace('<id>', id).replace('<id2>', id2);
	}

	getThumbImageURL(id) {
		return this.thumbURL.replace('<id>', id);
	}

}
