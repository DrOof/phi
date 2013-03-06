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
        
        addEventListener: function( type, listener ) {
            
        },
        
        removeEventListener: function( type, listener ) {
            
        },
        
        dispatchEvent: function( e ) {
            
        }
        
    });
    
    
    

    var Model = phi.mvc.Model = phi({
    
        __extends__: Observable,
    
        __init__: function() {
            this.super();
        },
        
        change: function( path, value ) {
        
            this.__data__[ path ] = value;
            this.dispatchEvent( { type: 'modelchange', target: this.__data__[ path ], path: path, data: this.__data__ } );
              
        },
        
        save: function() {
            // TODO: implement save to local storage or backend
        }
        
    });
    
    
    
    
    var View = phi.mvc.View = phi({
        
        __extends__: Observable,
        
        __init__: function() {
            this.super();
        },
        
        update: function( path, target ) {
            
        }
        
    });
    
    
    
    
    var Controller = phi.mvc.Controller = phi({
    
        __init__: function() {
            
            this.view = new View();
            this.model = new Model();
            
            this.model.addEventListener('modelchange', this.handleModelUpdate.bind( this ) );
            
        },
        
        handleModelChange: function( e ) {
            this.view.update( e.path, e.target );
        }
    
    });
    
    
    
    
    
    

})();