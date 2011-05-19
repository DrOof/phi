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
	
	dom.requestAnimationFrame = (function() {
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
	 * Observer Interface
	 *
	 */

	var Observer = dom.Observer = new Interface({
		notify: function() {}
	});
	
	
	/**
	 *
	 * Observable
	 *
	 */
	
	var Observable = dom.Observable = new Class({

		observers: {},

		subscribe: function(type, observer) {
			
			var observers = this.observers[type];
			if (!observers) {
				observers = [observer];
			} else {
				observers.push(observer);
			}
			this.observers[type] = observers;
			
		},

		unsubscribe: function(observer) {
			
			// remove the observer

		},

		dispatch: function(object) {
			var observers = this.observers[object.type], i;
			for (i = observers.length - 1; i >= 0; i--){
				observers[i].notify(object);
			}
		}

	});



	/**
	 *
	 * The EventDispatcher is a singleton responsible for dispatching events to observers
	 *
	 *
	 */

	var EventDispatcher = dom.EventDispatcher = new (new Class({

		_extends: Observable,
		
		captured: {},
		
		captureEvent: function(type, scope) {
			
			var scope = (scope || document);
			var captured = this.captured[type];
			var bind = false;
			
			if (!captured) {
				captured = [scope];
				bind = true;
			} else {
				for (var i = captured.length - 1; i >= 0; i--){
					if (captured[i] === scope) {
						continue;
					}
					captured.push(scope);
					bind = true;
				};
			}
			
			if (bind) {
				dom(scope).bind(type, this.dispatch.bind(this));
			}
			
			this.captured[type] = captured;
			
		},
		
		releaseEvent: function(type, scope) {
			
		}

	}));


	
	

	/**
	 *
	 * Observer links being clicked
	 *
	 */

	var RelationObserver = dom.RelationObserver = new Class({

		_implements: Observer,

		_init: function(prefix) {
			
			EventDispatcher.captureEvent('click', document);
			EventDispatcher.subscribe('click', this);
			
			this.prefix = prefix || '';
			this.relations = {};
			
		},

		notify: function(e) {
			
			var relation = e.target.getAttribute('rel');
			if (this.prefix.exec(relation)) {
				var action = relation.replace(this.prefix, '').replace('-', '');
				if (action) {
					if (this.relations[action]) {
						this.relations[action](e);
					}
				}
			}
			
		},
		
		add: function(key, fn) {
			this.relations[key] = fn;
		}

	});
	
	
	
	/**
	 *
	 * Observe the user position
	 *
	 */
	
	var PositionObserver = dom.PositionObserver = new Class({
		
		_implements: Observer,
		
		_init: function() {
			
			EventDispatcher.captureEvent('mousemove', document);
			EventDispatcher.subscribe('mousemove', this);
			
			this.relations = [];
			
		},
		
		notify: function(e) {
			for (var i = this.relations.length - 1; i >= 0; i--){
				this.relations[i](e);
			};
		},
		
		add: function(fn) {
			this.relations.push(fn);
		}
		
	});
	
	
	
	
	/**
	 *
	 * Observe changes to the hash
	 *
	 */

	var HashObserver = dom.HashObserver = new Class({

		_implements: Observer,
		
		_init: function(prefix) {
			
			EventDispatcher.captureEvent('hashchange', window);
			EventDispatcher.subscribe('hashchange', this);
			
			this.prefix = /^\#\w*/gi;
			this.relations = {};
			
		},

		notify: function(e) {
			
			var hash = window.location.hash;
			
			if (hash) {
				
				var match = window.location.hash.match(this.prefix);
				if (match.length) {
					var action = match[0].replace(/\#|\?/g, '');
					if (action) {
						if (this.relations[action]) {
							this.relations[action](e);
						}
					}
				}
				
			}
			
		},
		
		add: function(key, fn) {
			
			this.relations[key] = fn;
			
		}

	});
	
	
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
