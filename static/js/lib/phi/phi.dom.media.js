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
	
	var MediaPlayer = media.MediaPlayer = new Class({
		
		_init: function(node, options) {
			
			this.node = dom(document.getElementById(node));
			
			this.gui = this.createGUI();
			this.canvas = this.createCanvas();
			
		},
		
		createCanvas: function() {
			
			var canvas = new VideoMediaCanvas();
			this.node.append(canvas.createNode());
			
			return canvas;
			
		},
		
		createGUI: function() {
			
			var gui = new MediaPlayerGUI();
			this.node.append(gui.createNode());
			
			return gui;
			
		},
		
		setSrc: function(src) {
			this.canvas.setSrc(src);
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
	
	
	var MediaPlayerGUI = new Class({
		
		_init: function() {
			
		},
		
		createNode: function() {
			return MediaPlayerGUI.HTML.parse();
		}
		
	})
	
	MediaPlayerGUI.HTML = new phi.dom.Template(
		'<div class="media-controls">' +
			'<a href="#player-1" class="media-control media-play" name="media-play" rel="media-mute">Play</a>' +
			/* '<time class="media-time-control media-duration" name="media-duration">H:mm:ss</time>' + */
			/* '<time class="media-time-control media-progress" name="media-progress">H:mm:ss</time>' + */
			/* '<time class="media-time-control media-remaining" name="media-remaining">H:mm:ss</time>' + */
			'<var class="media-slide-control media-scrubber" name="media-scrubber">' +
				'<em name="media-scrubber-head" name="media-scrubber-head"></em>' +
			'</var>' +
			'<a href="#player-1" class="media-control media-mute" name="media-mute" rel="media-mute">Mute</a>' +
			'<var class="media-slide-control media-volume" name="media-volume">' +
				'<em name="media-volume-head" name="media-volume-head"></em>' +
			'</var>' +
		'</div>' +
		'<a href="#player-1" class="media-control media-full-screen" name="media-full-screen" rel="media-full-screen">Full Screen</a>');
	
	
	
	
	
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
		},
		
		setSrc: function() {
			
		}
		
	});
	
	
	
	
	/**
	 *
	 * HTML5 Audio & Video Media Canvas.
	 *
	 */
	
	var AudioMediaCanvas = new Class({
		
		_extends: MediaCanvas,
		
		createNode: function() {
			
			var node = document.createElement('audio');
			this.node = node;
			
			node.setAttribute('width', '100%');
			node.setAttribute('height', '100%');
			
			return node;
			
		}
		
	});
	
	var VideoMediaCanvas = new Class({
		
		_extends: MediaCanvas,
		
		createNode: function() {
			
			var node = document.createElement('video');
			this.node = node;
			
			node.setAttribute('width', '100%');
			node.setAttribute('height', '100%');
			
			return node;
			
		},
		
		setSrc: function(src) {
			this.node.src = src;
		},
		
		play: function() {
			this.node.play();
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
			this.node = document.createElement('object');
			return this.node;
		}
		
	});
	
	var FlashAudioMediaCanvas = new Class({
		
		_extends: MediaCanvas,
		
		createNode: function() {
			this.node = document.createElement('object');
			return this.node;
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
			this.node = document.createElement('object');
			return this.node;
		}
		
	});
	
	var SilverlightAudioMediaCanvas = new Class({
		
		_extends: MediaCanvas,
		
		createNode: function() {
			this.node = document.createElement('object');
			return this.node;
		}
		
	});
	
	
})();