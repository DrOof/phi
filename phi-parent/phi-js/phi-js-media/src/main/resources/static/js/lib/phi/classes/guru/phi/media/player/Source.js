/**
 *
 * Phi Core - A multi-paradigm JavaScript library
 *
 * // Externalized source: javascript/phi/src/main/javascript
 *
 * Copyright (c) 2010 Authors of PHI
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 *
 */

( function( dom ) {
    
    var Source = phi.media.player.Source = phi({
        
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