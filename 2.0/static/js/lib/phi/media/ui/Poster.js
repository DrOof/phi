( function( dom ) {
    
    phi.media.ui = phi.media.ui || {};
    
    var Poster = phi.media.ui.Poster = phi({
        
        __init__ : function( poster ) {
            
            this.__poster__ = poster;
            
        },
        
        createPoster: function() {
            
            var poster = this.poster = dom( new phi.dom.Template( HTML ).parse( { 'poster' : this.__poster__ } ) )[0];
            return poster;
            
        }
        
    });
    
    var HTML =  '<div class="player-poster">' +
                    '<img src="{{poster}}" />' +
                '</div>';
    
} )( phi.dom );