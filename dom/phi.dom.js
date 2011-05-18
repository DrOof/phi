/**
 *
 * Phi Core - A multi-paradigm JavaScript library
 *
 *
 *
 * Copyright (c) 2010 Authors of PHI
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 *
 */


(function() {
	
	
	
	var phi = window.phi || {};
	
	
	
	/**
	 *
	 * A wrapper around jQuery/Sizzle
	 *
	 */
	
	var dom = phi.dom = function(selector) {
		return jQuery(selector);
	};
	
	
	
	
	/**
	 *
	 * requests an animation frame using native methods or setTimeout as a fallback
	 *
	 * @param callback {Function}	the callback function to apply
	 * @param element {HTMLNode}	the node to which the animation applies
	 *
	 */
	
	phi.dom.requestAnimationFrame = (function(){
	      return  window.requestAnimationFrame       || 
	              window.webkitRequestAnimationFrame || 
	              window.mozRequestAnimationFrame    || 
	              window.oRequestAnimationFrame      || 
	              window.msRequestAnimationFrame     || 
	              function(callback, element) {
			window.setTimeout(callback, 1000 / 60);
	              };
	})();
	
	
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
	
	
})();
