//

(function() {
    
    
    
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
    
    
    

    var Model = phi({
    
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
    
    
    
    
    var View = phi({
        
        __extends__: Observable,
        
        __init__: function() {
            this.super();
        },
        
        update: function( path, target ) {
            
        }
        
    });
    
    
    
    
    var Controller = phi({
    
        __init__: function() {
            
            this.view = new View();
            this.model = new Model();
            
            this.model.addEventListener('modelchange', this.handleModelUpdate.bind( this ) );
            
        },
        
        handleModelChange: function( e ) {
            this.view.update( e.path, e.target );
        }
    
    });
    
    
    
    
    
    
    var ShoppingCartModel = phi({
        
        __extends__: Model,
        __init__: function() {
            this.super();
        },
        addProduct: function( product ) {
            this.products.push( product );
            this.set( 'products' , this.products );
        }
    })
    
    var ShoppingCartController = phi({
        __extends__: Controller,
        __init__: function() {
            
        },
        handleMouseEnter: function() {
            this.model.change('a/path/to/a/value', 0 );
        }
    });
    
    var ShoppingCartView = phi({
        __extends__: View,
        __init__: function() {
            
        }
    })
    

})();