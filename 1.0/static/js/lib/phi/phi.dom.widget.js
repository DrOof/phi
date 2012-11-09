



(function() {
	
	
	
	var phi = phi;
	var dom = phi.dom;
	var widget = dom.widget = {};
	
	
	
	var widget.ColorPicker = new Class({
		
		_init: function() {
			
			this.hue = new dom.Dragger();
			this.gradient = new dom.Dragger();
			
		},
		
		drawColorGradient: function() {
			
		},
		
		drawColorSwatch: function() {
			
		},
		
		hsvToRgb: function() {
		    
		}
		
	});
	
	
	
	
	
	
	/* example of draggers to create an HSLA color-picker */
    var colorGradient = document.getElementById('color');
    var ctx = colorGradient.getContext('2d');
    
    var h = 1.0, s = 0, v = 0;
    var drawColorGradient = function(h, s, v) {
        
        var grad, rgb;
        
        for (var i = 0; i < 256; i++) {
            
            grad = ctx.createLinearGradient(0, 0, 256, 0);
            
            rgb = hsvToRgb(h, 0.0, 0.0);
            grad.addColorStop(0.0, 'rgb(' + parseInt(rgb[0]) + ', ' + parseInt(rgb[1]) + ',' + parseInt(rgb[2]) + ')');
            
            rgb = hsvToRgb(h, i / 256, 1.0);
            grad.addColorStop(1.0, 'rgb(' + parseInt(rgb[0]) + ', ' + parseInt(rgb[1]) + ',' + parseInt(rgb[2]) + ')');
            
            ctx.fillStyle = grad;
            ctx.fillRect(0, i, 256, 1);
            
        };
        
    };
    
    var drawColorSwatch = function(h, s, v) {
        
        rgb = hsvToRgb(h, s, v);
        colorSwatch.style.backgroundColor = 'rgb(' + parseInt(rgb[0]) + ', ' + parseInt(rgb[1]) + ',' + parseInt(rgb[2]) + ')';
        
    };
    
    function hsvToRgb(h, s, v) {
        
        var r, g, b;

        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);

        switch(i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }

        return [r * 255, g * 255, b * 255];
        
    }
    
    var colorSwatch = document.getElementById('color-swatch');
    
    drawColorSwatch(1.0, 0, 0);
    new phi.dom.Dragger('.draggable', '#hsla-color-s-and-l').addEventListener('dragmove', function(e) {
        
        var x = phi.dom(e.target).position().left;
        var y = phi.dom(e.target).position().top;
        
        s = x / 256;
        v = y / 256;
        
        drawColorSwatch(h, s, v);
        
    });
    
    drawColorGradient(1.0, 0, 0);
    new phi.dom.Dragger('.draggable', '#hsla-color-hue', { allowX: false }).addEventListener('dragmove', function(e) {
        
        var y = phi.dom(e.target).position().top;
        h = parseFloat(y / 256);
        
        drawColorGradient(h, s, v);
        drawColorSwatch(h, s, v);
        
    });
	
})()