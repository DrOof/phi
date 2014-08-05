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