( function( dom ) {
    
    var graph = phi.graph = phi.graph || {};
    
    var GraphDialog = phi.graph.GraphDialog = phi({
        
        __extends__ : phi.dialog.Dialog,
        
        show: function( node, e ) {
            
            this.hide( node, e );
            
            var d = document.createElement( 'div' );
            d.innerHTML = this.renderTemplate( e.target.point );
            
            var child = d.firstChild;
            
            var x = e.target.getAttribute( 'cx' ) + 'px';
            var y = e.target.getAttribute( 'cy' ) + 'px';
            
            jQuery( child ).css( { top : y, left: x } );
            
            this.__parent__.appendChild( child );
            
        },
        
        renderTemplate : function( point ) {
            return this.__template__.parse({ point : point });             
        },
        
        hide: function( node, e ) {
            
            dom( this.__selector__, this.__parent__ ).remove();
            
        }
        
    });
    
} )( phi.dom );