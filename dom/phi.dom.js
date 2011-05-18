(function(dom) {
	
	
	
	var phi = window.phi || {};
	
	var dom = phi.dom = {
		requestAnimationFrame: function() {
			return 	window.requestAnimationFrame       || 
			      	window.webkitRequestAnimationFrame || 
	              	window.mozRequestAnimationFrame    || 
	              	window.oRequestAnimationFrame      || 
	              	window.msRequestAnimationFrame     || 
	              	function(callback, element) {
	                	window.setTimeout(callback, 1000 / 60);
	              	};
		}
	};
	
	
	
	/**
	 *
	 * A basic template parser to create new Nodes as a string
	 *
	 *
	 */
	
	var Template = phi.dom.Template = new Class({
		
		_init: function(html) {
			this.set(html);
		},
		
		/**
		 *
		 * parses through data to generate html as a string, replacing any variables between brackets, i.e. {{my.var}}
		 *
		 * @param data {Object} 	the data to pass through the object
		 * @param parent {String} 	the name of the parent of a data point, when using recursive looping in nested data
		 * @param html {String} 	the (partially) generated HTML if data is nested
		 *
		 * @return html {String}	the generated HTML
		 *
		 */
		
		parse: function(data, parent, html) {
			
			var html = html || this.get();
			var a = (parent) ? parent + "." : "";
			var b = (parent) ? parent + "\\.":"";
			
			for (var name in data){
				if (typeof name === 'string'){
					var property = new RegExp('\\{{' + b + name + '\\}}', 'g');
					if (typeof data[name] === 'object') {
						html = this.parse(data[name], a + name, html);
					} else {
						html = html.replace(property, data[name]);
					}
				}
			}
			
			return html;
			
		},
		
		/**
		 *
		 * set the base template
		 *
		 * @param html {String} 	the base template to parse over
		 *
		 */
		
		set: function(html) {
			this.html = html;
		},
		
		/**
		 *
		 * gets the base template
		 *
		 * @returns html {String}	 	the base template to parse over
		 *
		 */
		
		get: function() {
			return this.html;
		}
		
	});
	
	
})(jQuery);