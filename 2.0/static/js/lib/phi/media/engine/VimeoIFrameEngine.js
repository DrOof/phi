( function( dom ) {
	
    phi.media.engine = phi.media.engine || {};
	
    var VimeoIFrameEngine = phi.media.engine.VimeoIFrameEngine = phi( {
		
        // __implements__ : phi.media.engine.Engine,
        
        __init__ : function() {
			
			
			
        },
		
        createCanvas: function() {
			
            var canvas = this.canvas = document.createElement( "iframe" );
            canvas.height = "100%";
            canvas.width = "100%";
            canvas.frameBorder = "0";
            
            return canvas;
			
        },
		
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
        }
		
    });
    
    VimeoIFrameEngine.isAvailable = function() {
        return true;
    };
    
    VimeoIFrameEngine.canPlayType = function( mimeType ) {
        return VimeoIFrameEngine.isAvailable() && /video\/x\-vimeo/.test( mimeType );    
    };
    
	
} )( phi.dom );