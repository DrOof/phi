( function( dom ) {
    
    phi.media.ui = phi.media.ui || {};
    
    var AspectRatio = phi.media.ui.AspectRatio = phi({
        
        __init__ : function() {
            
        },
        
        createAspectRatio: function() {
            
            var ratio = this.ratio = dom( HTML )[0];
            return ratio;
            
        }
        
    });
    
    var HTML =  '<div class="player-aspect-ratio">' +
                    '<img src="/phi-site-webapp/phi-js/static/png/aspect-ratio-720p.png" alt="Aspect Ratio 720p" />' +
                '</div>';
    
} )( phi.dom );