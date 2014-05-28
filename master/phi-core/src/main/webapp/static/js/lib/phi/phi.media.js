( function( dom ) {
    
    // create script and style tags.
    
    var body = document.getElementsByTagName( 'body' )[0];
    
     function load( src ) {
        
        var script = document.createElement( 'script' );
            script.src = src;
            
        body.appendChild( script );
        
    }
    
    load( '/wappzapp-static/static/js/lib/phi/media/Player.js' );
    load( '/wappzapp-static/static/js/lib/phi/media/Source.js' );
    load( '/wappzapp-static/static/js/lib/phi/media/ui/Controls.js' );
    load( '/wappzapp-static/static/js/lib/phi/media/ui/AspectRatio.js' );
    load( '/wappzapp-static/static/js/lib/phi/media/engine/HTML5VideoEngine.js' );
    load( '/wappzapp-static/static/js/lib/phi/media/engine/VimeoIFrameEngine.js' );
    load( '/wappzapp-static/static/js/lib/phi/media/engine/YouTubeIFrameEngine.js' );
    
})( phi.dom );