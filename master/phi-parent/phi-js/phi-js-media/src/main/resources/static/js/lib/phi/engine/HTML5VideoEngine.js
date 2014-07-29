( function( dom ) {
    
    phi.media.engine = phi.media.engine || {};
    
    var HTML5VideoEngine = phi.media.engine.HTML5VideoEngine = phi({
        
        __implements__ : phi.media.engine.Engine,
        
        __extends__ : phi.mvc.EventTarget,
        
        __init__ : function() {
            
        },
        
        createCanvas: function() {
            
            var canvas = this.canvas = document.createElement( 'video' );
            
            canvas.className = 'player-canvas';
            
            canvas.addEventListener( 'pause', this.handleCanvasEvent.bind( this ), true );
            canvas.addEventListener( 'playing', this.handleCanvasEvent.bind( this ), true );
            canvas.addEventListener( 'timeupdate', this.handleCanvasEvent.bind( this ), true );
            canvas.addEventListener( 'volumechange', this.handleCanvasEvent.bind( this ), true );
            
            return canvas;
            
        },
        
        destroyCanvas: function() {
            
            for ( type in this.listeners ) {
                this.removeEventListener( type );
            }
            
        },
        
        play: function() {
            this.canvas.play();
        },
        
        pause: function() {
            this.canvas.pause();
        },
        
        setVolume: function( volume ) {
            this.canvas.volume = volume;
        },
        
        getVolume: function() {
            return this.canvas.volume;
        },
        
        setCurrentTime: function( currentTime ) {
            this.canvas.currentTime = currentTime;
        },
        
        getCurrentTime: function() {
            return this.canvas.currentTime;
        },
        
        getDuration: function() {
            return this.canvas.duration;
        },
        
        setSrc: function( src ) {
            this.canvas.src = src;
        },
        
        getSrc: function() {
            return this.canvas.src;
        },
        
        handleCanvasEvent: function( e ) {
            
            this.dispatchEvent( e );
            
        }
        
    });
    
    HTML5VideoEngine.isAvailable = function() {
        return true;
    };
    
    HTML5VideoEngine.canPlayType = function( mimeType ) {
        return HTML5VideoEngine.isAvailable() && document.createElement( 'video' ).canPlayType( mimeType );
    };
    
} )( phi.dom );