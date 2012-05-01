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
	var media = dom.media = {};
	
	
	
	/**
	 *
	 * An instance of player controls it's media canvas and view.
	 *
	 */
	
	var Player = media.Player = new Class({
		
		_init: function(node, html, src) {
			
			this.node = node;
			this.html = html;
			this.src = src;
			
		},
		
		createHTML: function(data) {
			return this.html.parse(data);
		},
		
		setSrc: function(src) {
			this.src = src;
		},
		
		getSrc: function() {
			return this.src;
		},
		
		play: function() {
			this.canvas.play();
		},
		
		pause: function() {
			this.canvas.pause();
		},
		
		load: function() {
			this.canvas.load();
		}
		
	});
	
	
	
	
	
	
	/**
	 *
	 * Player uses a canvas to render sound and picture.
	 *
	 */
	
	var MediaCanvas = new Class({
		
		_init: function() {
			this.node = this.createNode();
		},
		
		createNode: function() {
			throw Error('abstract method MediaCanvas.createNode');
		},
		
		play: function() {
			throw Error('abstract method MediaCanvas.play');
		},
		
		pause: function() {
			throw Error('abstract method MediaCanvas.pause');
		},
		
		load: function() {
			throw Error('abstract method MediaCanvas.load');
		}
		
	});
	
	
	
	
	/**
	 *
	 * HTML5 Audio & Video Media Canvas.
	 *
	 */
	
	var HTML5AudioMediaCanvas = new Class({
		_extends: MediaCanvas,
		createNode: function() {
			return document.createElement('audio');
		}
	});
	
	var HTML5VideoMediaCanvas = new Class({
		_extends: MediaCanvas,
		createNode: function() {
			return document.createElement('video');
		}
	});
	
	
	
	
	/**
	 *
	 * Flash Audio & Video Media Canvas.
	 *
	 */
	
	var FlashVideoMediaCanvas = new Class({
		_extends: MediaCanvas,
		createNode: function() {
			return document.createElement('object');
		}
	});
	
	var FlashAudioMediaCanvas = new Class({
		_extends: MediaCanvas,
		createNode: function() {
			return document.createElement('object');
		}
	});
	
	
	
	
	/**
	 *
	 * Silverlight Audio & Video Media Canvas.
	 *
	 */
	
	var SilverlightVideoMediaCanvas = new Class({
		_extends: MediaCanvas,
		createNode: function() {
			return document.createElement('object');
		}
	});
	
	var SilverlightAudioMediaCanvas = new Class({
		_extends: MediaCanvas,
		createNode: function() {
			return document.createElement('object');
		}
	});
	
	
})();