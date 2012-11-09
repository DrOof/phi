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
	 * Local namespaces for dom and media.
	 *
	 */
	
	var dom = phi.dom;
	var media = dom.media = {};
	
	
	
	
	
	
	/**
	 *
	 * The Media Player
	 *
	 */
	
	var MediaPlayer = media.MediaPlayer = new Class({
		
		_init: function(id, options) {
			
			this.node = document.getElementById(id);
			this.uid = id;
			
			this.canvas = this.createCanvas();
			this.controls = this.createControls();
			this.relations = this.createRelations();
			
		},
		
		/**
		 *
		 * Creates a link relation observer that listen to link relations within the player.
		 *
		 * @returns relations:LinkRelationObserver			the link relation observer used to listen to link relations.
		 *
		 */
		
		createRelations: function() {
			
			var relations = new phi.dom.LinkRelationObserver(/media/, this.node);
			
			relations.add('toggle-mute', this.toggleMute.bind(this));
			relations.add('toggle-play', this.togglePlay.bind(this));
			relations.add('toggle-full-screen', this.toggleFullScreen.bind(this));
			
			return relations;
			
		},
		
		/**
		 *
		 * Creates a media canvas.
		 *
		 * @returns canvas:MediaCanvas						The canvas used to render the media file.
		 *
		 */
		
		createCanvas: function() {
			
			var canvas = new VideoMediaCanvas(this.node);
			
			var events = MediaCanvas.EVENTS;
			for (var type in events) {
				canvas.addEventListener(events[type], this.handleCanvasEvent.bind(this));
			}
			
			return canvas;
			
		},
		
		/**
		 *
		 * Handles events from the player canvas.
		 *
		 * @param e:Event									The event to handle.
		 *
		 */
		
		handleCanvasEvent: function(e) {
			
			// TODO on events
			// handle progress
			
			// handle time update
			if (e.type === 'timeupdate') {
				this.controls.progress.move(parseFloat(this.canvas.node.currentTime / this.canvas.node.duration) * 100, 0);
			}
			
			// handle volume
			if (e.type === 'volumechange') {
				// this.controls.volume.move(parseFloat(this.canvas.node.currentTime / this.canvas.node.duration) * 100, 0);
			}
			
			// handle playable source
			if (e.type === 'canplay') {
				this.controls.node.find('[name="media-duration"]').html(this.canvas.node.duration);
			}
			
		},
		
		/**
		 *
		 * Creates media player controls.
		 *
		 * @returns controls:MediaPlayerControls			The controls for the media player.
		 *
		 */
		
		createControls: function() {
			
			var controls = new MediaPlayerControls(this.node);
			
			controls.node.bind('dragmove', this.handleControlsEvent.bind(this));
			
			return controls;
			
		},
		
		/**
		 *
		 * Handles an event thrown by the controls.
		 *
		 * @param e:Event									The event to handle.
		 *
		 */
		
		handleControlsEvent: function(e) {
			
			if (e.type === 'dragmove') {
				
				var name = e.target.getAttribute('name');
			
				if (name === 'media-volume-head') {
					var v = parseFloat(e.target.style['left']) * 0.01;
					this.canvas.setVolume(v);
				}
				
				if (name === 'media-progress-head') {
					var t = this.canvas.node.duration * parseFloat(e.target.style['left']) * 0.01;
					this.canvas.setCurrentTime(t);
				}
				
			}
			
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
		
		volume: function(volume) {
		    this.canvas.setVolume(volume);
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
	
	
	
	
	
	/**
	 *
	 * MediaPlayer Controls.
	 *
	 */
	
	var MediaPlayerControls = new Class({
		
		_init: function(root) {
			this.node = this.createNode(root);
			dom(root).append(this.node);
		},
		
		createNode: function(root) {
			
			var node = dom(new phi.dom.Template(MediaPlayerControls.CONTROLS).parse());
			
			// progress indicator listens to changes in progress.
			this.progress = new phi.dom.RelativeDragger(node.find('[name="media-progress-head"]'), node.find('[name="media-progress"]'), { allowY: false });
			
			// volume indicator listens to changes in volume.
			this.volume = new phi.dom.RelativeDragger(node.find('[name="media-volume-head"]'), node.find('[name="media-volume"]'), { allowY: false });
			
			return node;
			
		}
		
	});
	
	/**
	 *
	 * MediaPlayer Controls Template.
	 *
	 */
	
	MediaPlayerControls.CONTROLS = 
		'<div class="media-controls">' +
			'<a href="#" class="media-control media-play" name="media-play" rel="media-toggle-play">Play</a>' +
			/* '<time class="media-time-control media-current-time" name="media-current-time">H:mm:ss</time>' + */
			/* '<time class="media-time-control media-duration" name="media-duration">H:mm:ss</time>' + */
			/* '<time class="media-time-control media-remaining" name="media-remaining">H:mm:ss</time>' + */
			'<span class="media-slide-control media-progress" name="media-progress">' +
				'<var class="media-progress-time" name="media-progress-time"></var>' +
				'<var class="media-progress-load" name="media-progress-load"></var>' +
				'<em class="media-progress-head" name="media-progress-head"></em>' +
			'</span>' +
			'<a href="#" class="media-control media-mute" name="media-mute" rel="media-toggle-mute">Mute</a>' +
			'<span class="media-slide-control media-volume" name="media-volume">' +
				'<em class="media-volume-head" name="media-volume-head"></em>' +
			'</span>' +
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
		
		addEventListener: function(type, fn) {
			// 
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
	
	MediaCanvas.EVENTS = [
		'abort', 
		'canplay', 
		'canplaythrough', 
		'durationchange', 
		'empted', 
		'ended', 
		'loadeddata', 
		'loadedmetadata', 
		'loadstart', 
		'pause', 
		'play', 
		'playing', 
		'progress', 
		'ratechange',
		'readystatechange',
		'seeked',
		'seeking',
		'stalled',
		'suspend',
		'timeupdate',
		'volumechange',
		'waiting'
	];
	
	/**
	 *
	 * Shadows all setters by setting appropriate shadow attributes to the desired values.
	 * These variables shadow existing HTML5MediaElement attributes and allow fallback canvases to emulate consistent behaviour.
	 *
	 */
	
	var MediaCanvasShadow = new Aspect({
	    setAutoplay: {
	        after: function(autoplay) {
	            this.autoplay = autoplay;
	        }
	    },
		setControls: {
			after: function(controls) {
				this.controls = controls;
			}
		},
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
		setLoop: {
			after: function(loop) {
				this.loop = loop;
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
	});
	
	
	
	
	/**
	 *
	 * HTML5 Audio & Video Media Canvas.
	 *
	 */
	
	var VideoMediaCanvas = new Class({
		
		_extends: MediaCanvas,
		_applies: MediaCanvasShadow,
		
		createNode: function(root) {
			
			var node = document.createElement('video');
			
			node.setAttribute('width', '100%');
			node.setAttribute('height', '100%');
			
			dom(root).append(node);
			
			return node;
			
		},
		
		addEventListener: function(type, fn) {
			this.node.addEventListener(type, fn, true);
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
		
		setCurrentTime: function(currentTime) {
			this.node.currentTime = currentTime;
		},
		
		setLoop: function(loop) {
			// does nothing...
		},
		
		setControls: function(controls) {
			// does nothing...
		},
		
		setMuted: function(mute) {
			this.node.muted = mute;
		},
		
		setVolume: function(volume) {
		    this.node.volume = parseFloat(volume);
		},
		
		setAutoplay: function(autoplay) {
			this.node.autoplay = autoplay;
		}
		
	});
	
	
	
	
	
	
	
	/*
	
	var AudioMediaCanvas = new Class({
		
		_extends: MediaCanvas,
		_applies: MediaCanvasShadow,
		
		createNode: function(root) {
			
			var node = document.createElement('audio');
			
			node.setAttribute('width', '100%');
			node.setAttribute('height', '100%');
			
			dom(root).append(node);
			
			return node;
			
		}
		
	});
	
	
	/**
	 *
	 * Flash Audio & Video Media Canvas.
	 *
	 *
	
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
	 *
	
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
	
	*/
	
	
})();