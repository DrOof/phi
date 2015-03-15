( function( phi ) {
    
    var graph = phi.graph = phi.graph || {};

    var Tooltip = phi.graph.Tooltip = phi({
    
        __extends__ : phi.EventTarget,
        
        __init__ : function( template ) {

            // NOTE: use spaces for tabs. ;)
            this.__template__ = new phi.dom.Template( template || Tooltip.TEMPLATE );

            // NOTE : use __privateVariable__ as a rule
            this.__node__ = this.createNode();
            document.body.appendChild( this.__node__ );

        },

        createNode: function(  ) {
            
            var node = document.createElement( 'div' );
            node.className = 'graph-tooltip';
            
            return node;

        },

        // NOTE : use convention handleEventName? 
        handlePointEnter: function( e ) {

            // use spaces around method arguments ( arg1, arg2 )
            var target =  e.explicitOriginalTarget,
                label = target.getAttribute( 'label' );

                // NOTE : this may not always work.
            var x = target.getAttribute( 'x' ),
                y = target.getAttribute( 'y' ),

                offset = phi.dom.calculateOffset( target );

                var node = this.__node__;
                node.innerHTML = this.__template__.parse( target.point );

                // Show the tooltip
                node.className             += ' active';
                node.style.top              = ( offset.top - ( node.clientHeight / 2 ) ) + 'px';
                node.style.left             = ( offset.left + 15 ) + 'px'


        },

        handlePointLeave: function( e ) {

            var target = e.explicitOriginalTarget;
            this.__node__.className = this.__node__.className.replace( ' active', '' );

        },

        handlePointSelect: function( e ) {

        }

    });

    // NOTE: Why not set the graph-tooltip class directly in the template? 
    Tooltip.TEMPLATE =  '<h5 class="graph-tooltip-title">{{label}}</h5><div class="graph-tooltip-content">{{x}}, {{y}}</div>';

})( phi );
