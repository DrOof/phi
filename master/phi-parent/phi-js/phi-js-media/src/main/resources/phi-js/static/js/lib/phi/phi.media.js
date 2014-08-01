(function( dom ) {
    
    phi.media = phi.media || {};
    
    var WAITING         = 'waiting';
    var MUTED           = 'muted';
    var PLAYING         = 'playing';
    
    var Player = phi.media.Player = phi({
        
        __extends__ : phi.EventTarget,
        
        __init__ : function( node ) {
            
            this.node = node;
            this.reset( node );
            
            if ( node.hasAttribute( 'src' ) ) {
                this.setSrc( node.getAttribute( 'src' ) );
            }
            
        },
        
        reset: function( node ) {
            
            node.innerHTML = '';
            
            if ( node.hasAttribute( 'poster' ) ) {
                this.setPoster( node.getAttribute( 'poster' ) );
            }
            
            if ( node.hasAttribute( 'muted' ) ) {
                this.setMuted( true );
            }
            
            if ( node.hasAttribute( 'controls') ) {
                this.createControls();
            }
            
            this.createAspectRatio();
            this.removeState( WAITING, MUTED, PLAYING );
            
        },
        
        createAspectRatio: function() {
            
            var ratio = this.ratio = new phi.media.ui.AspectRatio();
            this.node.appendChild( ratio.createAspectRatio() );
            
        },
        
        createControls: function() {
            
            var controls = this.controls = new phi.media.ui.Controls();
            this.node.appendChild( controls.createControls() );
            
            /*  */
            controls.initialise();
            
            controls.addEventListener( 'requestplay', this.handleRequestPlay.bind( this ) );
            controls.addEventListener( 'requeststop', this.handleRequestStop.bind( this ) );
            controls.addEventListener( 'requestpause', this.handleRequestPause.bind( this ) );
            controls.addEventListener( 'requestmuted', this.handleRequestMuted.bind( this ) );
            controls.addEventListener( 'requesttimeupdate', this.handleRequestTimeUpdate.bind( this ) );
            controls.addEventListener( 'requestvolumechange', this.handleRequestVolumeChange.bind( this ) );
            
        },
        
        createPoster: function() {
            
            var poster = new phi.media.ui.Poster( this.__poster__ );
            this.node.appendChild( poster.createPoster() );
            
        },
        
        destroyEngine: function() {
            
            
            
        },
        
        resolveEngineClass: function( source ) {
            
            var T, clazz;
            for ( var e in phi.media.engine ) {
                
                clazz = phi.media.engine[ e ];
                
                if ( clazz.canPlayType( source.mimeType ) ) {
                    T = clazz;
                    break;
                }
                
            }
            
            return T;
            
        },
        
        createEngine: function( source ) {
			
            if ( this.engine ) {
                this.engine.destroyCanvas();
                this.engine = null;
            }
            
            /**
             *
             * var engine = this.engine = new phi.media.engine.YouTubeIFrameEngine();
             * this.node.appendChild( engine.createCanvas() );
             * 
             * engine.addEventListener( 'timeupdate', this.handleTimeUpdate.bind( this ) );
             * 
             */
            
            var engine = new ( this.resolveEngineClass( source ) )(); // clazz.apply();
			
            this.node.appendChild( engine.createCanvas() );
            
            engine.addEventListener( 'pause', this.handlePause.bind( this ) );
            engine.addEventListener( 'playing', this.handlePlaying.bind( this ) );
            engine.addEventListener( 'timeupdate', this.handleTimeUpdate.bind( this ) );
            engine.addEventListener( 'volumechange', this.handleVolumeChange.bind( this ) );
            
            return engine;
            
        },
        
        play: function() {
            
            if ( this.engine ) {
                this.engine.play();
            }
            
        },
        
        pause: function() {
            
            if ( this.engine ) {
                this.engine.pause();
            }
            
        },
        
        stop: function() {
            
            if ( this.engine ) {
                this.engine.stop();
            }
            
        },
        
        src: function( src ) {
            
            if ( src == undefined ) {
                return this.getSrc();
            } else {
                this.setSrc( src );
            }
            
        },
        
        poster: function( poster ) {
            
            if ( poster == undefined ) {
                return this.getPoster();
            } else {
                this.setPoster( poster );
            }
            
        },
        
        currentTime: function( currentTime ) {
            
            if ( currentTime == undefined ) {
                return this.getCurrentTime();
            } else {
                this.setCurrentTime( currentTime );
            }
            
        },
        
        duration: function() {
            return this.getDuration();
        },
        
        volume: function( volume ) {
            
            if ( volume === undefined ) {
                return this.getVolume();
            } else {
                this.setVolume( volume );
            }
            
        },
        
        muted: function( muted ) {
            
            if ( muted === undefined ) {
                return this.getMuted();
            } else {
                this.setMuted( muted );
            }
            
        },
        
        setMuted: function( muted ) {
            
            if ( muted ) {
                this.savedVolume = this.volume();   
            }
            
            this.volume( muted ? 0 : this.savedVolume );
            
        },
        
        getMuted: function( muted ) {
            return this.volume() === 0;
        },
        
        setSrc: function( src ) {
			
			this.reset( this.node );
            this.engine = this.createEngine( new phi.media.util.Source( src ) );
            
            if ( this.engine ) {
                this.engine.setSrc( src );
                
            }
            
        },
        
        getSrc: function() {
            
            if ( this.engine ) {
                return this.engine.getSrc();
            }
            
        },
        
        setPoster: function( poster ) {
            this.__poster__ = this.createPoster( poster );
        },
        
        getPoster: function() {
            return this.__poster__;
        },
        
        setCurrentTime: function( currentTime ) {
            
            if ( this.engine ) {
                this.engine.setCurrentTime( currentTime );
            }
            
        },
        
        getCurrentTime: function() {
            
            if ( this.engine ) {
                return this.engine.getCurrentTime();
            }
            
        },
        
        setVolume: function( volume ) {
            
            if ( this.engine ) {
                this.engine.setVolume( volume );
            }
            
        },
        
        getVolume: function() {
            
            if ( this.engine ) {
                return this.engine.getVolume();
            }
            
        },
        
        getDuration : function() {
            
            if ( this.engine ) {
                return this.engine.getDuration();
            }
            
        },
        
        addState: function( state ) {
            
            if ( arguments.length > 1 ) {
                for ( a in arguments ) {
                    this.addState( arguments[ a ] );
                }
            }
            
            dom( this.node ).addClass( state );
            
        },
        
        removeState: function( state ) {
            
            if ( arguments.length > 1 ) {
                for ( a in arguments ) {
                    this.removeState( arguments[ a ] );
                }
            }
            
            dom( this.node ).removeClass( state );
            
        },
        
        handlePause: function( e ) {
            this.removeState( PLAYING );
        },
        
        handlePlaying: function( e ) {
            this.addState( PLAYING  );
        },
        
        handleTimeUpdate: function( e ) {
            
			this.controls.updateRemainingTime( this.duration() - this.currentTime() );
			this.controls.updateCurrentTime( this.currentTime() );
			this.controls.updateDuration( this.duration() );
            
			this.controls.updateProgress( this.currentTime(), this.duration() );
				
        },
        
        handleVolumeChange: function( e ) {
            
            if ( this.volume() === 0 ) {
                this.addState( MUTED );
            } else {
                this.removeState( MUTED );
            }
            
			this.controls.updateVolume( this.volume() );
			
        },
        
        handleRequestPlay : function( e ) {
            this.play();
        },
        
        handleRequestStop : function( e ) {
            this.stop();
        },
        
        handleRequestPause : function( e ) {
            this.pause();
        },
        
        handleRequestVolumeChange : function( e ) {
            this.volume( ( this.controls.volume.valueX() / 100 ) );
        },
        
        handleRequestMuted: function( e ) {
            this.muted( !this.muted() );            
        },
        
        handleRequestTimeUpdate: function( e ) {
            this.currentTime( ( this.controls.progress.valueX() / 100 ) * this.duration() );
        }
        
    });
    
})( jQuery );