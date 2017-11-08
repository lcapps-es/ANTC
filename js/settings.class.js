/**
 * Barra de configuracion
 */
class Settings extends Base {

	constructor() {
		super();
	}


	changeName(e, value, callback) {
		if (e.keyCode == 13) {
			this.setInStorage('username', value, function(setData) {
				if(typeof callback == "function") {
					callback();
				}
			});
		}
	}
	
}