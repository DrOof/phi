( function( dom ) {
    
    
    phi.ui.color = {};
    
    
    var ColorPicker = phi.ui.color.ColorPicker = phi({
        
        __extends__ : phi.EventTarget,
        
        __init__ : function( node, color ) {
            
            this.node = dom( node );
            
            this.createColorDragger( this.node );
            this.createColorHueDragger( this.node );
			
            this.hex( color || node.getAttribute('data-color') || '#ff0000' );
			
	        this.saturation = 0;
	        this.value = 100;
	        this.hue = 0;
            
        },
        
        createColorDragger: function( node ) {
            
            var dragger = new phi.dom.RelativeDragger( node.find( '.color-picker' ), node.find( '.color-picker-bezel' ), {} );
            dragger.addEventListener( 'dragmove', this.handleColorChange.bind( this ) );
            return dragger;
            
        },
        
        createColorHueDragger: function( node ) {
            
            var dragger = new phi.dom.RelativeDragger( node.find( '.color-hue-picker' ), node.find( '.color-hue-picker-bezel' ), { allowX: false } );
            dragger.addEventListener( 'dragmove', this.handleColorHueChange.bind( this ) );
            return dragger;
            
        },
        
        handleColorChange: function( e ) {
            
            /* calculate color */
            this.saturation = Math.round( e.target.valueX() );
            this.value = 100 - Math.round( e.target.valueY() );
            
            this.node.find( '.color-preview' ).css( { 'background-color' : this.hex() } );
            this.node.find( '.color-picker-input' ).val( this.hex().substr(1) );
            
            this.dispatchEvent( { type: 'colorchange' } );
            
        },
        
        handleColorHueChange: function( e ) {
            
            /* calculate color */
            var hue = 360 - Math.round( e.target.valueY() * 3.6 );
            this.hue = ( hue === 360 ) ? 0 : hue;
            
            this.node.find( '.color-picker' ).css( { 'background-color' : this.hsvToHEX( [ this.hue, 100, 100 ] ) } );
            this.node.find( '.color-preview' ).css( { 'background-color' : this.hex() } );
            this.node.find( '.color-picker-input' ).val( this.hex().substr(1) );
            
            this.dispatchEvent( { type: 'colorhuechange' } );
            
        },
        
        
        hsvToRGB: function( hsv ) {
            
            var r, g, b;
            var i;
            var f, p, q, t;
            
            // Make sure our arguments stay in-range
            h = Math.max( 0, Math.min( 360, hsv[0] ) );
            s = Math.max( 0, Math.min( 100, hsv[1] ) );
            v = Math.max( 0, Math.min( 100, hsv[2] ) );

            // We accept saturation and value arguments from 0 to 100 because that's
            // how Photoshop represents those values. Internally, however, the
            // saturation and value are calculated from a range of 0 to 1. We make
            // That conversion here.
            s /= 100;
            v /= 100;

            if ( s == 0 ) {
                // Achromatic (grey)
                r = g = b = v;
                return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
            }

            h /= 60; // sector 0 to 5
            i = Math.floor(h);
            f = h - i; // factorial part of h
            p = v * (1 - s);
            q = v * (1 - s * f);
            t = v * (1 - s * (1 - f));

            switch(i) {
                
                case 0:
                    r = v;
                    g = t;
                    b = p;
                    break;

                case 1:
                    r = q;
                    g = v;
                    b = p;
                    break;

                case 2:
                    r = p;
                    g = v;
                    b = t;
                    break;

                case 3:
                    r = p;
                    g = q;
                    b = v;
                    break;

                case 4:
                    r = t;
                    g = p;
                    b = v;
                    break;

                default: // case 5:
                    r = v;
                    g = p;
                    b = q;
            }
            
            return [ Math.round( r * 255 ), Math.round( g * 255 ), Math.round( b * 255 ) ];
			
        },
        
        rgbToHSV: function( rgb ) {
			
            var rr, r = rgb[0] / 255,
				gg, g = rgb[1] / 255,
				bb, b = rgb[2] / 255,
                
				h, 
				s,
                v = Math.max(r, g, b),
				
                diff = v - Math.min(r, g, b),
                diffc = function( c ) {
                    return ( v - c ) / 6 / diff + 1 / 2;
                };
        
            if ( diff == 0 ) {
                h = s = 0;
            } else {
				
                s = diff / v;
                rr = diffc( r );
                gg = diffc( g );
                bb = diffc( b );
        
                if ( r === v ) {
                    h = bb - gg;
                } else if ( g === v ) {
                    h = ( 1 / 3 ) + rr - bb;
                } else if ( b === v ) {
                    h = ( 2 / 3 ) + gg - rr;
                }
				
                if ( h < 0 ) {
                    h += 1;
                } else if ( h > 1 ) {
                    h -= 1;
                }
            }
            
            return [ Math.round( h * 360 ), Math.round( s * 100 ), Math.round( v * 100 ) ];
        },
        
        rgbToHEX: function( rgb ) {
            
            function nth( n ) {
                var h = n.toString( 16 );
                return ( h.length == 1 ) ? '0' + h : h;
            }
            
            return [ '#', nth( rgb[ 0 ] ), nth( rgb[ 1 ] ), nth( rgb[ 2 ] ) ].join('');
            
        },
        
        hexToRgb:function( hex ) {
            
            // Fix shorthand
            hex = hex.replace( /^#?([a-f\d])([a-f\d])([a-f\d])$/i, function( m, r, g, b ) {
                return r + r + g + g + b + b;
            });
        
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
            
            return result ? [ parseInt( result[1], 16 ), parseInt( result[2], 16 ), parseInt( result[3], 16 ) ] : null;
            
        },
        
        hsvToHEX: function( hsv ) {
            
            var rgb = this.hsvToRGB( hsv );//nn
            // console.log('hsvToHEX::rgb=',rgb);//nn
            function nth( n ) {
                var h = n.toString( 16 );
                return ( h.length == 1 ) ? '0' + h : h;
            }
            
            return [ '#', nth( rgb[ 0 ] ), nth( rgb[ 1 ] ), nth( rgb[ 2 ] ) ].join('');
            
        },
        
        hexToHSV:function(hex){
            var rgb = this.hexToRgb( hex );
            var hsv = this.rgbToHSV( rgb );
            return hsv;
        },
        
        __set_hsv__: function(hsv) {
            // console.log('__set_hsv__:: hsv=',hsv);//nn
            this.hue = hsv[0];
            this.saturation = hsv[1];
            this.value = hsv[2];
            
            // console.log('__set_hsv__:: hex=',this.hsvToHEX(hsv));//nn
        },
        
        __get_hsv__: function() {
            return [ this.hue, this.saturation, this.value ];
        },
        
        __set_rgb__: function() {
            
        },
        
        __get_rgb__: function() {
            return this.hsvToRGB( this.hsv() );
        },
        
        __set_hex__: function(pHex) {
            var hsv = this.hexToHSV( pHex );
            this.hsv( hsv );
        },
        
        __get_hex__: function() {
            return this.hsvToHEX( this.hsv() );
        },
        
        hsv: function( hsv ) {
            if ( hsv ) {
                this.__set_hsv__(hsv);
            } else {
                return this.__get_hsv__(); 
            }
        },
        
        rgb: function( rgb ) {
            if ( rgb ) {
                this.__set_rgb__();
            } else {
                return this.__get_rgb__(); 
            }
        },
        
        hex: function( hex ) {
            if ( hex ) {
                this.__set_hex__(hex);
            } else {
                return this.__get_hex__(); 
            }
        },
        
        fit: function ( value, a, b ){
                 
            var min = ( a < b ) ? a : b;
            var max = ( a > b ) ? a : b;
            return ( value - min ) / ( max - min );
			
        }
        
    });
    
    
})( phi.dom );