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

(function( phi ) {

    // TODO : remove dependency on jQuery.
    var dom = phi.dom = {};

    /**
     *
     * Short hand to create a node
     *
     */

    phi.dom.node = function( element, attribute ) {
        return new phi.dom.Node( element, attribute );
    }

    /**
     *
     * Get parameters from url
     *
     */

    phi.dom.getParameters = function( url ) {
        
        var pairs = url.split('?')[1].split('&');
        var pair;
        
        var params = {};
        
        for ( var i = pairs.length - 1; i >= 0; i-- ) {
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

        var parent = element.parentElement;
        
        if ( parent ) {

            var results     = parent.querySelectorAll( selector );
            var match       = false;

            var result;
            for ( var i in results ) {
                result = results[ i ];
                if ( result && result.contains && result.contains( element ) ) { return element; }
            }
            
            return phi.dom.getClosestBySelector( parent, selector );
        }

        return undefined;

    };

    /**
     *
     * Node
     *
     */

    var __Node__ = phi.dom.Node = phi({

        /**
         *
         * Create an element or decorate it.
         *
         */

        __init__ : function( element, attributes ) {

            this.node = ( typeof element === 'string' ) ? document.createElement( element ) : element;
            this.attr( attributes || {} );

        },

        /**
         *
         * Set element attributes.
         *
         */

        attr: function( attributes ) {

            for ( var key in attributes ) {
                this.element[key] = attributes[ key ];
                this.element.setAttribute( key, attributes[ key ] );
            }

            return this;

        },

        /**
         *
         * Append a child
         *
         */

        append : function( child ) {

            if ( child instanceof phi.dom.Node ) {
                this.__append_node_child__( child );
            }

            if ( child instanceof Node ) {
                this.__append_native_child__( child );
            }
            
            if ( child instanceof Element ) {
                this.__append_native_child__( child );
            }

        },

        /**
         *
         * @deprecated
         *
         */

        __append_node_child__: function( child ) {
            this.node.appendChild( child.node );
        },

        __append_native_child__: function( child ) {
            this.node.appendChild( child );
        },

        /**
         *
         * Get bounding box
         *
         */

        getBoundingBox: function() {
            return phi.dom.getOffsetBoundingBox( this.node );
        }

    })

    /**
     *
     * Shape
     *
     */
    
    var svg = phi.svg = {
        
        /**
         *
         * Shorthand for shape element constructor
         *
         */
        
        shape: function( element, attribute ) {
            return new Shape( element, attribute );
        }
        
    };
    
    /**
     *
     * Shape
     *
     */

    var Shape = svg.Shape = phi({
    
        __init__ : function( element, attributes ) {
        
            this.element = ( typeof element === 'string' ) ? document.createElementNS( Shape.SVGNS, element ) : element;
            this.attr( attributes || {} )
        
        },

        /**
         *
         * Set attributes
         *
         */

        attr: function( attributes ) {
            
            for ( var key in attributes ) {
                this.element[ key ] = attributes[ key ];
                this.element.setAttribute( key, attributes[ key ] );
            }

            return this;

        },

        /**
         *
         * Append a child
         *
         */

        append: function( child ) {

            if ( child instanceof Shape ) {
                this.__append_shape_child__( child );
            }

            if ( child instanceof SVGElement ) {
                this.__append_native_child__( child );
            }

            return this;

        },

        /**
         *
         * @deprecated
         *
         */

        appendChild: function( child ) {
            return this.append( child )
        },

        __append_shape_child__: function( child ) {
            this.element.appendChild( child.element );
        },

        __append_native_child__: function( child ) {
            this.element.appendChild( child );
        },

        /**
         *
         * Get bounding box
         *
         */

        getBoundingBox: function() {
            return phi.dom.getOffsetBoundingBox( this.element );
        }

    });
    
    Shape.SVGNS = 'http://www.w3.org/2000/svg';
    
    /**
     *
     * A basic template parser to create new Nodes as a string
     *
     * To parse a value:
     * {{object.property}}
     *
     * To loop through an array
     * {{list array as object}}
     *     {{object.property}}
     * {{/list}}
     *
     * To use a conditional
     * {{if object.property}}
     *     {{object.property}}
     * {{else}}
     *     Empty
     * {{/if}}
     *
     */
    
    var Template = phi.dom.Template = phi({
        
        __init__: function( html ) {
            this.set( html );
        },
        
        /**
         *
         * @Deprecated
         * Parse template with data.
         *
         */

        parse: function( data, parent, html ) {
            console.log( '@Deprecated: This method is deprecated. Please use Template.render instead.' );
            return this.render( data, parent, html );
        },
        
        /**
         *
         * Render template with data.
         * 
         */

        render: function( data, html ) {
            
            html = this.__format_html__( html || this.__html__ );
            
            var open = Template.SYNTAX_OPEN;
            var close = Template.SYNTAX_CLOSE;
            var search = new RegExp( open + '\\s?([^}]*)\\s?' + close, 'g' );

            while ( result = search.exec( html ) ) {
                html = this.__render_tag__( result, html, data );
            }

            return html;

        },
        
        /**
         *
         * Format html
         *
         */
        
        __format_html__ : function( html ) {
            return html.replace( /(\n)/g, '' );
        },
        
        /**
         *
         * Find data by composity key
         *
         */
        
        __find_data_by_composite_key__ : function( data, key ) {
            key.split( '.' ).map( function( k ) { data = data[ k ]; });
            return data;
        },
        
        /**
         *
         * Render result.
         *
         */
        
        __render_tag__ : function( result, html, data ) {
            
            var open = Template.SYNTAX_OPEN;
            var close = Template.SYNTAX_CLOSE;
            
            var expression = result[ 1 ];
            
            var code = expression.split( ' ' );
            var token = code.shift();
            
            var start = result[ 0 ];
            var end = open + '/' + token + close;

            switch ( token ) {
                
                case 'if' : {
                    html = this.__render_complex_tag__( html, data, code.join( ' ' ), start, end, this.__render_if_complex_tag__.bind( this ) );
                    break;
                }
                
                case 'list' : {
                    html = this.__render_complex_tag__( html, data, code.join( ' ' ), start, end, this.__render_list_complex_tag__.bind( this ) );
                    break;
                }

                default : {
                    html = this.__render_simple_tag__( html, data, token, start );
                    break;
                }
                
            }
            
            return html;
            
        },
        
        /**
         *
         * Render simple
         *
         */
        
        __render_simple_tag__ : function( html, data, token, start ) {
            return html.replace( start, this.__find_data_by_composite_key__( data, token ) );
        },
        
        /**
         *
         * Render inner
         *
         */

        __render_complex_tag__: function( html, data, token, start, end, collector ) {

            var result = new RegExp( start + '.*?' + end, 'g' ).exec( html );
            var template = '';
            var complete = '';
            var collect = '';
            
            if ( result ) {
                
                complete = result[ 0 ];
                template = this.__create_complex_tag_template__( complete, start, end );
                collect = collector( html, data, token, template );

            }

            return html.replace( complete, collect );
            
        },
        
        /**
         *
         * Create complex tag template
         *
         */
        
        __create_complex_tag_template__ : function( complete, start, end ) {
            return new phi.dom.Template( complete.replace( start, '' ).replace( end, '' ) )
        },
        
        /**
         *
         * Render inner list
         *
         */
        
        __render_list_complex_tag__ : function( html, data, token, template ) {
            
            data = this.__find_data_by_composite_key__( data, token );
            
            var collect = [];
            for ( var n in data ) {
                collect.push( template.render( data[ n ] ) );
            }
            
            return collect.join( '' );
            
        },
        
        /**
         *
         * Render inner if
         *
         */
        
        __render_if_complex_tag__ : function( html, data, token, template ) {
            
            var collect = [];
            if ( this.__find_data_by_composite_key__( data, token ) ) {
                collect.push( template.render( data ) );
            }
            
            return collect.join( '' );
            
        },

        /**
         *
         * Set HTML
         *
         */

        set: function( html ) {
            this.__html__ = html;
        },

        /**
         *
         * Get HTML
         *
         */

        get: function() {
            return this.__html__;
        }
        
    });
    
    Template.SYNTAX_OPEN = '{{';
    Template.SYNTAX_CLOSE = '}}';
    
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
            var link  = phi.dom.getClosestBySelector( e.target, 'a' );
            
            if ( link ) {
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
            
            ( scope || document ).addEventListener( 'animationstart', this.handleAnimationStart.bind( this ) );
            ( scope || document ).addEventListener( 'MSAnimationStart', this.handleAnimationStart.bind( this ) );
            ( scope || document ).addEventListener( 'webkitAnimationStart', this.handleAnimationStart.bind( this ) );
            
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
                
                            var action = r.replace( this.prefix, '' ).replace( '-', '' );
                
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
            
            window.addEventListener( 'hashchange ready', this.handleHashChange.bind( this ), true );
            
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

    });

})( phi );