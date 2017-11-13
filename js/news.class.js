class News extends Base {
	constructor() {
		super();
		this.newsSource = [];
		this.newsSource.push({key: "20min", name: "20 minutos", url: "http://www.20minutos.com/rss/", icon: "20minutos.png"});
		this.newsSource.push({key: "elmundo", name: "El Mundo", url: "http://estaticos.elmundo.es/elmundo/rss/portada.xml", icon: "elmundo.png"});
		this.newsSource.push({key: "emt", name: "El Mundo Today", url: "http://www.elmundotoday.com/feed/", icon: "emt.png"});
		this.newsSource.push({key: "elpais", name: "El Pais", url: "http://ep00.epimg.net/rss/tags/ultimas_noticias.xml", icon: "elpais.png"});
		this.newsSource.push({key: "marca", name: "Marca", url: "http://estaticos.marca.com/rss/portada.xml", icon: "marca.png"});
		
		this.randomNews = [];
		
		this.callRss = 0;
		this.currentRss = 0;
		this.loopPrint = 0;
		this.flagCall = true;

		this.loadNewsSource();
		this.updateNews();
	}

	loadNewsSource() {
		var self = this;
		$(this.newsSource).each(function(elem){
			$("ul#newsList").append("<li><input class='news' type='checkbox' name='news[]' key='"+this.key+"' value='"+this.key+"' /> "+this.name+"</li>");
		});

		this.getFromStorage('news', function(data){
			if(self.isInStorage(data, 'news')) {
				$(data.news).each(function(elem){
					$("input[key="+this+"]").prop('checked', true);
				});
			}
		});

		$("input.news").change(function() {
			var n = [];
			$("input.news:checked").each(function(){
				n.push($(this).val());
			});
	
			top.app.factories.news.setInStorage("news", n, function(){
				top.app.factories.news.updateNews();
			});
		});
	}

	getNews( rss, key, img = null) {
		var self = this;
		$.get({
			
			url: "https://api.rss2json.com/v1/api.json",
			//url: "https://antc-rss-json.herokuapp.com/",
			//url: "https://antc-rss-json.herokuapp.com/?rss",
			data : {
				rss_url: rss,
				rss: rss,
				api_key: "oogqwcfxocr0aisyxknad6erosucxt3kprkwsmhn"
			}
			
		}).done(function(response){
			console.log(rss, response);
			
			self.currentRss++;
	
			if(response != undefined && response.status != undefined && response.status == "ok" && response.items != undefined) {
				var max = 10;
				$(".marquee").show();
	
				for(var i = 0; i < response.items.length && i < max; i++ ) {
					var icon = (img == null) ? "<i class='material-icons'>sms_failed</i>" : "<img src='/img/news/"+img+"' />";
					var link = "<a href='"+response.items[i].guid+"'>"+response.items[i].title+"</a>";
					
					self.randomNews.push({icon: icon, title: link, key: key});
				}
			}
		});
	}
		

	processNews(key = null) {
		var self = this;
		$(this.randomNews).each(function(ind){
			if(this.key != key) {
				key = this.key;
				var t = this;
				self.randomNews.splice(ind,1);	
				$(".marquee > p").append(t.icon + t.title);
			}
		});

		if(this.randomNews.length > 0) {
			this.processNews();
		}
	}
		
	printNews() {
		let self = this;
		if(this.currentRss == this.callRss && this.flagCall) {
			this.flagCall = false;
			this.processNews();
		} else if(this.flagCall) {
			setTimeout(function() {self.printNews.call(self);}, 500);
		}
	}

	updateNews() {
		let self = this;
		this.flagCall = true;
		this.randomNews = [];

		this.getFromStorage('news', function(data){
			if(self.isInStorage(data, 'news')) {
				$(data.news).each(function(e){
					var _k = this;
					$(self.newsSource).each(function(elem){
						if(this.key == _k) {
							self.callRss++;
							self.getNews.call(self, this.url, this.key, this.icon);
						}
					});
				});
				self.printNews.call(self);
			}
		});
	}

	loadNewsSource() {
		var self = this;
		$(this.newsSource).each(function(elem){
			$("p#news").next("ul").append("<li><input class='news' type='checkbox' name='news[]' key='"+this.key+"' value='"+this.key+"' /> "+this.name+"</li>");
		});

		this.getFromStorage('news', function(data){
			if(self.isInStorage(data, 'news')) {
				$(data.news).each(function(elem){
					$("input[key="+this+"]").prop('checked', true);
				});
			}	
		});

		$("input.news").change(function() {
			var n = [];
			$("input.news:checked").each(function(){
				n.push($(this).val());
			});

			top.app.factories.news.setInStorage("news", n, function(){
				top.app.factories.news.updateNews();
			});
		});
	}
}