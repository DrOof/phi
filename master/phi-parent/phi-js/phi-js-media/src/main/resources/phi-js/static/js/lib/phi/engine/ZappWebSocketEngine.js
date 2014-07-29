( function() {
    
    phi.media.engine = phi.media.engine || {};
    
    var ZappWebSocketEngine = phi.media.engine.ZappWebSocketEngine = phi( {
        
        __implements__ : phi.media.engine.Engine,
        
        __extends__ : phi.EventTarget,
        
        __init__ : function() {
            
            this.socket = null;
            
        },
        
        createCanvas : function() {
            
            var canvas = document.createElement( 'div' );
            canvas.className = 'player-canvas';
            
            /*
            var canvas = this.canvas = document.createElement( 'div' );
            canvas.className = 'player-canvas';
            
            canvas.innerHTML = '<p class="player-error"> Unfortunately, we are unable to play this video on the current device. </p>';
            */
            
            return canvas;
            
        },
        
        destroyCanvas : function() {
            
        },
        
        createWebSocket: function( src ) {
            
            var socket = new WebSocket( src );
            
            socket.onopen = this.handleOpen.bind( this );
            socket.onclose = this.handleClose.bind( this );
            socket.onmessage = this.handleMessage.bind( this );
            
        },
        
        play : function() {
            // send play message
        },
        
        pause : function() {
            // send pause message
        },
        
        getSrc : function(  ) {
            // send getSrc message
        },
        
        setSrc : function( src ) {
            
            console.log( src );
            this.socket = this.createWebSocket( src );
            
        },
        
        getVolume : function() {
            // send getVolume message
        },
        
        setVolume : function() {
            // send setVolume message
        },
        
        getDuration : function() {
            
        },
        
        getCurrentTime : function() {
            
        },
        
        setCurrentTime : function() {
            
        },
        
        handleOpen: function() {
            console.log( 'open', this );
            socket.send( 'remote,connect,' + value );
            
        },
        
        handleClose: function() {
            console.log( 'close', this );
        },
        
        handleMessage: function( e ) {
            console.log( 'message', this, e );
        },
        
        handleCanvasEvent : function() {
            
        }
        
    } );
    
    ZappWebSocketEngine.isAvailable = function() {
        return true;
    };
    
    ZappWebSocketEngine.canPlayType = function( mimeType ) {
        return ZappWebSocketEngine.isAvailable() && /video\/x\-zapp/.test( mimeType );
    };
    
} )();