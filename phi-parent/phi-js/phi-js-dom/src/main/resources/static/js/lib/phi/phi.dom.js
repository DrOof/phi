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

(function( phi, dom ) {
    
    phi.dom = dom;
    
    phi.dom.getParameters = function( url ) {
        
        var pairs = url.split('?')[1].split('&');
        var pair;
        
        var params = {};
        
        for (var i = pairs.length - 1; i >= 0; i--) {
            pair = pairs[i].split('=');
            params[ pair[ 0 ] ] = pair[ 1 ];
        }
        
        return params;
        
    };

    /**
     *
     * Get bounding box relative to offset parent.
     *
     */

    phi.dom.getOffsetBoundingBox = function( element ) {

        // get client rect from offset parent
        var box         = phi.extend( {}, element.getBoundingClientRect() );
        var offset      = element.offsetParent.getBoundingClientRect();
        var whitelist   = { top : 1, left : 1, bottom : -1, right : -1 };
        
        for ( var p in whitelist ) {
            box[ p ] = ( box[ p ] - ( offset[ p ] ) ) * whitelist[ p ];
        }

        return box;

    };
    
    /**
     *
     * Get closest by selector
     *
     */

    phi.dom.getClosestBySelector = function( element, selector ) {

        var parent      = element.parentElement;
        var results     = parent.querySelectorAll( selector );
        var match       = false;

        for ( var r in = results ) {
            match  = results[ r ].contains( element );
            if ( match ) { return element; }
        }

        return phi.dom.getClosestBySelector( parent, selector );

    };

    /**
     *
     * SVGShapeElement
     *
     */
    
    var svg = phi.svg = {
        
        /**
         *
         * Shorthand for shape element constructor
         *
         */
        
        shape: function( element, attribute ) {
            return new SVGShapeElement( element, attribute );
        }
        
    };
    
    var SVGNS = 'http://www.w3.org/2000/svg';
    var SVGShapeElement = svg.SVGShapeElement = phi({
    
        __init__ : function( element, attributes ) {
        
            this.element = ( typeof element === 'string' ) ? document.createElementNS( SVGNS, element ) : element;
            this.attr( attributes || {} )
        
        },
    
        attr: function( attributes ) {
            
            for( var key in attributes ) {
                
                this.element[key] = attributes[ key ];
                this.element.setAttribute( key, attributes[ key ] );
                
            }
        
        },
        
        appendChild: function( child ) {
            
            if ( child instanceof SVGShapeElement ) {
                this.appendShapeChild( child );
            }
            
            if ( child instanceof SVGElement ) {
                this.appendNativeChild( child );
            }
            
        },
        
        appendShapeChild: function( child ) {
            this.element.appendChild( child.element );
        },
        
        appendNativeChild: function( child ) {
            this.element.appendChild( child );
        }

    });
    
    /**
     *
     * A basic template parser to create new Nodes as a string
     *
     */
    
    var Template = phi.dom.Template = phi({
        
        __init__: function( html ) {
            this.set( html );
        },
        
        parse: function( data, parent, html ) {
            
            var html = html || this.get();
            var a = ( parent ) ? parent + '.' : '';
            var b = ( parent ) ? parent + '\\.' : '';
            
            for ( var name in data ) {
                
                if ( typeof name === 'string' ) {
                    
                    var property = new RegExp('\\{{' + b + name + '\\}}', 'g');
                    
                    if (typeof data[name] === 'object') {
                        html = this.parse( data[ name ], a + name, html );
                    } else {
                        html = html.replace( property, data[ name ] );
                    }
                }
            }
            
            return html;
            
        },
        
        set: function( html ) {
            this.html = html;
        },
        
        get: function() {
            return this.html;
        }
        
    });
    
    /**
     *
     * Observes links
     *
     */

    var LinkRelations = phi.dom.LinkRelations = phi({

        __init__: function( prefix, scope ) {
            
            ( scope || document ).addEventListener( 'click', this.handleClick.bind( this ), true );

            this.prefix = prefix || '';
            this.relations = {};

        },

        handleClick: function( e ) {

            // TODO : replace with 
            var link  = phi.dom.getClosestBySelector( e.target, 'a' ),
                rel   = link.getAttribute( 'rel' );
                
            if ( rel ) {
                var relations = rel.split(' ');
                var r = '';
                for ( var i = relations.length - 1; i >= 0; i--) {
                    r = relations[i];
                    if ( this.prefix.exec( r ) ) {
                        var action = r.replace( this.prefix, '' ).replace( '-', '' );
                        if ( action && this.relations[ action ] ) {
                            this.relations[ action ]( e );
                        }
                    }
                };    
            }
            
        },
        
        add: function( key, fn ) {
            this.relations[ key ] = fn;
        }

    });
    
    /**
     *
     * Observes animation
     *
     */
    
    var AnimationRelations = phi.dom.AnimationRelations = phi({
        
        __init__ : function( prefix, scope ) {

            this.prefix = prefix || '';
            this.relations = {};
            
            document.addEventListener( 'animationstart', this.handleAnimationStart.bind( this ) );
            document.addEventListener( 'MSAnimationStart', this.handleAnimationStart.bind( this ) );
            document.addEventListener( 'webkitAnimationStart', this.handleAnimationStart.bind( this ) );
            
        },
        
        handleAnimationStart: function( e ) {

            if ( this.prefix.test( e.animationName ) ) {
                var rel = e.target.getAttribute( 'rel' );
                if ( rel ) {
                    var relations = rel.split( ' ' );
                    var r;
                    for ( var i =  relations.length - 1; i >= 0; i-- ) {
                        r = relations[ i ];
                        if ( this.prefix.exec( r ) ) {
                            var key = r.replace( this.prefix, '' ).replace( '-', '' );
                            if ( key && this.relations[ key ] ) {
                                this.relations[ key ](e);
                            }
                        }
                    }
                }
            }
            
        },
        
        add: function( key, fn ) {
            this.relations[ key ] = fn;
        }
        
    });
    
    /**
     *
     * Observer field changes
     *
     */
    
    var FieldRelations = phi.dom.FieldRelations = phi({

        __init__: function( prefix, scope ) {
            
            dom( scope || document ).bind( 'change', this.handleChange.bind( this ) );
            
            this.prefix = prefix || '';
            this.relations = {};
            
        },

        handleChange: function( e ) {
            
            var field  = dom( e.target ).closest( 'input, textarea, select' ),  
                rel = field.attr( 'data-relation' );
                
                if ( rel ) {
                    var relations = rel.split(' ');
                    var r = '';
                    for (var i = relations.length - 1; i >= 0; i--){
                
                        r = relations[i];
                
                        if ( this.prefix.exec( r ) ) {
                
                            var action = r.replace( this.prefix, '' ).replace( ':', '' );
                
                            if ( action ) {
                    
                                if ( this.relations[ action ] ) {
                                    this.relations[ action ](e);
                                }
                            }
                        }
                    };    
                }
            
        },
        
        add: function( key, fn ) {
            this.relations[ key ] = fn;
        }

    });
    
    /**
     *
     * Observer hash changes
     *
     */
    
    var HashRelations = phi.dom.HashRelations = phi({

        __init__: function( prefix ) {
            
            dom( window ).bind( 'hashchange ready', this.handleHashChange.bind( this ) );
            
            this.prefix = prefix || '';
            this.relations = {};
            
        },

        handleHashChange: function( e ) {
            
            var rel = window.location.hash.replace( '#', '' );
            
            if ( rel ) {
                
                if ( this.prefix.exec( rel ) ) {
                    
                    var action = rel.replace( this.prefix, '' ).replace( /.*:|\?.*/g, '' );
                    
                    if ( action ) {
            
                        if ( this.relations[ action ] ) {
                            this.relations[ action ]( e );
                        }
                    }
                }  
            }
            
        },
        
        add: function( key, fn ) {
            this.relations[ key ] = fn;
        }

    });
    
    /*
     *
     * A progress bar.
     *
     */
    
    var Progress = phi.dom.Progress = phi({
        
        __extends__ : phi.EventTarget,
        
        __init__ : function( node ) {
            
            this.__node__ = dom( node );
            this.progress = 0;
            
        },
        
        update: function( progress ) {
            
            this.progress = Math.min( progress, 100 );
            this.__node__.find( '.progress-bezel' ).css({ width: this.progress + '%' });
            
            this.dispatchEvent( { type : 'progresschange', target: this.__node__[0] } );
            
        }
        
    });
    
    /**
     *
     * Dragger
     *
     */

    var Dragger = phi.dom.Dragger = phi( {
        
        __extends__ : phi.EventTarget,
    
        __init__: function( node, draggable, options ) {
            
            this.__node__ = dom( node || document );
            this.draggable = draggable;

            var options = options || {};

            this.constrain    = ( options.constrain === false ) ? false : true;
            this.allowX     = ( options.allowX === false ) ? false : true;
            this.allowY     = ( options.allowY === false ) ? false : true;
            
            this.__node__.bind( 'mousedown', this.handleMouseDown.bind( this ) );
            this.__node__.bind( 'touchstart', this.handleTouchStart.bind( this ));
            this.__node__.bind( 'touchmove', this.handleTouchMove.bind( this ));
            this.__node__.bind( 'touchend', this.handleTouchEnd.bind( this ));
            
        },
        
        isDragging: function() {
            return !!this.dragging;
        },
        
        grab: function( target ) {
            
            this.dragging = dom( target ).closest( this.draggable, this.__node__ );
            this.dragging.addClass( 'dragging' );
            
            this.dispatchEvent( { type : 'dragstart', target : this }  );
            
        },

        release: function( target ) {
            
            this.dispatchEvent( { type : 'dragend', target : this }  );
            
            this.dragging.removeClass( 'dragging' );
            this.dragging = null;
            
        },
        
        /* read only */
        value: function( x, y ) {
            return { x: this.valueX( x ), y: this.valueY( y ) };
        },
        
        /* get or set valueX */
        valueX: function( x ) {
            
            if ( x ) {
                this.move( x, 0 );
            }
            
            var left = 0;
            if ( this.isDragging() ) {
                left = parseInt( this.dragging.css( 'left' ) );
            }
            
            return left;
            
        },
        
        /* get or set valueY */
        valueY: function( y ) {
            
            if ( y ) {
                this.move( 0, y );
            }
            
            var top = 0;
            if ( this.isDragging() ) {
                 top = parseInt( this.dragging.css( 'top' ) );
            }
            
            return top;
            
        },
    
        drag: function( e ) {
        
            var x, y, w, h, left, top;
        
            x = e.pageX - this.__node__.offset().left;
            y = e.pageY - this.__node__.offset().top;
        
            w = this.__node__.outerWidth();
            h = this.__node__.outerHeight();

            this.move( x, y );
            
            this.dispatchEvent( { type : 'dragmove', target : this }  );
        
        },

        move: function( x, y ) {
            
            

            w = this.__node__.outerWidth();
            h = this.__node__.outerHeight();

            if ( this.constrain ) {
                x = (x > w) ? w : ((x < 0) ? 0 : x);
                y = (y > h) ? h : ((y < 0) ? 0 : y);
            }

            var css = {};
            if ( this.allowX ) {
                css['left'] = x;
            }
            
            if ( this.allowY ) {
                css['top'] = y;
            }
            
            if ( this.isDragging() ) {
                this.dragging.css( css );    
            }
            

        },

        handleMouseDown: function( e ) { e.preventDefault();
            
            if ( !dom( e.target ).closest( 'a' ).length && dom( e.target ).closest( this.draggable ).length ) {
                dom( document ).bind( 'mouseup.dragger mouseleave.dragger', this.handleMouseUp.bind( this ) );
                dom( document ).bind( 'mousemove.dragger', this.handleMouseMove.bind( this ) );
                this.grab( e.target );
                this.drag( e );
            }
        
        },
    
        handleMouseMove: function( e ) { e.preventDefault();
            this.drag( e );
        },
    
        handleMouseUp: function( e ) { e.preventDefault();
            dom( document ).unbind( 'mousemove.dragger mouseup.dragger mouseleave.dragger' );
            this.release( e.target );
        },
        
        handleTouchStart: function( e ) { e.preventDefault();
            
            var e = e.originalEvent.touches[0];
            
            if ( !dom( e.target ).closest( 'a' ).length && dom( e.target ).closest( this.draggable ).length ) {
                this.grab( e );
            }
            
        },
    
        handleTouchMove: function( e ) { e.preventDefault();
            
            var e = e.originalEvent.touches[0];
            this.drag( e );
            
        },
    
        handleTouchEnd: function( e ) { e.preventDefault();
            
            var e = e.originalEvent.touches[0];
            this.release(e);
            
        }
        
    });

    /**
     *
     * Relative Dragger
     *
     */
    
    var RelativeDragger = phi.dom.RelativeDragger = phi({

        __extends__: Dragger,

        drag: function( e ) {

            var x, y, w, h, l, t, left, top;
        
            x = e.pageX - this.__node__.offset().left;
            y = e.pageY - this.__node__.offset().top;
        
            w = this.__node__.outerWidth();
            h = this.__node__.outerHeight();

            x = parseFloat( 100 * x / w );
            y = parseFloat( 100 * y / h );

            this.move( x, y );

            this.dispatchEvent( { type : 'dragmove', target : this }  );
            
        },

        move: function( x, y ) {
            
            if ( this.constrain ) {
                x = ( x > 100 ) ? 100 : ( ( x < 0 ) ? 0 : x );
                y = ( y > 100 ) ? 100 : ( ( y < 0 ) ? 0 : y );
            }

            var css = {};
            if ( this.allowX ) {
                css['left'] = x + '%';
            }
            
            if ( this.allowY ) {
                css['top'] = y + '%';
            }
            
            if ( this.isDragging() ) {
                this.dragging.css( css );    
            }
            

        },
        
        valueX: function( x ) {
            
            if ( x !== undefined ) {
                this.move( x, 0 );
            } else {
                return parseFloat( this.dragging.css( 'left' ) ) / this.__node__.outerWidth() * 100;
            }
            
        },
        
        valueY: function( y ) {
            
            if ( y !== undefined ) {
                this.move( 0, y );
            } else {
                return  parseFloat( this.dragging.css( 'top' ) ) / this.__node__.height() * 100;
            }
            
        }

    });
    
    /**
     *
     * DateFormat
     *
     */

    var DateFormat = phi.dom.DateFormat = phi({

        __init__ : function( format ) {
            this.__format__ = format;
        },

        /**
         *
         * Formats a date
         *
         */

        format: function( date, format ) {

            format = format || this.__format__;
            
            var result = format, value, patterns = DateFormat.PATTERNS;
            for ( var key in patterns ) {
                result = result.replace( key, this.completePartial( patterns[ key ][ 0 ].apply( date ), key.length ) );
            }

            return result;

        },

        /**
         *
         * Parses a formatted date
         *
         */

        parse: function( date, format ) {

            format = format || this.__format__;

            var result = new Date();
            var patterns = DateFormat.PATTERNS;
            var pattern, match;
            for ( var key in patterns ) {
                pattern = new RegExp( key );
                match = format.match( pattern );
                if ( match ) {
                    patterns[ key ][ 1 ].call( result, date.substr( match.index, key.length ) );    
                }
            }
            
            return result;

        },

        completePartial: function( value, length ) {
            return '0000'.substr( 0, length - ( ('' + value).length ) ) + value;
        }

    });
    
    DateFormat.MONTHS = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
    
    var DATE = Date.prototype;
    DateFormat.PATTERNS = {
        'YYYY'  :   [ 
                        DATE.getFullYear, 
                        DATE.setFullYear  
                    ],
        'MMMM'  : 
                    [ 
                        function() { var m = DATE.getMonth.apply( this, arguments ); return DateFormat.MONTHS[ m ] }, 
                        function() { var m = DateFormat.MONTHS.indexOf( arguments[0] ); DATE.setMonth.apply( this, m ) }
                    ],
        'MMM'  : 
                    [ 
                        function() { var m = DATE.getMonth.apply( this, arguments ); return DateFormat.MONTHS[ m ].substr( 0, 3 ) }, 
                        function() { var m = DateFormat.MONTHS.indexOf( arguments[0] ); DATE.setMonth.apply( this, m ) }
                    ],
        'MM'    :   [ 
                        DATE.getMonth,
                        DATE.setMonth
                    ],
        'DD'    :   
                    [ 
                        DATE.getDate,
                        DATE.setDate
                    ],
        'hh'    :   [ 
                        DATE.getHours,
                        DATE.setHours
                    ],
        'mm'    :   [ 
                        DATE.getMinutes,
                        DATE.setMinutes
                    ],
        'ss'    :   [ 
                        DATE.getSeconds,
                        DATE.setSeconds
                    ]
    };
    
    /**
     *
     * NumberFormat
     *
     */
    
    var NumberFormat = phi.dom.NumberFormat = phi({
        
        __init__ : function( format ) {
            this.__format__ = format;
        },

        /**
         *
         * Parses a formatted number
         *
         */

        parse: function( number, format ) {
            
        },
        
        /**
         *
         * Formats a number
         *
         */

        format: function( number, format ) {
            
        }

    })

})(phi, jQuery);