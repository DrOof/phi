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
            
            var __canvas__ = this.__canvas__ = document.createElement( 'video' );
            
            __canvas__.className = 'player-__canvas__';
            
            __canvas__.addEventListener( 'pause', this.handleCanvasEvent.bind( this ), true );
            __canvas__.addEventListener( 'playing', this.handleCanvasEvent.bind( this ), true );
            __canvas__.addEventListener( 'timeupdate', this.handleCanvasEvent.bind( this ), true );
            __canvas__.addEventListener( 'volumechange', this.handleCanvasEvent.bind( this ), true );
            
            return __canvas__;
            
        },
        
        destroyCanvas: function() {
            
            for ( type in this.listeners ) {
                this.removeEventListener( type );
            }
            
        },
        
        play: function() {
            this.__canvas__.play();
        },
        
        pause: function() {
            this.__canvas__.pause();
        },
        
        setVolume: function( volume ) {
            this.__canvas__.volume = volume;
        },
        
        getVolume: function() {
            return this.__canvas__.volume;
        },
        
        setCurrentTime: function( currentTime ) {
            this.__canvas__.currentTime = currentTime;
        },
        
        getCurrentTime: function() {
            return this.__canvas__.currentTime;
        },
        
        getDuration: function() {
            return this.__canvas__.duration;
        },
        
        setSrc: function( src ) {
            this.__canvas__.src = src;
        },
        
        getSrc: function() {
            return this.__canvas__.src;
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