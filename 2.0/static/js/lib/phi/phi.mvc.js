/*
 *
 * Model View Controller
 *
 *
 *
 */

(function() {
    
    
    var phi = window.phi || {};
    phi.mvc = {};
    
    
    
    
    var Observable = phi({
        
        __init__: function() {
            
            this.listeners = {};
            
        },
        
        addEventListener: function( type, fn ) {
            

            
            var fns = this.listeners[ type ] || [];
            
            if ( fns.indexOf( fn ) === -1 ) {
                fns.push( fn );
            }
            
            this.listeners[ type ] = fns;
            
        },
        
        removeEventListener: function( type, fn ) {
            
        },
        
        dispatchEvent: function( e ) {
            
            var fns = this.listeners[ e.type ] || [];
            
            for (var i = fns.length - 1; i >= 0; i--){
                fns[ i ]( e );
            };
            
        }
        
    });
    
    
	
    /*
     * Model
     *
     *
     */

    var Model = phi.mvc.Model = phi({
    
        __extends__: Observable,
    
        __init__: function() {
            this.super();
            this.__data__ = {};
        },
        
        change: function( path, value ) {
        
            this.__data__[ path ] = value;
            this.dispatchEvent( { type: 'modelchange', target: this.__data__[ path ], path: path, data: this.__data__ } );
            
        },
        
        save: function() {
            // TODO: implement save to local storage or backend
        }
        
    });
    
    
    /*
     * View
     *
     *
     */
    
    var View = phi.mvc.View = phi({
        
        __extends__: Observable,
        
        __init__: function() {
            this.super();
        },
        
        update: function( path, target ) {
            console.log( path, target );
        }
        
    });
    
    
    
    /*
     * Controller
     *
     *
     */
    
    var Controller = phi.mvc.Controller = phi({
    
        __init__: function( view, model ) {
            
            this.view = view;
            this.model = model;
            
            this.model.addEventListener( 'modelchange', this.handleModelChange.bind( this ) );
            
        },
        
        handleModelChange: function( e ) {
            console.log( 'handleModelChange', e );
            this.view.update( e.path, e.target );
        }
    
    });
    
    
    
    
    
    

})();