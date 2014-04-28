( function( dom ) {
    
    phi.media.engine = phi.media.engine || {};
    
    var VimeoIFrameEngine = phi.media.engine.VimeoIFrameEngine = phi( {
        
        __implements__ : phi.media.engine.Engine,
        
        __extends__ : phi.mvc.EventTarget,
        
        __init__ : function() {
            
            
            
        },
        
        createCanvas: function() {
            
            var canvas = this.canvas = document.createElement( "iframe" );
            canvas.id = 'youtube-player-canvas';
            canvas.className = 'player-canvas';
            canvas.frameBorder = '0';
            canvas.height = '100%';
            canvas.width = '100%';
            
            return canvas;
            
        },
        
        destroyCanvas : function() {},
        handleCanvasEvent : function() {},
        
        play: function() {
            //
        },
        
        pause: function() {
            //
        },
        
        setSrc: function( src ) {
            this.canvas.src = src;
        },
        
        getSrc: function() {
            return this.canvas.src;
        },
        
        getVolume : function() {},
        setVolume : function() {},
        
        getDuration : function() {},
        // setDuration : function() {},
        
        getCurrentTime : function() {},
        setCurrentTime : function() {}
        
    });
    
    VimeoIFrameEngine.isAvailable = function() {
        return true;
    };
    
    VimeoIFrameEngine.canPlayType = function( mimeType ) {
        return VimeoIFrameEngine.isAvailable() && /video\/x\-vimeo/.test( mimeType );    
    };
    
    
} )( phi.dom );