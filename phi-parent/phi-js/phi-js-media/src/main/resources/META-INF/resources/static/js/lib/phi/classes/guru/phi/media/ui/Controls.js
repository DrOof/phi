/**
 *
 * Phi Core - A multi-paradigm JavaScript library
 *
 * // Externalized source: javascript/phi/src/main/javascript
 *
 * Copyright (c) 2010 Authors of PHI
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 *
 */

( function( dom ) {
    
    phi.media.ui = phi.media.ui || {};
    
    var Controls = phi.media.ui.Controls = phi( {
        
        __extends__ : phi.EventTarget,
        
        __init__ : function() {
            
            this.controls = null;
            this.progress = null;
            
        },
        
        initialise: function() {
            
            this.createLinkRelations();
            this.createProgress();
            this.createVolume();
            
        },
        
        createProgress: function() {
            
            this.progress = new phi.dom.RelativeDragger( '.player-progress', '.player-progress-handle', { allowY: false } );
            this.progress.addEventListener( 'dragend', this.handleProgress.bind( this ) );
            
            // console.log( this.progress );
            
        },
        
        createVolume: function() {
            
            this.volume = new phi.dom.RelativeDragger( '.player-volume', '.player-volume-handle', { allowY: false } );
            this.volume.addEventListener( 'dragend', this.handleVolume.bind( this ) );
            
        },
        
        createLinkRelations: function() {
            
            var links = new phi.dom.LinkRelations( /player/ );
            
            links.add( 'play', this.handlePlay.bind( this ) );
            links.add( 'pause', this.handlePause.bind( this ) );
            links.add( 'muted', this.handleMuted.bind( this ) );
            
        },
        
        createControls: function() {
            var controls = this.controls = dom( HTML )[0];
            return controls;
        },
        
        handleMuted: function( e ) { e.preventDefault();
            this.dispatchEvent( { type : 'requestmuted', target : this } );
        },
        
        handlePlay: function( e ) { e.preventDefault();
            this.dispatchEvent( { type : 'requestplay', target : this } );
        },
        
        handlePause: function( e ) { e.preventDefault();
            this.dispatchEvent( { type : 'requestpause', target : this } );
        },
        
        handleProgress: function( e ) { 
            this.dispatchEvent( { type : 'requesttimeupdate', target : this } );
        },
        
        handleVolume: function( e ) { 
            this.dispatchEvent( { type : 'requestvolumechange', target : this } );
        },
        
        updateVolume: function( volume ) {
            
            
            
            if ( !this.volume.isDragging() ) {
                
                dom( this.controls ).find( '.player-volume-fill' ).css( { width : parseFloat( ( volume ) * 100 ) + '%' } );
                dom( this.controls ).find( '.player-volume-handle' ).css( { left : parseFloat( ( volume ) * 100 ) + '%' } );
                
                this.volume.valueX( parseFloat( ( volume ) * 100 ) );    
            }
            
        },
        
        updateCurrentTime: function( currentTime ) {
            dom( this.controls ).find( '.player-controls-current-time' ).html( this.secondsToHms( currentTime ) );
        },
        
        updateRemainingTime: function( remainingTime ) {
            dom( this.controls ).find( '.player-controls-remaining-time' ).html( this.secondsToHms( remainingTime ) );
        },
        
        updateDuration: function( duration ) {
            dom( this.controls ).find( '.player-controls-duration' ).html( this.secondsToHms( duration ) ).css( { width : parseInt( duration ) + '%' } );
        },
        
        updateProgress: function( currentTime, duration ) {
            
            if ( !this.progress.isDragging() ) {
                
                dom( this.controls ).find( '.player-progress-fill' ).css( { width : parseFloat( ( currentTime / duration ) * 100 ) + '%' } );
                dom( this.controls ).find( '.player-progress-handle' ).css( { left : parseFloat( ( currentTime / duration ) * 100 ) + '%' } );
                this.progress.valueX( parseFloat( ( currentTime / duration ) ) * 100 );
                
            }
            
        },
        
        secondsToHms: function( seconds ) {
            
            var h = '', m = '', s = '';
            
            h = Math.floor( ( seconds / 3600 ) % 24 );
            m = this.completeHmsSegment( Math.floor( ( seconds / 60 ) % 60 ) );
            s = this.completeHmsSegment( Math.floor( seconds % 60 ) );
            
            return [ h, m, s ].join(':');
            
        },
        
        completeHmsSegment: function( n ) {
            return n = ( n == 0 ) ? '00' : ( n < 10 ) ? '0' + n : n;
        }
        
    } );
    
    var HTML =     '<div class="player-controls">' + 
                    '<span class="player-progress">' +
                        '<time class="player-progress-fill"></time>' +
                        '<span class="player-progress-handle"></span>' +
                    '</span>' +
                    '<span class="player-volume">' +
                        '<var class="player-volume-fill"></var>' +
                        '<span class="player-volume-handle"></span>' +
                    '</span>' +
                    '<a href="#" class="player-control player-controls-play" rel="player-play">' + 
                        '<i class="fa fa-play"></i>' + 
                    '</a>' +
                    '<a href="#" class="player-control player-controls-pause" rel="player-pause">' + 
                        '<i class="fa fa-pause"></i>' + 
                    '</a>' +
                    '<a href="#" class="player-control player-controls-mute" rel="player-muted">' + 
                        '<i class="fa fa-volume-off"></i>' + 
                    '</a>' +
                    '<a href="#" class="player-control player-controls-unmute" rel="player-muted">' + 
                        '<i class="fa fa-volume-up"></i>' + 
                    '</a>' +
                    '<time class="player-controls-duration"></time>' +
                    '<time class="player-controls-current-time"></time>' +
                    '<time class="player-controls-remaining-time"></time>' +
                '</div>';
    
    /**
     *
     * TODO : remove jQuery
     * A progress bar.
     *
     */

    var Dragger = phi.dom.Dragger = phi( {

        __extends__ : phi.EventTarget,

        __init__: function( node, draggable, options ) {

            this.__node__ = dom( node || document );
            this.draggable = draggable;

            var options = options || {};

            this.constrain    = ( options.constrain === false ) ? false : true;
            this.allowX     = ( options.allowX === false ) ? false : true;
            this.allowY     = ( options.allowY === false ) ? false : true;

            this.__node__.bind( 'mousedown', this.handleMouseDown.bind( this ) );
            this.__node__.bind( 'touchstart', this.handleTouchStart.bind( this ));
            this.__node__.bind( 'touchmove', this.handleTouchMove.bind( this ));
            this.__node__.bind( 'touchend', this.handleTouchEnd.bind( this ));

        },

        isDragging: function() {
            return !!this.dragging;
        },

        grab: function( target ) {

            this.dragging = dom( target ).closest( this.draggable, this.__node__ );
            this.dragging.addClass( 'dragging' );

            this.dispatchEvent( { type : 'dragstart', target : this }  );

        },

        release: function( target ) {

            this.dispatchEvent( { type : 'dragend', target : this }  );

            this.dragging.removeClass( 'dragging' );
            this.dragging = null;

        },

        /* read only */
        value: function( x, y ) {
            return { x: this.valueX( x ), y: this.valueY( y ) };
        },

        /* get or set valueX */
        valueX: function( x ) {

            if ( x ) {
                this.move( x, 0 );
            }

            var left = 0;
            if ( this.isDragging() ) {
                left = parseInt( this.dragging.css( 'left' ) );
            }

            return left;

        },

        /* get or set valueY */
        valueY: function( y ) {

            if ( y ) {
                this.move( 0, y );
            }

            var top = 0;
            if ( this.isDragging() ) {
                 top = parseInt( this.dragging.css( 'top' ) );
            }

            return top;

        },

        drag: function( e ) {

            var x, y, w, h, left, top;

            x = e.pageX - this.__node__.offset().left;
            y = e.pageY - this.__node__.offset().top;

            w = this.__node__.outerWidth();
            h = this.__node__.outerHeight();

            this.move( x, y );

            this.dispatchEvent( { type : 'dragmove', target : this }  );

        },

        move: function( x, y ) {



            w = this.__node__.outerWidth();
            h = this.__node__.outerHeight();

            if ( this.constrain ) {
                x = (x > w) ? w : ((x < 0) ? 0 : x);
                y = (y > h) ? h : ((y < 0) ? 0 : y);
            }

            var css = {};
            if ( this.allowX ) {
                css['left'] = x;
            }

            if ( this.allowY ) {
                css['top'] = y;
            }

            if ( this.isDragging() ) {
                this.dragging.css( css );    
            }


        },

        handleMouseDown: function( e ) { e.preventDefault();

            if ( !dom( e.target ).closest( 'a' ).length && dom( e.target ).closest( this.draggable ).length ) {
                dom( document ).bind( 'mouseup.dragger mouseleave.dragger', this.handleMouseUp.bind( this ) );
                dom( document ).bind( 'mousemove.dragger', this.handleMouseMove.bind( this ) );
                this.grab( e.target );
                this.drag( e );
            }

        },

        handleMouseMove: function( e ) { e.preventDefault();
            this.drag( e );
        },

        handleMouseUp: function( e ) { e.preventDefault();
            dom( document ).unbind( 'mousemove.dragger mouseup.dragger mouseleave.dragger' );
            this.release( e.target );
        },

        handleTouchStart: function( e ) { e.preventDefault();

            var e = e.originalEvent.touches[0];

            if ( !dom( e.target ).closest( 'a' ).length && dom( e.target ).closest( this.draggable ).length ) {
                this.grab( e );
            }

        },

        handleTouchMove: function( e ) { e.preventDefault();

            var e = e.originalEvent.touches[0];
            this.drag( e );

        },

        handleTouchEnd: function( e ) { e.preventDefault();

            var e = e.originalEvent.touches[0];
            this.release(e);

        }

    });

    /**
     *
     * TODO : remove jQuery
     * Relative Dragger
     *
     */

    var RelativeDragger = phi.dom.RelativeDragger = phi({

        __extends__: Dragger,

        drag: function( e ) {

            var x, y, w, h, l, t, left, top;

            x = e.pageX - this.__node__.offset().left;
            y = e.pageY - this.__node__.offset().top;

            w = this.__node__.outerWidth();
            h = this.__node__.outerHeight();

            x = parseFloat( 100 * x / w );
            y = parseFloat( 100 * y / h );

            this.move( x, y );

            this.dispatchEvent( { type : 'dragmove', target : this }  );

        },

        move: function( x, y ) {

            if ( this.constrain ) {
                x = ( x > 100 ) ? 100 : ( ( x < 0 ) ? 0 : x );
                y = ( y > 100 ) ? 100 : ( ( y < 0 ) ? 0 : y );
            }

            var css = {};
            if ( this.allowX ) {
                css['left'] = x + '%';
            }

            if ( this.allowY ) {
                css['top'] = y + '%';
            }

            if ( this.isDragging() ) {
                this.dragging.css( css );    
            }


        },

        valueX: function( x ) {

            if ( x !== undefined ) {
                this.move( x, 0 );
            } else {
                return parseFloat( this.dragging.css( 'left' ) ) / this.__node__.outerWidth() * 100;
            }

        },

        valueY: function( y ) {

            if ( y !== undefined ) {
                this.move( 0, y );
            } else {
                return  parseFloat( this.dragging.css( 'top' ) ) / this.__node__.height() * 100;
            }

        }

    });
    
} )( phi.dom );