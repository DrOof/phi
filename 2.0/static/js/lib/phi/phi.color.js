(function( window, document, phi, dom ) {
    
    
    phi.color = {};
    
    
    var ColorPicker = phi.color.ColorPicker = phi({
        
        __extends__ : phi.mvc.Observable,
        
        __init__ : function( node, color ) {
            
            this.node = dom( node );
            
            this.colorDragger = this.createColorDragger( this.node );
            this.hueDragger = this.createColorHueDragger( this.node );
            
            this.node.bind( 'mousedown', this.handleMouseDown.bind( this ) );
            
			color = color || node.getAttribute('data-color') || '#ff0000';
			
	        	// var hsv = this.hexToHSV( color );
	        	// this.hsv( hsv );
        	this.hex(color);
            
        },
        
        saturation: 0,
        value: 100,
        hue: 0,
        
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
            
            var hexNum = this.hex();
            this.node.find('.color-picker-input').val(this.hexStripped(hexNum));
            
            this.dispatchEvent( { type: 'colorchange' } );
            
        },
        
        handleColorHueChange: function( e ) {
            
            /* calculate color */
            var hue = 360 - Math.round( e.target.valueY() * 3.6 );
            this.hue = ( hue === 360 ) ? 0 : hue;
            
            this.node.find( '.color-picker' ).css( { 'background-color' : this.hsvToHEX( [ this.hue, 100, 100 ] ) } );
            this.node.find( '.color-preview' ).css( { 'background-color' : this.hex() } );
            
            var hexNum = this.hex();
            this.node.find('.color-picker-input').val(this.hexStripped(hexNum));
            
            this.dispatchEvent( { type: 'colorhuechange' } );
            
        },
        
        handleMouseDown: function(e) { 
        	
        	if(e.target.className === 'color-picker'){
        		
        		this.mouseDownColorPicker(e);
        		
        	}else if(e.target.className === 'color-hue-picker'){
        		
        		this.mouseDownColorHuePicker(e);
        	}
        },
        
        mouseDownColorPicker: function(e){
        	
        	// console.log('COLOR mouseDownColorPicker dom(e.target)=',dom(e.target));
        	
        	// if we have clicked on the colorDragger - do nothing (now taken care of in handleMouseDown)
        	// if (dom(e.target).closest( this.colorDragger.draggable).length !== 0 ) return;
        	
        	var x, y, w, h, left, top;
        	
        	var scope = dom(e.target);
        	
        	var cs = window.getComputedStyle(scope[0]);
        	
        	w = parseInt(cs.width);
        	h = parseInt(cs.height);
        	
        	x = e.pageX - scope.offset().left - 1;// needs 1 px adjustment for some reason
            y = e.pageY - scope.offset().top - 1;
            
            if(x < 0 || x > w || y < 0 || y > h){
            	return;
            }
            
            // console.log('COLOR mouseDownColorPicker x,y=',x,y);
            
            left = this.normalize(x, 0, 220) * 100;
            top = this.normalize(y, 0, 220) * 100;
            
			// set color picker bezel
            scope.find( '.color-picker-bezel' ).css("left", left + "%");
            scope.find( '.color-picker-bezel' ).css("top", top + "%");
            
            var e = {target: this.colorDragger.draggable, preventDefault: function(){}};
            this.colorDragger.handleMouseDown(e)
        },
        
        mouseDownColorHuePicker: function(e){
        	
        	var y, h, top;
        	
        	var scope = dom(e.target);
        	
        	var cs = window.getComputedStyle(scope[0]);
        	
        	h = parseInt(cs.height);
        	
            y = e.pageY - scope.offset().top - 1;// needs 1 px adjustment for some reason
            
            if(y < 0 || y > h){
            	return;
            }
            
            // console.log('COLOR mouseDownColorHuePicker y=',y);
            
            top = this.normalize(y, 0, 220) * 100;
            
			// set color picker bezel
            scope.find( '.color-picker-bezel' ).css("top", top + "%");
            
            var e = {target: this.hueDragger.draggable, preventDefault: function(){}};
            this.hueDragger.handleMouseDown(e)
        },
        
        hsvToRGB: function( hsv ) {
            
            var r, g, b;
        	var i;
        	var f, p, q, t;
            
        	// Make sure our arguments stay in-range
        	h = Math.max(0, Math.min(360, hsv[0] ));
        	s = Math.max(0, Math.min(100, hsv[1] ));
        	v = Math.max(0, Math.min(100, hsv[2] ));

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
        
        rgbToHSV:function (rgb) {
		    var rr, gg, bb,
		        r = rgb[0] / 255,
		        g = rgb[1] / 255,
		        b = rgb[2] / 255,
		        h, s,
		        v = Math.max(r, g, b),
		        diff = v - Math.min(r, g, b),
		        diffc = function(c){
		            return (v - c) / 6 / diff + 1 / 2;
		        };
		
		    if (diff == 0) {
		        h = s = 0;
		    } else {
		        s = diff / v;
		        rr = diffc(r);
		        gg = diffc(g);
		        bb = diffc(b);
		
		        if (r === v) {
		            h = bb - gg;
		        }else if (g === v) {
		            h = (1 / 3) + rr - bb;
		        }else if (b === v) {
		            h = (2 / 3) + gg - rr;
		        }
		        if (h < 0) {
		            h += 1;
		        }else if (h > 1) {
		            h -= 1;
		        }
		    }
		    
		    return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)]
		},
        
        rgbToHEX: function( rgb ) {
            
            function nth( n ) {
                var h = n.toString( 16 );
                return ( h.length == 1 ) ? '0' + h : h;
            }
            
            return [ '#', nth( rgb[ 0 ] ), nth( rgb[ 1 ] ), nth( rgb[ 2 ] ) ].join('');
            
        },
        
        hexToRgb:function(hex) {
            
		    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		        return r + r + g + g + b + b;
		    });
		
		    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
		    
		    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
            
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
			var rgb = this.hexToRgb(hex);
			// console.log('1 hexToHSV::rgb=',rgb);//nn
            var hsv = this.rgbToHSV(rgb);
            return hsv;
		},
		
        __set_color_pickers__:function(){
        	
        	// set preview bar
            this.node.find( '.color-preview' ).css( { 'background-color' : this.hex() } );
            
            // set color picker bg with hue at maximum saturation & lightness
            var maxHSV = this.__get_hsv__();
            maxHSV[1] = maxHSV[2] = 100;
            this.node.find( '.color-picker' ).css( { 'background-color' : this.hsvToHEX( maxHSV ) } );
            
            // set hue picker bezel
            var huePerc = this.hue * 100 / 360;
            var bezelPerc = 100 - huePerc; 
            this.node.find( '.color-hue-picker-bezel' ).css("top", bezelPerc + "%");
            
            // set color picker bezel
            this.node.find( '.color-picker-bezel' ).css("left", this.saturation + "%");
            this.node.find( '.color-picker-bezel' ).css("top", (100 - this.value) + "%");
            
            // set input field - DON'T FEEDBACK TO INPUT FIELD - value can come back from color value conversion process 1 out,
            // which forces a different color code to the one just input which is confusing to the user
            // (I think the discrepancy happens in rgbToHSV, I tried several different algorithms all with the same result)
            // var hexNum = this.hex();
            // this.node.find('.color-picker-input').val(this.hexStripped(hexNum));
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
                this.__set_color_pickers__();
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
        
        // strip leading #
        hexStripped: function(pHex){
        	
        	return pHex.substr(1);
        },
        
        normalize: function ( value, a, b ){
				 
			var min = ( a < b ) ? a : b;
			var max = ( a > b ) ? a : b;
			return (value - min) / (max - min);
				 
		},
        
    });
    
    
})(window, document, phi, jQuery );