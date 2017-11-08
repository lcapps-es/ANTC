

class News extends Base {


	constructor() {

		var newsSource = [];
		newsSource.push({key: "20min", name: "20 minutos", url: "http://www.20minutos.com/rss/", icon: "20minutos.png"});
		newsSource.push({key: "elmundo", name: "El Mundo", url: "http://estaticos.elmundo.es/elmundo/rss/portada.xml", icon: "elmundo.png"});
		newsSource.push({key: "emt", name: "El Mundo Today", url: "http://www.elmundotoday.com/feed/", icon: "emt.png"});
		newsSource.push({key: "elpais", name: "El Pais", url: "http://ep00.epimg.net/rss/tags/ultimas_noticias.xml", icon: "elpais.png"});
		newsSource.push({key: "marca", name: "Marca", url: "http://estaticos.marca.com/rss/portada.xml", icon: "marca.png"});
		
		var randomNews = [];
		
		var callRss = 0;
		var currentRss = 0;
		var loopPrint = 0;
		var flagCall = true;
		


	}

	loadNewsSource() {
	
		$(newsSource).each(function(elem){
			$("p#news").next("ul").append("<li><input class='news' type='checkbox' name='news[]' key='"+this.key+"' value='"+this.key+"' /> "+this.name+"</li>");
		});
	
		getFromStorage('news', function(data){
			if(isInStorage(data, 'news')) {
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
	
			setInStorage("news", n, function(){
				updateNews();
			});
	
		});

	}

	getNews( rss, key, img = null) {
		
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
			
			currentRss++;
	
			if(response != undefined && response.status != undefined && response.status == "ok" && response.items != undefined) {
				var max = 10;
				$(".marquee").show();
	
				for(var i = 0; i < response.items.length && i < max; i++ ) {
					var icon = (img == null) ? "<i class='material-icons'>sms_failed</i>" : "<img src='../img/news/"+img+"' />";
					var link = "<a href='"+response.items[i].guid+"'>"+response.items[i].title+"</a>";							
					
					randomNews.push({icon: icon, title: link, key: key});
				}
			}
		});
	}
		

	processNews(news, key = null) {

		$(randomNews).each(function(ind){
			if(this.key != key) {
				key = this.key;
				var t = this;
				randomNews.splice(ind,1);	
				$(".marquee > p").append(t.icon + t.title);
			}
		});

		if(randomNews.length > 0) {
			processNews();
		}
	}
		
	printNews() {

		if(currentRss == callRss && flagCall) {
			flagCall = false;
			processNews( randomNews );
		} else if(flagCall) {
			setTimeout(printNews, 500);
		}

	}

	updateNews() {

		flagCall = true;
		randomNews = [];

		getFromStorage('news', function(data){
			if(isInStorage(data, 'news')) {
				$(data.news).each(function(e){
					var _k = this;
					$(newsSource).each(function(elem){
						if(this.key == _k) {
							callRss++;
							getNews(this.url, this.key, this.icon);
						}
					});
					printNews();
				});
			}
		});

	}

	loadNewsSource() {

		$(newsSource).each(function(elem){
			$("p#news").next("ul").append("<li><input class='news' type='checkbox' name='news[]' key='"+this.key+"' value='"+this.key+"' /> "+this.name+"</li>");
		});

		getFromStorage('news', function(data){
			if(isInStorage(data, 'news')) {
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

			setInStorage("news", n, function(){
				updateNews();
			});

		});

	}


}