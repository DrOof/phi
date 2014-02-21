/*
 *
 * Model View Controller
 *
 *
 *
 */

(function(phi) {
    
    phi.mvc = {};
    
    
    /*
     *
     * Observable
     *
     */
    
    var Observable = phi.mvc.Observable = phi({
        
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
            
            var fns = this.listeners[ type ] || [];
            
            if ( !fn ) {
                fns = [];
            } else if ( fns.indexOf( fn ) !== -1 ) {
                fns = fns.splice( fns.indexOf( fn ), 1 );
            }
            
            this.listeners[ type ] = fns;
            
        },
        
        dispatchEvent: function( e ) {
            
            e.preventDefault = function() {};
            e.stopPropagation = function() {};
            
            e.target = e.target || this;
            
            var fns = this.listeners[ e.type ] || [];
            
            for (var i = fns.length - 1; i >= 0; i--){
                fns[ i ]( e );
            };
            
        }
        
    });
    
    
	
    /*
     *
     * Model
     *
     */

    var Model = phi.mvc.Model = phi({
    
        __extends__: Observable,
    
        __init__: function() {
            this.__data__ = {};
        },
        
        change: function( key, value ) {
            
            this.__data__[ key ] = value;
            this.dispatchEvent( { type: 'modelchange', key: key, target: this.__data__[ key ], data: this.__data__ } );
            
        },
        
        save: function() {
            // TODO: implement save to local storage or backend
        },
        
        set: function( key, value ) {
            this.change( key, value );
        },
        
        get: function( key ) {
            return this.__data__[ key ];
        }
        
    });
    
    
    /*
     *
     * View
     *
     */
    
    var View = phi.mvc.View = phi({
        
        __extends__: Observable,
        
        __init__: function( element ) {
            
            this.element = element;
            
        },
        
        update: function( key, target ) {
            
            var steps = key.split('/');
            var data = target;
            
            this.parse( key, data );
            
        },
        
        /*
         *
         * Parse the view and edit changed values.
         *
         */
        
        parse: function( key, data ) {
            
            var elements = this.element.querySelectorAll( '[data-key="' + key + '"]' );
            for ( var n in elements ) {
                elements[ n ].innerHTML = data;
            }
            
        }
        
    });
    
    
    
    /*
     *
     * Controller
     *
     */
    
    var Controller = phi.mvc.Controller = phi({
    
        __init__: function( view, model ) {
            
            this.view = view;
            this.model = model;
            
            model.addEventListener( 'modelchange', this.handleModelChange.bind( this ) );
            
        },
        
        /* Override this method. */
        onchange: function( e ) {
            this.view.update( e.key, e.target );
        },
        
        /* 
         *
         * Handles a change from the model, and calls the onchange method.
         *
         * @param e {Event}             A ModelChangeEvent.
         *
         */
        
        handleModelChange: function( e ) {
            this.onchange( e );
        }
    
    });
    
    

}(phi));