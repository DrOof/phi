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
	
	var Dialog = dom.Dialog = new Class({
		
		_init: function(options) {
			
			this.html = new dom.Template(options.html || '');
			this.container = options.container;
			
		},
		
		open: function(e) {
			
			phi.dom(this.container).fadeIn();
			
		},
		
		close: function() {
			
			phi.dom(this.container).fadeOut();
			
		},
		
		position: function() {
			
			
			
		}
		
	});
	
	var FlexDialog = new Class({
		
		_extends: Dialog,
		
		open: function(e) {
			
			
			
		}
		
	});
	
	var DialogManager = dom.DialogManager = new (new Class({
		
		_init: function() {
			
			this.dialogs = [];
			this.relations = new phi.dom.RelationObserver(/dialog/);
			this.relations.add('close', this.closeDialogs.bind(this));
			
		},
		
		registerDialog: function(name, dialog) {
			
			this.dialogs[name] = dialog;
			this.relations.add(name, dialog.open.bind(dialog));
			
		},
		
		closeDialogs: function(e) {
			
			var dialogs = this.dialogs;
			for (var name in dialogs) {
				dialogs[name].close(e);
			};
			
		}
		
	}));
	
	DialogManager.registerDialog('default', new Dialog({ html: '{{content}}', container: '#default.dialog' }));
	
})();