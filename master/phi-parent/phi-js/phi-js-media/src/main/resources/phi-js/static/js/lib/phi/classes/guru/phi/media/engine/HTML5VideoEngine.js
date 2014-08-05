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
    
    phi.media.engine = phi.media.engine || {};
    
    var HTML5VideoEngine = phi.media.engine.HTML5VideoEngine = phi({
        
        __implements__ : phi.media.engine.Engine,
        
        __extends__ : phi.EventTarget,
        
        __init__ : function() {
            
        },
        
        createCanvas: function() {
            
            var canvas = this.canvas = document.createElement( 'video' );
            
            canvas.className = 'player-canvas';
            
            canvas.addEventListener( 'pause', this.handleCanvasEvent.bind( this ), true );
            canvas.addEventListener( 'playing', this.handleCanvasEvent.bind( this ), true );
            canvas.addEventListener( 'timeupdate', this.handleCanvasEvent.bind( this ), true );
            canvas.addEventListener( 'volumechange', this.handleCanvasEvent.bind( this ), true );
            
            return canvas;
            
        },
        
        destroyCanvas: function() {
            
            for ( type in this.listeners ) {
                this.removeEventListener( type );
            }
            
        },
        
        play: function() {
            this.canvas.play();
        },
        
        pause: function() {
            this.canvas.pause();
        },
        
        setVolume: function( volume ) {
            this.canvas.volume = volume;
        },
        
        getVolume: function() {
            return this.canvas.volume;
        },
        
        setCurrentTime: function( currentTime ) {
            this.canvas.currentTime = currentTime;
        },
        
        getCurrentTime: function() {
            return this.canvas.currentTime;
        },
        
        getDuration: function() {
            return this.canvas.duration;
        },
        
        setSrc: function( src ) {
            this.canvas.src = src;
        },
        
        getSrc: function() {
            return this.canvas.src;
        },
        
        handleCanvasEvent: function( e ) {
            this.dispatchEvent( e );
        }
        
    });
    
    HTML5VideoEngine.isAvailable = function() {
        return true;
    };
    
    HTML5VideoEngine.canPlayType = function( mimeType ) {
        return HTML5VideoEngine.isAvailable() && document.createElement( 'video' ).canPlayType( mimeType );
    };
    
} )( phi.dom );