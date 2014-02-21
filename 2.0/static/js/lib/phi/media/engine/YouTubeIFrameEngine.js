( function( dom ) {
    
    phi.media.engine = phi.media.engine || {};
    
    
    
    var UNSTARTED    = - 1;
    var ENDED         = + 0;
    var PLAYING     = + 1;
    var PAUSED         = + 2;
    var BUFFERING     = + 3;
    var CUED         = + 4;
    
    var YouTubeIFrameEngine = phi.media.engine.YouTubeIFrameEngine = phi({
        
        __implements__ : phi.media.engine.Engine,
        __extends__ : phi.mvc.Observable,
        
        __init__ : function() {
              
        },
        
        createCanvas : function() {
            
            var canvas = this.canvas = document.createElement( "iframe" );
            
            canvas.id = 'youtube-player-canvas';
            canvas.className = 'player-canvas';
            canvas.frameBorder = '0';
            canvas.height = '100%';
            canvas.width = '100%';
            
            this.createYouTubePlayer();
            
            return canvas;
            
        },
        
        destroyCanvas: function() {
            
            for ( type in this.listeners ) {
                this.removeEventListener( type );
            }
            
            this.cancelAnimationEventStream();
            
        },
        
        createYouTubePlayer : function() {
            
            var script, body;
            
            script = document.createElement('script');
            script.src = "https://www.youtube.com/iframe_api";
        
            // console.log( YT );
        
            body = document.getElementsByTagName( 'body' )[0];
            body.appendChild( script );
            
            ( function( engine ) {
                        
                var fn = engine.handleCanvasEvent.bind( engine );
                    
                window.onYouTubeIframeAPIReady = function() {
                    
                    engine.api = new YT.Player( 'youtube-player-canvas', {
                        events : {
                            onReady : fn,
                            onStateChange : fn,
                            onPlaybackQualityChange : fn,
                            onPlaybackRateChange : fn,
                            onError : fn,
                            onApiChange : fn,
                        }
                    } );
                    
                    engine.triggerAnimationEventStream();    
                    delete onYouTubeIframeAPIReady;
                
                };
                    
            })( this );
            
        },
        
        play: function() {
            this.api.playVideo();
        },
        
        pause: function() {
            this.api.pauseVideo();
        },
        
        getDuration: function() {
            
            var duration = 0;
            try {
                duration = this.api.getDuration();
            } catch ( e ) {
                
            }
            
            return duration;
            
        },
        
        setVolume: function( volume ) {
            this.api.setVolume( volume * 100 );
        },
        
        getVolume: function() {
            
            var volume = 1;
            try {
                volume = this.api.getVolume() / 100;
            } catch ( e ) {
                
            }
            
            return volume;
            
        },
        
        setCurrentTime: function( currentTime ) {
            this.api.seekTo( currentTime );
        },
        
        getCurrentTime: function() {
            
            var currentTime = 0;
            try {
                currentTime = this.api.getCurrentTime();
            } catch ( e ) {
                
            }
            
            return currentTime;
            
        },
        
        setSrc: function( src ) {
            this.canvas.src = src;
        },
        
        getSrc: function() {
            return this.canvas.src;
        },
        
        /**
         *
         * Trigger an animation event stream to simulate missing events from the YT.Player API.
         *
         */
        
        triggerAnimationEventStream: function() {
            
            this.timeUpdateEventFrame = requestAnimationFrame( this.triggerAnimationEventStream.bind( this ) );
            this.dispatchEvent( { type : 'timeupdate', target : this } );
            this.dispatchEvent( { type : 'volumechange', target : this } );
            
        },
        
        /**
         *
         * Cancel an animation event stream to simulate missing events from the YT.Player API.
         *
         */
        
        cancelAnimationEventStream: function() {
            
            cancelAnimationFrame( this.animationEventStream );
            delete this.animationEventStream;
            
        },
        
        handleCanvasEvent: function( e ) {
            
            if ( this.api.getPlayerState() === PLAYING ) {
                this.dispatchEvent( { type : 'playing', target : this } );
            }
            
            if ( this.api.getPlayerState() === PAUSED ) {
                this.dispatchEvent( { type : 'pause', target : this } );
            }
            
        }
        
    });
    
    
    
    YouTubeIFrameEngine.isAvailable = function() {
        return true;
    };
    
    YouTubeIFrameEngine.canPlayType = function( mimeType ) {
        return YouTubeIFrameEngine.isAvailable() && /video\/x\-youtube/.test( mimeType );
    };
    
} )( jQuery );