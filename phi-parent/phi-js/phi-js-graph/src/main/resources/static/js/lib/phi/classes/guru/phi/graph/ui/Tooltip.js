( function( phi ) {
    
    var graph = phi.graph = phi.graph || {};

    var Tooltip = phi.graph.Tooltip = phi({
    
        __extends__ : phi.EventTarget,
        
        __init__ : function( template ) {
            this.__template__ = new phi.dom.Template( template || Tooltip.TEMPLATE );
        },

        /**
         *
         * Create node
         * TODO : add JSDoc
         *
         */

        __create_node__: function( parent, html ) {

            var canvas = document.createElement( 'div' );
                canvas.innerHTML = html;

            var node = canvas.firstChild;
                parent.appendChild( node );
            
            return node;;

        },

        /**
         *
         * Create node
         * TODO : add JSDoc
         *
         */

        __remove_node__: function( parent, child ) {
            parent.removeChild( child );
        },

        /**
         *
         * Handle point enter
         *
         */

        handlePointEnter: function( e ) {

            var target      = e.explicitOriginalTarget;
            var node        = this.__create_node__( e.target.__node__, this.__template__.parse( target.point ) );
            var box         = phi.dom.getOffsetBoundingBox( target );

            var style       = node.currentStyle || window.getComputedStyle( node );

            node.style.top  = ( box.top  - ( node.clientHeight    ) ) - parseInt( style[ 'margin-bottom' ] ) + 'px';
            node.style.left = ( box.left - ( node.clientWidth / 2 ) ) + ( box.width / 2 )                    + 'px';

            this.__active__ = node;

        },

        /**
         *
         * Handle point leave
         * TODO : add JSDoc
         *
         */

        handlePointLeave: function( e ) {
            this.__remove_node__( e.target.__node__, this.__active__ );
        },
        
        /**
         *
         * Handle point select
         * TODO : add JSDoc
         *
         */

        handlePointSelect: function( e ) {

        }

    });

    Tooltip.TEMPLATE =  '<div class="graph-point-info"><h5 class="graph-point-info-title">Info</h5><div class="graph-point-info-content">{{x}}, {{y}}</div></div>';

})( phi );
