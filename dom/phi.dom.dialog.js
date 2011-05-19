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
	 * The default Dialog from which other dialogs inherit
	 *
	 */
	
	var Dialog = dom.Dialog = new Class({
		
		_init: function(options) {
			
			this.html = new dom.Template(options.html || '');
			this.root = options.root;
			this.node = options.node;
			
		},
		
		/**
		 *
		 * finds a node and opens the dialog
		 *
		 * @param e {Event}		the event that opens the dialog
		 *
		 */
		
		open: function(e) { e.preventDefault();
			
			var node = phi.dom(this.node);
			this.show(e, node);
			
		},
		
		/**
		 *
		 * finds a node and closes the dialog
		 * 
		 * @param e {Event}		the event that closes the dialog
		 *
		 */
		
		close: function(e) {
		
			var node = phi.dom(this.node);
			this.hide(e, node);
			
		},
		
		show: function(e, node) {
			node.fadeIn();
		},
		
		hide: function(e, node) {
			node.fadeOut();
		},
		
		position: function(e) {
			
			
		}
		
	});
	
	var TooltipDialog = new Class({
		
		_extends: Dialog,
		
		/**
		 *
		 * creates a node and opens the dialog
		 *
		 * @param e {Event}		the event that opens the dialog
		 *
		 */
		
		open: function(e) { e.preventDefault();
			
			var target = e.target;
			var root = phi.dom(this.root);
			
			var html = this.html.parse({
				content: e.target.getAttribute('longdesc')
			});
			
			var node = phi.dom(html);
			
			this.close(e);
			root.append(node);
			this.position(e, node);
			
			
		},
		
		position: function(e, node) {
			
			var target = phi.dom(e.target);
			var offset = target.offset();
			
			phi.dom(node).css({
				left: offset.left + (target.width() / 2) - (node.outerWidth() / 2),
				top: offset.top - (node.outerHeight()) - 5
			});
			
		},
		
		hide: function(e, node) {
			
			node.remove();
			
		}
		
		
		
	});
	
	
	
	
	
	/**
	 *
	 * A singleton Dialogs class manages all dialogs.
	 *
	 */
	
	var Dialogs = dom.Dialogs = new (new Class({
		
		_init: function() {
			
			this.dialogs = [];
			this.relations = new phi.dom.RelationObserver(/dialog/);
			this.relations.add('close', this.closeDialogs.bind(this));
			
		},
		
		createDialog: function(name, dialog) {
			
			this.dialogs[name] = dialog;
			this.relations.add(name, dialog.open.bind(dialog));
			
		},
		
		closeDialogs: function(e) {
			
			var dialogs = this.dialogs;
			for (var name in dialogs) {
				if (dialogs[name] instanceof Dialog) { // what on earth is 'map' on objects in IE < 9
					dialogs[name].close(e);
				}
			};
			
		}
		
	}));
	
	Dialogs.createDialog('default', new Dialog({ html: '{{content}}', node: '#default.dialog' }));
	Dialogs.createDialog('tooltip', new TooltipDialog({ html: '<div class="tooltip">{{content}}</div>', root: 'body', node: '.tooltip' }));
	
})();