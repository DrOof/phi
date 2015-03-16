( function( phi ) {
    
    var graph = phi.graph = phi.graph || {};

    var Tooltip = phi.graph.Tooltip = phi({
    
        __extends__ : phi.EventTarget,
        
        __init__ : function( template ) {
            this.__template__ = new phi.dom.Template( template || Tooltip.TEMPLATE );
        },

        createNode: function( parent, html ) {

            var canvas, node;

            canvas = document.createElement( 'div' );
            canvas.innerHTML = html;

            node = canvas.firstChild;

            // TODO : perhaps append to graph itself to keep self contained.
            parent.appendChild( node );
            
            return node;;

        },
        
        destroyNode: function( parent, child ) {
            parent.removeChild( child );
        },

        handlePointEnter: function( e ) {

            var target      = e.explicitOriginalTarget;
            var node        = this.createNode( e.target.__node__, this.__template__.parse( target.point ) );
            var box         = phi.dom.getOffsetBoundingBox( target );

            var style       = node.currentStyle || window.getComputedStyle( node );

            node.style.top  = ( box.top  - ( node.clientHeight    ) ) - parseInt( style[ 'margin-bottom' ] ) + 'px';
            node.style.left = ( box.left - ( node.clientWidth / 2 ) ) + ( box.width / 2 )                    + 'px';

            this.__active__ = node;

        },

        handlePointLeave: function( e ) {
            this.destroyNode( e.target.__node__, this.__active__ );
        },

        handlePointSelect: function( e ) {

            /*
            var target = e.explicitOriginalTarget;
            var node = this.createNode( this.__template__.parse( target.point ) );
            var offset = phi.dom.calculateOffset( target );
            
            node.style.top =    ( offset.top    - ( node.clientHeight    ) - 10 ) + 'px';
            node.style.left =   ( offset.left   - ( node.clientWidth / 2 ) + 20 ) + 'px'

            this.__active__ = node;
            */

        }

    });

    // NOTE: Why not set the graph-tooltip class directly in the template? 
    Tooltip.TEMPLATE =  '<div class="graph-tooltip"><h5 class="graph-tooltip-title">Tooltip</h5><div class="graph-tooltip-content">{{x}}, {{y}}</div></div>';

})( phi );
