/**
 *
 *
 * Slider
 *
 */

(function( dom ) {
    
    
    
    // TODO: write a decent feature test or animate properly using frames ( translateX || left )...

    /*
     *
     * Slider Widget JS API
     *
     */
    
    var slider = phi.slider = phi.slider || {};
    
    var Slider = phi.slider.Slider = phi( {

        __x        : 0,
        __y     : 0,
        __Dx     : 0,
        __EDx     : 0,

        __init__: function( node ) {

            // nodes
            this.__node__ = dom( node ); 
            
            // nodes
            this.list = this.__node__.find('.slider-list');
            this.renderControl( 0 );

            // handle events
            this.createEventBindings( this.__node__ );
            this.createLinkObserver( this.__node__ );
            
        },

        createEventBindings: function( node ) {
        
            node.bind('click', this.handleClick.bind(this) );

            node.bind('mousedown', this.handleMouseDown.bind(this) );
            node.bind('mouseup', this.handleMouseUp.bind(this) );
            node.bind('mouseleave', this.handleMouseLeave.bind(this) );

            node.bind('touchstart', this.handleTouchStart.bind(this) );
            node.bind('touchmove', this.handleTouchMove.bind(this) );
            node.bind('touchend', this.handleTouchEnd.bind(this) );
            
            dom( window ).bind('resize', this.handleResize.bind(this));
            
        },

        createLinkObserver: function( node ) {

            // Create a LinkRelationObserver.
            this.links = new phi.dom.LinkRelations( /slider/, node[0] );

            // Move the slider forward and backward.
            this.links.add('forward', this.forward.bind( this ) );
            this.links.add('back', this.back.bind( this ) );

        },

        /*
         *
         * Grab the slider
         *
         * @param e { Event }                                The Event or TouchEvent that starts moving the slider.
         *
         */

        grab: function( e ) {

            // this.startAnimation();
            
            // adding this class creates an ugly motion when dragging in firefox
            // without it dragging in chrome isn't as responsive - but still works well
            // this.__node__.addClass('moving');

            this.__y     = e.pageY;
            this.__x    = e.pageX;
            
        },

        /*
         *
         * Move the slider on an event.
         *
         * @param e { Event }                                The Event or TouchEvent that moves the slider.
         *
         */

        move: function( e ) {
            
            this.__Dx     = e.pageX - this.__x;
            this.render();
            
        },

        /*
         *
         * Release the slider. Snap to a convenient view if the threshold is passed for the displacement of x.
         * Add the current displacement to the summ of displacements, and forget the current displacement.
         *
         * @param e { Event }                                The Event or TouchEvent that releases the slider.
         *
         */

        release: function( e ) {

            this.__EDx     = this.snap( this.threshold( this.__Dx ) );
            this.__Dx    = 0;
            this.render();

        },

        /*
         *
         * Snaps to the nearest non-visible item in the slider in the direction of the change in x.
         *
         * @param         Dx     { Number }                        The displacement in x. In principle, only the direction matters ( i.e. 0, 1 or -1 ).
         * @returns     EDx     { Number }                    The adjust summ of all displacement, snapped to a convenient item.
         *
         */

        snap: function( Dx ) {
            return Dx ? this.nearest( Dx, this.__EDx ) : this.__EDx;
        },

        /*
         *
         * Move forward in the slider. Applies a snap with a negative displacement.
         *
         * @param [e] { Event }                                The optional Event or TouchEvent that requests the move forward.
         *
         */

        forward: function( e ) { if ( e ) { e.preventDefault() }
            this.__EDx     = this.snap( - 1 );
            this.render();
            // this.showSlideNum();
        },

        /*
         *
         * Move back in the slider.
         *
         * @param [e] { Event }                                The optional Event or TouchEvent that requests the move back.
         *
         */

        back: function( e ) { if ( e ) { e.preventDefault() }
            this.__EDx = this.snap( + 1 );
            this.render();
            
            // this.showSlideNum();    
            
        },

        /*
         *
         * Tests wether the requested change passes a given threshold.
         *
         * @param         Dx     { Number }                        The requested change in x.
         * @returns     Dx     { Number }                        The requested change in x or 0 if the threshold isn't passed.
         *
         */

        threshold: function( Dx ) {
            return ( Math.abs( Dx ) > Slider.THRESHOLD ) ? Dx : 0;
        },

        /*
         *
         * Constrains the slider between the minimum and maximum displacements.
         *
         * i.e. when the left most item in the slider aligns with the left side of the slider window,
         * or the right most item with the right side of the slider window.
         *
         * @param         EDx { Number }                        The sum of all changes in x.
         * @returns     EDx { Number }                        The constrained sum of all changes in x.
         *
         */

        constrain : function( EDx ) {

            var min = this.min(),
                max = this.max();

            return ( EDx > min ) ? min : ( EDx < max ) ? max : EDx;

        },

        /*
         *
         * Find the nearest not entirely visible item in the direction of the displacement ( Dx ),
         * using summ of all displacements ( EDx ) as a starting point.
         *
         * @param Dx { Number }                                The displacement in x.
         * @param EDx { Number }                            The summ of all displacements in x.
         * @returns EDx { Number }                            The reculated summ of all displacements in x.
         *
         */

        nearest: function( Dx, EDx ) {

            var direction = ( Dx < 0 ) ? 'forward' : 'back';

            // First update control this might change the width so after that recalculate the direction again
            this.renderControl( this[ direction ]( EDx ) );

            return this.constrain( this[ direction ]( EDx ) );

        },

        /*
         *
         * Calculate the minimum displacement ( i.e. left item aligns to the left ).
         *
         * @returns x { Number }                            The minimum displacements in x.
         *
         */

        min: function() {
            return 0;
        },

        /*
         *
         * Calculate the maximum displacement ( i.e. right item aligns to the left ).
         *
         * @returns x { Number }                            The maximum displacements in x.
         *
         */

        max: function() {

            var width     = this.__node__.width();

            var item     = this.list.find('> li:last-child')[0],
                x        = ( item ) ? item.offsetLeft : 0,
                w         = ( item ) ? item.offsetWidth : 0;

            return - ( x + w ) + width;

        },

        forward : function( EDx ) {

            var list     = this.list.find('> li'),
                width     = this.__node__.width(),
                item, x, w;

            for (var i = 0; i < list.length; i++) {

                item = list[ i ];

                x = item.offsetLeft;
                w = item.offsetWidth;
                if ( EDx + x + w > width ) {
                    return - ( x );
                }

            }

            return EDx;

        },

        back : function( EDx ) {

            var list     = this.list.find('> li'),
                width     = this.__node__.width(),
                item, x, w;

            for (var i = list.length - 1; i >= 0; i--) {

                item = list[ i ];

                x = item.offsetLeft;
                w = item.offsetWidth;
                if ( EDx + x < 0 ) {
                    return - ( x + w ) + width;
                }

            }

            return EDx;

        },
        
        render: function() {

            var EDx = this.__EDx + this.__Dx;
            this.transformList( EDx );
        },

        animateList: function( EDx ) {
            this.list.stop().animate({ 'left': EDx + 'px' });
        },

        transformList: function( EDx ) {
            this.list.css( 'transform', 'translateX(EDxpx)'.replace( /EDx/, EDx ) );
        },

        renderControl: function( EDx ) {

            this.__node__.addClass('forward-slider back-slider');

            if ( EDx >= this.min() ) { this.__node__.removeClass('back-slider'); }
            if ( EDx <= this.max() ) { this.__node__.removeClass('forward-slider'); }            
        },
        
        handleResize: function( e ) {

               // this.forward();
            
            this.__Dx = Slider.THRESHOLD + 1;
            this.release(e);

        },

        handleClick: function( e ) {

            if ( this.threshold( this.__x - e.pageX ) ) {
                e.preventDefault();
            }
            
        },

        handleMouseDown: function( e ) { e.preventDefault();

            this.__node__.bind('mousemove', this.handleMouseMove.bind( this ));
            this.grab( e );

        },

        handleMouseUp: function( e ) {
            e.preventDefault();

            this.__node__.unbind('mousemove');
            this.release( e );

        },

        handleMouseLeave: function( e ) { e.preventDefault();

            this.__node__.removeClass( 'moving' );
            this.__node__.unbind( 'mousemove' );
            this.__Dx    = 0;

        },

        handleMouseMove: function( e ) {

            this.move( e );

        },

        handleTouchStart: function( e ) {

            var touch = e.originalEvent.changedTouches[0];
            this.grab( touch );

        },

        handleTouchEnd: function( e ) {

            var touch = e.originalEvent.changedTouches[0];
            this.release( touch );

        },

        handleTouchMove: function( e ) {

            var touch =  e.originalEvent.changedTouches[0];
            if ( this.threshold( this.__x - touch.pageX ) ) {
                e.preventDefault();
            }

            this.move( touch );

        },

    });

    Slider.THRESHOLD = 20;
    
})( phi.dom );