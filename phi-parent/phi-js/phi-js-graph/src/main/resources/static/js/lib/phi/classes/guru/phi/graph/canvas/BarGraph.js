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
    
    var graph = phi.graph = phi.graph || {};
    
    var BarGraph = phi.graph.BarGraph = phi({
        
        __extends__ : phi.graph.Graph,
        
        __init__ : function( node ) {
            
        },
        
        render: function( data ) {
            
            var values = this.resolveValuesByName( this.__options__.x.name );
            var rx = this.resolveRangeX();
            var d = this.resolveCanvasDimensions();
            
            for ( var i = 0; i < data.length; i++ ) {
                this.renderPoint( data[i], rx, values, d, i );
            }
            
        },
        
        renderPoint: function( point, rx, values, d, i ) {
            
            var s = ( d.width / values.length ); 
            
            var v = this.resolveValueX( point );
            var w = 30;
            var h = ( d.height / rx.max ) * v;
            var x = ( s * i )+ ( s / 2 );
            var y = d.height - h;
            
            this.renderPointRect( point, x, y, w, h );
            
        },
        
        renderPointRect: function( point, x, y, w, h ) {
            
            var rect = new phi.dom.svg.SVGShapeElement( 'rect', { x : x - ( w / 2 ), y : y, width : w, height : h, class : 'graph-point', stroke : 'none', point : point, id : phi.uuid() } );
            rect.element.addEventListener( 'mouseenter', this.handleMouseEnter.bind( this ), true );
            rect.element.addEventListener( 'mouseleave', this.handleMouseLeave.bind( this ), true );
            rect.element.addEventListener( 'mouseup', this.handleMouseUp.bind( this ), true );
            
            this.__canvas__.appendChild( rect );
            
        }
        
    });
    
} )( phi.dom );