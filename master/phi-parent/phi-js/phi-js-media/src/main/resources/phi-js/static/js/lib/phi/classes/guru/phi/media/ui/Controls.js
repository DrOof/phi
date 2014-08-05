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
                    '<a href="#" class="player-control player-controls-play" rel="player:play">' + 
                        '<i class="fa fa-play"></i>' + 
                    '</a>' +
                    '<a href="#" class="player-control player-controls-pause" rel="player:pause">' + 
                        '<i class="fa fa-pause"></i>' + 
                    '</a>' +
                    '<a href="#" class="player-control player-controls-mute" rel="player:muted">' + 
                        '<i class="fa fa-volume-off"></i>' + 
                    '</a>' +
                    '<a href="#" class="player-control player-controls-unmute" rel="player:muted">' + 
                        '<i class="fa fa-volume-up"></i>' + 
                    '</a>' +
                    '<time class="player-controls-duration"></time>' +
                    '<time class="player-controls-current-time"></time>' +
                    '<time class="player-controls-remaining-time"></time>' +
                '</div>';
    
} )( phi.dom );