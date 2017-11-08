

class News extends Base {

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