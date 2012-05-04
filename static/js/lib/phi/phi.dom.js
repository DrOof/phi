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
	
	
	
	/**
	 *
	 * 
	 *
	 */
	
	var phi = window.phi || {};
	
	
	
	/**
	 *
	 * A wrapper around jQuery/Sizzle
	 *
	 */
	
	var dom = phi.dom = jQuery;
	
	
	
	/**
	 *
	 * Adds an event listener to a node
	 *
	 * @param node {HTMLElement}	the HTMLElement to bind a callback to (can be a selector as well)
	 * @param type {String}			the type of event to listen and bind a callback to
	 * @param fn {Function}			the callback function to apply
	 *
	 */
	
	dom.addEventListener = function(scope, type, fn) {
		return dom(scope).bind(type, fn);
	};
	
	/**
	 *
	 * sets up ajax to send a custom ajax request headers to allow a controller to return
	 * a specific view (eg. json, html, xml or text).
	 *
	 */
	
	dom.ajaxSetup({
		headers: { 
			'ajax': 'ajax' 
		}
	});
	
	
	/**
	 *
	 * requests an animation frame using native methods or setTimeout as a fallback
	 *
	 * @param callback {Function}	the callback function to apply
	 * @param element {HTMLElement}	the node to which the animation applies
	 *
	 */
	
	window.phiRequestAnimationFrame = (function() {
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
	 * triggers a native event on an HTMLElement
	 *
	 * @param type {String}			the type of event to trigger, i.e. 'click', 'focus', 'blur', etc.
	 *
	 */
	
	Element.prototype.triggerEvent = function(type) {

		if (document.createEvent) {
			var e = document.createEvent('HTMLEvents');
			e.initEvent(type, true, true);
			return this.dispatchEvent(e);
		}

		if (this.fireEvent) {
			return this.fireEvent('on' + type);
		}

	};
	
	
	
	/**
	 *
	 * Requests the browser's full screen mode.
	 *
	 */
	
	Element.prototype.requestFullScreen = (function() {
		return 	Element.prototype.requestFullScreen ||
				Element.prototype.webkitRequestFullScreen ||
				HTMLMediaElement.prototype.mozRequestFullScreen ||
				function() {
					alert('fallback');
				}
	})();
	
	
	
	/**
	 *
	 * Cancels the browser's full screen mode.
	 *
	 */
	
	document.cancelFullScreen = (function() {
		return 	document.cancelFullScreen ||
				document.mozCancelFullScreen ||
				document.webkitCancelFullScreen ||
				function() {
					alert('fallback')
				}
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
			for (i = observers.length - 1; i >= 0; i--) {
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
			
			var captured = this.captured[type];
			var scope = (scope || document);
			var bind = false;
			
			if (!captured) {
				
				captured = [scope];
				bind = true;
				
			} else {
				
				for (var i = captured.length - 1; i >= 0; i--) {
					
					if (captured[i] === scope) {
						continue;
					}
					
					captured.push(scope);
					bind = true;
					
				};
				
			}
			
			if (bind) {
				dom.addEventListener(scope, type, this.dispatch.bind(this));
			}
			
			this.captured[type] = captured;
			
		},
		
		releaseEvent: function(type) {
			
		},
		
		subscribe: function(type, observer, scope) {
			
			var observers = this.observers[type];
			observer.scope = scope;
			
			if (!observers) {
				observers = [observer];
			} else {
				observers.push(observer);
			}
			
			this.observers[type] = observers;
			
		},
		
		dispatch: function(e) {
		
			var observers = this.observers[e.type], i;
			var observer;
			
			for (i = observers.length - 1; i >= 0; i--) {
				
				observer = observers[i];
				if (dom(observer.scope).find(e.target).length) {
					observer.notify(e);
				}
				
			}
			
		}
		

	}));
	
	
	
	
	var DOMObserver = dom.DOMObserver = new Class({
		
		_implements: Observer,
		
		_init: function(prefix) {
			
			EventDispatcher.captureEvent('DOMNodeInserted', document.body);
			EventDispatcher.subscribe('DOMNodeInserted', this);
			
			this.prefix = prefix || '';
			this.relations = {};
			
		},
		
		notify: function(e) {
			
			var target = dom(e.target);
			var relations = this.relations;
			
			for (key in relations) {
				if (target.find(key).length) {
					relations[key](e);
				}
			}
			
		},
		
		add: function(key, fn) {
			this.relations[key] = fn;
		}
		
	});




	var SocketObserver = dom.SocketObserver = new Class({
		
		_implements: Observer,
		
		_init: function(socket) {
			this.relations = {};
		},
		
		notify: function(e) {
			
		},
		
		add: function(key, fn) {
			this.relations[key] = fn;
		}
		
	})
	
	

	/**
	 *
	 * Observer links being clicked
	 *
	 */

	var LinkRelationObserver = dom.LinkRelationObserver = new Class({

		_implements: Observer,

		_init: function(prefix, scope) {
			
			EventDispatcher.captureEvent('click', document);
			EventDispatcher.subscribe('click', this, scope || document);
			
			this.prefix = prefix || '';
			this.relations = {};
			
			
		},

		notify: function(e) {
			
			var link = dom(e.target).closest('a');
			var relation = link.attr('rel');
			
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
	
	
	var KeyObserver = new phi.Class({
		
		_implements: dom.Observer,
		
		_init: function() {
			
			EventDispatcher.captureEvent('keyup', document);
			EventDispatcher.subscribe('keyup', this);
			
			this.setModifiers(arguments);
			this.relations = {};
			
		},
		
		setModifiers: function(modifier) {
			
			if (modifier) {
				
				var keys = (keys instanceof Array) ? [keys] : keys;
 				var modifiers = {};

				for (var i = 0; i < keys.length; i++) {
					switch (keys[i]) {
						case 'ctrl' :
							modifiers.ctrlKey = true;
							break;
						case 'shift' :
							modifiers.shiftKey = true;
							break;
						case 'meta' :
							modifiers.shiftKey = true;
							break;
					}
				};
				
				this.modifiers = modifiers;
				
			}
			
		},
		
		notify: function(e) {
			
			var type = e.keyCode;
			
			var match = true;
			for (modifier in this.modifiers) {
				if (!e[modifier]) {
					match = false;
				}
			}
			
			if (match && this.relations[type]) {
				this.relations[type](e);
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
	
	var Template = dom.Template = new Class({
		
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
