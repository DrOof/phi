/*

phi.dom.tv

@contains
- phi.dom.tv.KeyZone
- phi.dom.tv.KeyZoneManager

*/

(function(phi) {
    
    var dom = phi.dom;
    var tv = dom.tv = {};


	var Geo = dom.Geo;
    
    
    
    var KeyZone = tv.KeyZone = new Class({

        _init: function(node, options) {
            this.node = dom(node);
            this.node.css({
                background: 'rgba(0, 255, 128, 0.5)'
            });
        }

    });

	
	
	
	var KeyZoneManager = tv.KeyZoneManager = new Class({
	    
	    _static: {
        	ENTER: 13,
            FOCUS: 'focus', ACTIVE: 'active',
            UP: 38, RIGHT: 39, BOTTOM: 40, LEFT: 37,
            OFFSET_POSITION: 'bottom center' /* top left, bottom right etc etc */
	    },
		
		_init: function(scope, options) {
			
			this.zones = [];
			this.scope = scope;
			this.options = options;
			
			var zones = dom(options.zone, scope);
            for (var i = 0; i < zones.length; i++) {
                this.addKeyZone(zones[i], options);
            };
			
            this.relations = this.createKeyObserver();
			
		},
		
		createKeyObserver: function() {
		    
		    var observer = new phi.dom.KeyObserver();
		    
            observer.add(KeyZoneManager.ENTER, this.handleKeyEvent.bind(this));
            observer.add(KeyZoneManager.UP, this.handleKeyEvent.bind(this));
            observer.add(KeyZoneManager.RIGHT, this.handleKeyEvent.bind(this));
            observer.add(KeyZoneManager.BOTTOM, this.handleKeyEvent.bind(this));
            observer.add(KeyZoneManager.LEFT, this.handleKeyEvent.bind(this));
		    
		    return observer;
		    
		},
		
		handleKeyEvent: function(e) {
		    
		    var key = e.keyCode;
		    
		    if (key === KeyZoneManager.ENTER) { e.preventDefault();
		        
		        var select = this.getFocus();
		        select[0].triggerEvent('click');
		        
		    } else { 
		        
		        var aim = '';
		        switch (key) {
		            
                    case KeyZoneManager.UP : 
                        aim = 'top';      
                        break;
                        
                    case KeyZoneManager.RIGHT : 
                        aim = 'right';    
                        break;
                        
                    case KeyZoneManager.BOTTOM : 
                        aim = 'bottom';
                        break;
                        
                    case KeyZoneManager.LEFT : 
                        aim = 'left';     
                        break;
                        
                }
                
		        var from = this.getFocus();
    		    var scope = this.active;
    		    var to = dom(this.options.item, scope);
                
                var focus = this.findClosestGeometry(from, to, aim, scope);
                if (!focus) {
                    scope = this.findClosestGeometry(this.active, this.options.zone, aim, document);
                    to = dom(this.options.item, scope);
                    focus = this.findClosestGeometry(from, to, aim, scope);
                }
                this.setFocus(focus || from);
                
		    }
		    
		},
		
		moveFocus: function(from, to, aim, scope) {
		    
		},
		
		setActiveZone: function(active) {
		    this.active = active;
		},
		
		setFocus: function(to) {
		    
    	    if (this.focus) {
    	        this.focus.removeClass(KeyZoneManager.FOCUS);
    	    }
    	    
    	    this.focus = dom(to);
            this.focus.addClass(KeyZoneManager.FOCUS);
            this.focus.trigger('key:focus');
            
    	    this.setActiveZone(this.focus.closest(this.options.zone));
            
		},
		
		getFocus: function() {
		    return this.focus;
		},
		
		findClosestGeometry: function(from, to, aim, scope) {
		    
		    // all possible nodes
		    var possible = dom(to, scope).not(from); 
		    
		    // Apply filters until either a single element is left or none, in which case the current focus element is returned.
		    return  this.filterByDistance(from, 
                        this.filterByOrientation(from, 
                            this.filterByVisibility(from, possible, aim), 
                        aim), 
	                aim);
		    
		},
		
		filterByVisibility: function(from, possibilities, aim) {
		    return possibilities.not(':hidden');
		},
		
		filterByOrientation: function(from, possibilities, aim) {
		    
		    filters = {
		        top : function(a, b) {
		            return (a.top > b.top) ? 1 : 0;
		        },
		        right : function(a, b) {
		            return (a.left < b.left) ? 1 : 0;
		        },
		        bottom: function(a, b) {
		            return (a.top < b.top) ? 1 : 0;
		        },
		        left: function(a, b) {
		            return (a.left > b.left) ? 1 : 0;
		        }
		    }
            
            var offset = this.getCenterOffset;
            var a = this.getCenterOffset(from);
            
			return possibilities.filter(function() {
				var b = offset(this);
				return filters[aim](a, b);
			});
			
		},
		
		filterByDistance: function(from, possibilities, aim) {
		    var pos = this.getCenterOffset(from);
		    return possibilities.sort(function(a, b) {
                return (Geo.dist(pos, this.getCenterOffset(a)) > Geo.dist(pos, this.getCenterOffset(b))) ? 1 : -1;
		    }.bind(this))[0];  
		},
		
		getCenterOffset: function(node) {
		    var n = dom(node);
		    var o = n.offset();
		    o.left += n.width() / 2;
		    o.top += n.height();
		    return o;
		},
		
		addKeyZone: function(zone, options) {
			this.zones.push(new KeyZone(zone, options));
		},
		
		removeKeyZone: function(scope) {
            // 
		},
		
		removeAllKeyZones: function() {
		    for (var i in this.zones) {
                this.removeKeyZone(this.zones[i].scope);
		    }
		}
		
	});
    
})(phi);