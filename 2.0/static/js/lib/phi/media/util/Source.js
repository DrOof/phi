( function( dom ) {
    
    phi.media.util = phi.media.util || {};
    
    var Source = phi.media.util.Source = phi({
        
        __init__ : function( src, mimeType ) {
            
            this.src = src;
            this.mimeType = mimeType || this.resolveMimeType( src );
            
            
        },
        
        resolveMimeType: function( src ) {
            
            var mimeType = 'video/x-unknown';
            
            if ( /\.mp4$/.test( src ) ) {
                mimeType = 'video/mp4';
            }
            
            if ( /\.ogv$/.test( src ) ) {
                mimeType = 'video/ogg';
            }
            
            if ( /\/\/www\.youtube\.com\/embed\//.test( src ) ) {
                mimeType = 'video/x-youtube';
            }
            
            if ( /\/\/player\.vimeo\.com\/video\//.test( src ) ) {
                mimeType = 'video/x-vimeo';
            }
            
            if ( /^ws\:\/\//.test( src ) ) {
                mimeType = 'video/x-zapp';
            }
            
            // assume youtube type
            return mimeType;
            
        }
        
    });
    
} )( phi.dom );