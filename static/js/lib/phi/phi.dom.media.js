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
		
		_init: function(uid, options) {
			
			this.node = document.getElementById(uid);
			this.uid = uid;
			
			this.canvas = this.createCanvas();
			this.controls = this.createControls();
			this.relations = this.createRelations();
			
		},
		
		createRelations: function() {
			
			var relations = new phi.dom.LinkRelationObserver(/media/, this.node);
			
			relations.add('toggle-mute', this.toggleMute.bind(this));
			relations.add('toggle-play', this.togglePlay.bind(this));
			relations.add('toggle-full-screen', this.toggleFullScreen.bind(this));
			
			return relations;
			
		},
		
		createCanvas: function() {
			return new VideoMediaCanvas(this.node);
		},
		
		createControls: function() {
			return new MediaPlayerControls(this.node);
		},
		
		setSrc: function(src) {
			this.canvas.setSrc(src);
		},
		
		getSrc: function() {
			return this.src;
		},
		
		togglePlay: function(e) { e.preventDefault();
			if (this.canvas.paused) {
				this.play();
			} else {
				this.pause();
			}
		},
		
		toggleMute: function(e) { e.preventDefault();
			if (this.canvas.muted) {
				this.unmute();
			} else {
				this.mute();
			}
		},
		
		toggleFullScreen: function(e) { e.preventDefault();
			if (!this.fullscreen) {
				this.enterFullScreen();
			} else {
				this.leaveFullScreen();
			}
		},
		
		fullscreen: false,
		enterFullScreen: function() {
			this.node.requestFullScreen();
			this.fullscreen = true;
		},
		
		leaveFullScreen: function() {
			document.cancelFullScreen();
			this.fullscreen = false;
		},
		
		play: function() {
			this.canvas.play();
		},
		
		pause: function() {
			this.canvas.pause();
		},
		
		mute: function() {
			this.canvas.setMuted(true);
		},
		
		unmute: function() {
			this.canvas.setMuted(false);
		},
		
		load: function() {
			this.canvas.load();
		}
		
	});
	
	
	var MediaPlayerControls = new Class({
		
		_init: function(root, uid) {
			this.node = this.createNode(root, uid);
		},
		
		createNode: function(root, uid) {
			
			var node = new phi.dom.Template(MediaPlayerControls.HTML).parse();
			
			dom(root).append(node);
			
			return node;
		}
		
	})
	
	MediaPlayerControls.HTML = 
		'<div class="media-controls">' +
			'<a href="#" class="media-control media-play" name="media-play" rel="media-toggle-play">Play</a>' +
			/* '<time class="media-time-control media-duration" name="media-duration">H:mm:ss</time>' + */
			/* '<time class="media-time-control media-progress" name="media-progress">H:mm:ss</time>' + */
			/* '<time class="media-time-control media-remaining" name="media-remaining">H:mm:ss</time>' + */
			'<var class="media-slide-control media-scrubber" name="media-scrubber">' +
				'<em name="media-scrubber-head" name="media-scrubber-head"></em>' +
			'</var>' +
			'<a href="#" class="media-control media-mute" name="media-mute" rel="media-toggle-mute">Mute</a>' +
			'<var class="media-slide-control media-volume" name="media-volume">' +
				'<em name="media-volume-head" name="media-volume-head"></em>' +
			'</var>' +
		'</div>' +
		'<a href="#" class="media-control media-full-screen" name="media-full-screen" rel="media-toggle-full-screen">Full Screen</a>';
	
	
	
	
	
	/**
	 *
	 * MediaCanvas is an abstract class to define the basic interface and attributes a canvas needs to implement.
	 *
	 */
	
	var MediaCanvas = new Class({
		
		_init: function(node) {
			this.node = this.createNode(node);
		},
		
		createNode: function() {},
		
		play: function() {},
		pause: function() {},
		load: function() {},
		
		/**
		 *
		 * Display Attributes
		 *
		 */
		
		controls: false,
		poster: false,
		height: false,
		width: false,
		src: false,
		
		setControls: function() {},
		getControls: function() {},
		setPoster: function() {},
		getPoster: function() {},
		setHeight: function() {},
		getHeight: function() {},
		setWidth: function() {},
		getWidth: function() {},
		setSrc: function() {},
		getSrc: function() {},
		
		/**
		 *
		 * Playback Attributes
		 *
		 */
		
		currentTime: 0.0,
		startTime: 0.0,
		duration: 0.0,
		
		paused: true,
		ended: false,		
		autobuffer: false,
		seeking: false,
		defaultPlaybackRate: 1.0,
		playbackRate: 1.0,
		seekable: true,
		buffered: {},
		played: {},
		autoplay: false,
		loop: false,
		
		setAutoplay: function() {},
		getAutoplay: function() {},
		setLoop: function() {},
		getLoop: function() {},
		
		/**
		 *
		 * Other Attributes
		 *
		 */
		
		networkState: false,
		readyState: false,
		preload: false,
		error: null,
		volume: 1.0,
		muted: false,
		
		setPreload: function() {},
		getPreload: function() {},
		setVolume: function() {},
		getVolume: function() {},
		setMuted: function() {},
		getMuted: function() {},
		
	});
	
	/**
	 *
	 * Shadows all setters by setting appropriate shadow attributes to the desired values.
	 * These variables shadow existing HTML5MediaElement attributes and allow fallback canvases to emulate consistent behaviour.
	 *
	 */
	
	var MediaCanvasSetterShadow = new Aspect({
		setVolume: {
			after: function(volume) {
				this.volume = volume;
			}
		},
		setMuted: {
			after: function(mute) {
				this.muted = mute;
			}
		},
		play: {
			after: function() {
				this.paused = false;
			}
		},
		pause: {
			after: function() {
				this.paused = true;
			}
		}
	})
	
	
	
	
	/**
	 *
	 * HTML5 Audio & Video Media Canvas.
	 *
	 */
	
	var AudioMediaCanvas = new Class({
		
		_extends: MediaCanvas,
		_applies: MediaCanvasSetterShadow,
		
		createNode: function(root) {
			
			var node = document.createElement('audio');
			
			node.setAttribute('width', '100%');
			node.setAttribute('height', '100%');
			
			dom(root).append(node);
			
			return node;
			
		}
		
	});
	
	var VideoMediaCanvas = new Class({
		
		_extends: MediaCanvas,
		_applies: MediaCanvasSetterShadow,
		
		createNode: function(root) {
			
			var node = document.createElement('video');
			
			node.setAttribute('width', '100%');
			node.setAttribute('height', '100%');
			
			dom(root).append(node);
			return node;
			
		},
		
		setSrc: function(src) {
			this.node.src = src;
		},
		
		play: function() {
			this.node.play();
		},
		
		pause: function() {
			this.node.pause();
		},
		
		setMuted: function(mute) {
			this.node.muted = mute;
		},
		
		getMuted: function() {
			return this.muted;
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