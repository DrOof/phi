(function(phi) {
     /**
    * Store object - provides means to store & retrieve objects from Local Storage based on unique prefix.
    *
    * @class
    * @name phi.Store
    */
    var Store = phi.data.Store = phi({
        
        __init__ : function( prefix ) {
            
            this.prefix = prefix;
            
        },
        
        save: function( key, object ) {
        	
            var prefix = this.prefix;
            localStorage.setItem( [ prefix, key ].join(':'), JSON.stringify( object ) );
            
        },
        
        load: function( key ) {
            var prefix = this.prefix;
            return JSON.parse( localStorage.getItem( [ prefix, key ].join(':') ) );
        }
        
    });
    
})(phi);