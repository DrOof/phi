( function() {
    
    phi.media.engine = phi.media.engine || {};
    
    var Engine = phi.media.engine.Engine = phi.interface( {
        
        createCanvas : function() {},
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
    
    Engine.canPlayType = function() { return false; };
    
} )();