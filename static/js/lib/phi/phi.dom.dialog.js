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
	
	var dom = phi.dom;
	
	/**
	 *
	 * dialog namespace acts as a singleton to manage, create and register active dialogs
	 *
	 */
	
	var dialog = dom.dialog = new (new Class({
		
		_init: function() {
			
			this.registered = {};
			this.relations = new dom.LinkRelationObserver(/dialog/);
			this.relations.add('close', this.closeDialogs.bind(this)); 
			
			dom(document).bind('dialog:force', this.closeDialogs.bind(this));
			
		},
		
		/**
		 *
		 * creates a dialog and registers it to a relation
		 *
		 * @param type {Dialog}			The Dialog class to draw an instance from
		 * @param name {String}			The name of the dialog relates to the relation attribute that triggers it
		 * @param options {Object}		Options for the dialog to render
		 *
		 */
		
		createDialog: function(Dialog, name, options) {
			
			var dialog = new Dialog(options);
			
			this.registered[name] = dialog;
			this.relations.add(name, dialog.open.bind(dialog));
			
			return dialog;
			
		},
		
		/**
		 *
		 * Close all open dialogs
		 *
		 * @param e {Event}				The event that triggers the close
		 *
		 */
		
		closeDialogs: function(e) {
			
			var registered = this.registered;
			var dialog;
			
			for (var name in registered) {
				dialog = registered[name];
				if (dialog instanceof Dialog) { // what on earth is 'map' on objects in IE < 9
					var node = dom(dialog.node);
					dialog.hide(node, e);
				}
			};
			
		}
		
	}));
	
	
	
	
	/**
	 *
	 * An Escapable Dialog can be closed with the 'esc' key after it is opened.
	 *
	 */
	
	var Escapable = phi.dom.dialog.Escapable = new Aspect({
		show: {
			after: function() {
				
				this.escape = function(e) {
					if (e.keyCode === 27) { e.preventDefault();
						this.close(e);
					}
				}
				
				phi.dom(document).bind('keyup', this.escape.bind(this));
				
			}
		},
		hide: {
			after: function() {
				phi.dom(document).unbind('keyup', this.escape);
			}
		}
	});
	
	
	
	var Forceful = phi.dom.dialog.Forceful = new Aspect({
		close: {
			before: function() { 
				phi.dom(document).trigger('dialog:force');
			}
		}
		
	});
	
	
	/**
	 *
	 * An Escapable Dialog can be closed with the 'esc' key after it is opened.
	 *
	 */
	
	var Attention = phi.dom.dialog.Attention = new Aspect({
		create: {
			after: function() {
				var node = dom(this.node);
				node.find('input, textarea').eq(0).focus();
			}
		}
	});
	
	
	/**
	 *
	 * A Modal Dialog prevents the user interacting with other parts of the site while the dialog is open.
	 *
	 */
	
	var Modal = phi.dom.dialog.Modal = new Aspect({
		show: {
			after: function() {
				
				var overlay = phi.dom('.overlay');
				
				if (!overlay.length) {
					
					var overlay = dom('<div class="overlay"></div>');
					
					overlay.css({ opacity: 0 });
					overlay.appendTo('body');
					overlay.animate({ opacity: 1 });
					
				}
				
			}
		},
		hide: {
			after: function() {
				phi.dom('.overlay').remove();
			}
		}
	});
	
	
	/**
	 *
	 * A Centered Dialog centers according to the window. 
	 *
	 */
	
	var Centered = phi.dom.dialog.Centered = new Aspect({
		position: {
			before: function(node, e) {
				
				var top = (window.innerHeight / 2) - (node.outerHeight() / 2);
				var left = (window.innerWidth / 2)  - (node.outerWidth() / 2);
				
				node.css({ 
					top: top,
					left: left
				});
				
			}
		}
	});
	
	
	/**
	 *
	 * The default Dialog from which other dialogs inherit
	 *
	 */
	
	var Dialog = dialog.Dialog = new Class({
		
		_init: function(options) {
			
			var options = options || {};
			
			this.html = new dom.Template(options.html || '');
			this.root = options.root || 'body';
			this.node = options.node;
			
		},
		
		/**
		 *
		 * finds a node and opens the dialog
		 *
		 * @param e {Event}			the event that opens the dialog
		 *
		 */
		
		open: function(e) { e.preventDefault();
			
			this.close(e);
			
			var href = dom(e.target).closest('a').attr('href');
			var node = dom(href);
			this.show(node, e);
			
		},
		
		/**
		 *
		 * finds a node and closes the dialog
		 * 
		 * @param e {Event}			the event that closes the dialog
		 *
		 */
		
		close: function(e) { e.preventDefault();
			
			var node = dom(this.node);
			this.hide(node, e);
			
		},
		
		/**
		 *
		 * shows and/or adds the dialog
		 * 
		 * @param node {Object}		the node to show and/or add
		 * @param e {Event}			the event that opened the dialog
		 *
		 */
		
		show: function(node, e) {
			node.show();
			this.position(node, e);
			node.stop().fadeIn(300); 
		},
		
		/**
		 *
		 * hides and/or removes the dialog
		 * 
		 * @param node {Object}		the node to hide and/or remove
		 * @param e {Event}			the event that closed the dialog
		 *
		 */
		
		hide: function(node, e) {
			node.stop().fadeOut(300);
		},
		
		/**
		 *
		 * positions the dialog
		 * 
		 * @param node {Object}		the node to position
		 * @param e {Event}			the event that opened the dialog
		 *
		 */
		
		position: function(node, e) {
			// By default, dialogs are positioned with CSS, this method can be used to overrule that behaviour.
		}
		
	});
	
	
	
	/**
	 *
	 *
	 *
	 */
	
	var AjaxDialog = dialog.AjaxDialog = new Class({
		
		_extends: Dialog,
		
		_applies: [Escapable, Modal, Attention, Centered, Forceful],
		
		/**
		 *
		 * creates a node and opens the dialog
		 *
		 * @param e {Event}		the event that opens the dialog
		 *
		 */
		
		open: function(e) { e.preventDefault();
			
			this.close(e);
			
			var link = phi.dom(e.target).closest('a');
			var url = link.attr('href');
			
			dom.ajax({
				url: url,
				success: function(response) {
					this.create(response, e);
				}.bind(this)
			});
			
		},
		
		create: function(response, e) {
			
			var html = this.html.parse({ content: response }); 
			var node = dom(html); 
			this.show(node, e); 
			
		},
		
		/**
		 *
		 * shows and/or adds the dialog
		 * 
		 * @param node {Object}		the node to show and/or add
		 * @param e {Event}			the event that opened the dialog
		 *
		 */
		
		show: function(node, e) {
			
			node.css({
				'opacity': 0
			});
			
			dom(this.root).append(node);
			
			node.animate({
				'opacity': 1
			}, 200);
			
			this.position(node, e);
			
		},
		
		/**
		 *
		 * hides and/or removes the dialog
		 * 
		 * @param node {Object}		the node to hide and/or remove
		 * @param e {Event}			the event that closed the dialog
		 *
		 */
		
		hide: function(node, e) {
			
			dom(node).remove();
			
		}
		
	});
	
	
	
	
	/**
	 *
	 * Create and register basic types of dialog
	 *
	 */
	
	dialog.createDialog(Dialog, 'default',  { 
		node: '.dialog.default' 
	});
	
	dialog.createDialog(AjaxDialog, 'ajax', { 
		html: '{{content}}', 
		node: '.dialog.ajax'
	});
	
})();