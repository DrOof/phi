( function( phi ) {
    
    // phi.dom.register( '.player', phi.media.Player );
    // phi.dom.register( '.slider', phi.dom.Slider );
    var nodes = document.querySelectorAll( '.player' );
    for ( var i = nodes.length - 1; i >= 0; i--) {
        new phi.media.player.Player( nodes[i] );
    }
    
} )( phi );