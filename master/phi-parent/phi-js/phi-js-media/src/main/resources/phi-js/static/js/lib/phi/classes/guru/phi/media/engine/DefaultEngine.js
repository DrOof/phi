( function() {
    
    phi.media.engine = phi.media.engine || {};
    
    var DefaultEngine = phi.media.engine.DefaultEngine = phi( {
        
        __implements__ : phi.media.engine.Engine,
        
        __extends__ : phi.EventTarget,
        
        createCanvas : function() {
            
            var canvas = this.canvas = document.createElement( 'div' );
            canvas.className = 'player-canvas';
            
            canvas.innerHTML = '<p class="player-error"> Unfortunately, we are unable to play this video on the current device. </p>';
            
            return canvas;
            
        },
        
        destroyCanvas : function() {},
        handleCanvasEvent : function() {},
        
        play : function() {},
        pause : function() {},
        
        getSrc : function() {},
        setSrc : function() {},
        
        getVolume : function() {},
        setVolume : function() {},
        
        getDuration : function() {},
        // setDuration : function() {},
        
        getCurrentTime : function() {},
        setCurrentTime : function() {}
        
    } );
    
    DefaultEngine.canPlayType = function() { return true; };
    
} )();