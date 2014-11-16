/**
 *
 * Phi Core - A multi-paradigm JavaScript library
 *
 *
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
    
    var dialog = phi.dialog = {
        
        registered: {},
        relations: new dom.LinkRelations( /dialog/ ),
        
        /**
         *
         * creates a dialog and registers it to a relation
         *
         * @param type {Dialog}            The Dialog class to draw an instance from
         * @param name {String}            The name of the dialog relates to the relation attribute that triggers it
         * @param options {Object}        Options for the dialog to render
         *
         */
        
        createDialog: function( Dialog, name, options ) {
            
            var dialog = new Dialog( options );
            
            this.registered[ name ] = dialog;
            
            this.relations.add( name, dialog.open.bind( dialog ) );
            this.relations.add( name + '-close'  , dialog.close.bind( dialog ) );
            
            return dialog;
            
        },
        
        closeDialog: function( e ) {
            
            var registered = this.registered;
            for ( var name in registered ) {
                if ( !dom( e.target ).closest( registered[ name ].node ).length ) {
                    this.registered[ name ].close( e );
                }
            }
            
        }
        
    };
    
    /* dom( 'body' ).bind( 'click', dialog.closeDialog.bind( dialog ) ); */
    
    
    
    
    /**
     *
     * An Escapable Dialog can be closed with the 'esc' key after it is opened.
     *
     */
    
    var Escapable = phi.dialog.Escapable = phi.aspect({
        open: {
            after: function() {
                dom( document ).bind( 'keydown.dialog', function(e) {
                    if (e.keyCode === 27) { e.preventDefault();
                        this.close( e );
                    }
                }.bind(this));
            }
        },
        close: {
            after: function() {
                dom( document ).unbind('keydown.dialog');
            }
        }
    });
    
    
    
    
    /**
     *
     * An Escapable Dialog can be closed with the 'esc' key after it is opened.
     *
     */
    
    var Attention = phi.dialog.Attention = phi.aspect({
        create: {
            after: function() {
                var node = dom(this.node);
                node.find('input, textarea').eq(0).focus();
            }
        }
    });
    
    
    /**
     *
     * A Modal Dialog prevents the user interacting with other parts of the site while the dialog is open.
     *
     */
    
    var Modal = phi.dialog.Modal = phi.aspect({
        open: {
            after: function() {
                
                var overlay = dom('.overlay');
                
                if (!overlay.length) {
                    
                    var overlay = dom('<div class="overlay"></div>');
                    
                    overlay.hide();
                    overlay.appendTo('body');
                    overlay.show();
                    
                }
                
            }
        },
        close: {
            after: function() {
                dom('.overlay').remove();
            }
        }
    });
    
    
    
    var Closable = phi.dialog.Closable = phi.aspect({
        open: {
            after: function() {
                dom( document ).bind( 'click.closable', function( e ) {
                    
                    if ( !dom( e.target ).closest( this.node ).length ) {
                        this.close( e );
                    }
                    
                }.bind( this ) )
                
            }
        },
        close: {
            after: function() {
                dom( document ).unbind( 'click.closable' );
            }
        }
    });
    
    
    /**
     *
     * The default Dialog from which other dialogs inherit
     *
     */
    
    var Dialog = phi.dialog.Dialog = phi({
        
        __extends__ : phi.EventTarget,
        
        __init__ : function( options ) {
            
            if (typeof options !== "object") {
                options = {};
            }
            
            this.html = new dom.Template( options.html || '' );
            this.root = options.root || 'body';
            this.node = options.node;
            
        },
        
        /**
         *
         * finds a node and opens the dialog
         *
         * @param e {Event}            the event that opens the dialog
         *
         */
        
        open: function( e ) { e.preventDefault();
            var node = dom( this.node );
            this.show( node, e );
            
        },
        
        /**
         *
         * finds a node and closes the dialog
         * 
         * @param e {Event}            the event that closes the dialog
         *
         */
        
        close: function(e) { e.preventDefault();
            
            var node = dom( this.node );
            this.hide( node, e );
            
        },
        
        /**
         *
         * shows and/or adds the dialog
         * 
         * @param node {Object}        the node to show and/or add
         * @param e {Event}            the event that opened the dialog
         *
         */
        
        show: function( node, e ) {
            this.position( node, e );
            node.show();
        },
        
        /**
         *
         * hides and/or removes the dialog
         * 
         * @param node {Object}        the node to hide and/or remove
         * @param e {Event}            the event that closed the dialog
         *
         */
        
        hide: function( node, e ) {
            node.hide();
        },
        
        /**
         *
         * Adjust the position of a dialog.
         *
         * By default, dialogs are positioned with CSS. 
         * Override this method when CSS positioning is not sufficient.
         * 
         * @param node {Object}        the node to position
         * @param e {Event}            the event that opened the dialog
         *
         */
        
        position: function( node, e ) {
            // console.log( node, e );
        }
        
    });
    
    
    
    /**
     *
     *
     *
     */
    
    var AjaxDialog = dialog.AjaxDialog = phi({
        
        __extends__: Dialog,
        
        __applies__: [ Escapable, Modal, Attention ],
        
        /**
         *
         * creates a node and opens the dialog
         *
         * @param e {Event}        the event that opens the dialog
         *
         */
        
        open: function(e) { e.preventDefault();
            
            this.close(e);
            
            var link = dom(e.target).closest('a');
            var url = link.attr('href');
            
            dom.ajax({
                url: url,
                success: function( response ) {
                    this.create( response, e );
                }.bind( this )
            });
            
        },
        
        create: function( response, e ) {
            
            var html = this.html.parse({ content: response, uuid: phi.getUUID() });
            var node = dom( html );
            this.show( node, e );
            
        },
        
        /**
         *
         * shows and/or adds the dialog
         * 
         * @param node {Object}        the node to show and/or add
         * @param e {Event}            the event that opened the dialog
         *
         */
        
        show: function( node, e ) {
            
            node.hide();
            
            dom( this.root ).append( node );
            
            node.show();
            
            this.position(node, e);
            
        },
        
        position: function( node, e ) {
            
        },
        
        /**
         *
         * hides and/or removes the dialog
         * 
         * @param node {Object}        the node to hide and/or remove
         * @param e {Event}            the event that closed the dialog
         *
         */
        
        hide: function( node, e ) {
            
            dom( node ).remove();
            
        }
        
    });
    
    
    
    
    /**
     *
     *
     *
     */
    
    var TooltipDialog = phi({
        
        __extends__ : Dialog,
        
        __applies__: [ Escapable /*, Closable */ ], 
        
        open: function( e ) { 
            
            this.close( e );
            
            var content = dom( e.target ).closest('a').attr( 'data-dialog-content' );
            
            if ( content ) {
                this.create( content, e );
            }
            
        },
        
        create: function( content, e ) {
            
            var html = this.html.parse({ content: content, uuid: phi.getUUID() });
            var node = dom( html );
            
            dom( e.target ).closest( '.field' ).append( node.addClass( 'hidden' ) );
            dom( window ).bind( 'resize.tooltip-dialog', function() {
                this.position( node, e );
            }.bind( this ) );
            
            this.position( node, e )
            this.show( node, e );
            
        },
        
        show: function( node, e ) {
            node.removeClass( 'hidden' );
        },
        
        hide: function( node, e ) {
            node.remove();
        },
        
        position: function( node, e ) {
            
            var link = dom( e.target ).closest( 'a' );
            
            // position in a visible part of the dom.
            var fit = this.resolveFit( link, node );
            // console.log( 'TooltipDialog fit=',fit );
            node.css( fit.position ).removeClass( 'top left right bottom' ).addClass( fit.name );
            
        },
        
        resolveFit: function( link, node ) {
            
            /* get field as a box */
            var f = link.closest( '.field' ).offset();
            
            /* get window as a box */
            var w = {
                height  : dom( window ).innerHeight(),
                width   : dom( window ).innerWidth(),
                top     : dom( 'body' ).scrollTop(),
                left    : dom( 'body' ).scrollLeft()    
            };
            
            // FIXME - hack for error dialogs on the color picker fields in the settings form
            // If link is inside a top level column - measure the dimensions of that column rather than the
            // dimensions of the window
            // var column = link.closest('#shopskin-form-column');
            
            // var column = dom(dom('body').find('.columns')[0]); // starts at body level and looks for the first .columns element
            // console.log('column=',column);
            // if(column.length){
//                 
                // var w = {
                    // height  : column.outerHeight(),
                    // width   : column.outerWidth(),
                    // top     : dom( 'body' ).scrollTop(),
                    // left    : dom( 'body' ).scrollLeft()    
                // };
//                 
                // // console.log('width=',w.top);
            // }
            
            /* get link as a box */
            var l = {
                height  : link.outerHeight(),
                width   : link.outerWidth(),
                top     : link.offset().top,
                left    : link.offset().left
            };
            
            /* get node as a box */
            var n = {
                height  : node.outerHeight(),
                width   : node.outerWidth(),
                top     : node.offset().top,
                left    : node.offset().left
            };
            
            // console.log('window box=',w);
            // console.log('link box=',l);
            // console.log('node box=',n);
            // console.log('field box=',f);
            
            return this.fitRight( w, l, n, f ) || this.fitTop( w, l, n, f ) || this.fitBottom( w, l, n, f ) || this.fitLeft( w, l, n, f );
            
        },
        
        fitTop: function(  w, l, n, f ) {
            
            if ( l.top - n.height > w.top ) {
                return {
                    name : 'top',
                    position : {
                        left: l.left + l.width - n.width - f.left,
                        top: l.top - n.height - f.top
                    }    
                }
                
            }
            
        },
        
        fitRight: function( w, l, n, f ) {
            
            if ( l.left + l.width + n.width < w.width ) {
                return {
                    name : 'right',
                    position : {
                        left: l.left + l.width - f.left,
                        top: l.top + ( l.height / 2 ) - ( n.height / 2 ) - f.top
                    }
                }
            }
            
        },
        
        fitBottom: function( w, l, n, f ) {
            
            if ( l.top + l.height + n.height - w.top < w.height ) {
                return {
                    name : 'bottom',
                    position: {
                        left: l.left + l.width - n.width - f.left,
                        top: l.top + l.height - f.top    
                    }   
                }
            }
            
            return position;
            
        },
        
        fitLeft: function( w, l, n, f ) {
            
            
            if ( l.left - n.width > 0 ) {
                return {
                    name : 'left',
                    position : {
                        left: l.left - n.width - f.left,
                        top: l.top + ( l.height / 2 ) - ( n.height / 2 ) - f.top
                    }    
                }
            }
            
        },
        
    });
    
    
    
    
    
    
    
    
    
    
    
    
    /**
     *
     *
     *
     */
    
    var AjaxInsertDialog = phi({
        
        __extends__: Dialog,
        
        /**
         *
         * creates a node and opens the dialog
         *
         * @param e {Event}        the event that opens the dialog
         *
         */
        
        open: function( e ) { e.preventDefault();
            
            var link = dom(e.target).closest('a');
            var url = link.attr('href');
            
            
            console.log( e );
            
            
            dom.ajax({ url: url,
                success: function( response ) {
                    this.create( response, e );
                }.bind( this )
            });
            
        },
        
        create: function( content, e ) {
            
            var html = this.html.parse({ content: content, uuid: phi.getUUID() });
            var node = dom( html );
            
            this.show( node, e );   
            
        },
        
        /**
         *
         * shows and/or adds the dialog
         * 
         * @param node {Object}        the node to show and/or add
         * @param e {Event}            the event that opened the dialog
         *
         */
        
        show: function( node, e ) {
            this.position( node, e );
        },
        
        position: function( node, e ) {
            
            var href = dom( e.target ).closest( 'a' ).attr('href');
            var container = dom( '#' + href.split('#')[1] );
            
            container.append( node );

            
        },
        
        close: function( e ) { e.preventDefault();
            
            var node = dom( e.target ).closest( '.ajax-insert-dialog' );
            this.hide( node, e );
              
        },
        
        /**
         *
         * hides and/or removes the dialog
         * 
         * @param node {Object}        the node to hide and/or remove
         * @param e {Event}            the event that closed the dialog
         *
         */
        
        hide: function( node, e ) {
            node.remove();
        }
        
    });
    
    
    
    
    
    
    var AjaxReplaceInsertDialog = phi({
        
        __extends__ : AjaxInsertDialog,
        
        position: function( node, e ) {
            
            var href = dom( e.target ).closest( 'a' ).attr('href');
            var container = dom( '#' + href.split('#')[1] );
            
            container.replaceWith( node );
            
        }
        
    })
    
    
    
    
    
    
    
    
    /**
     *
     * Create and register basic types of dialog
     *
     */
    
    dialog.createDialog( Dialog, 'default',  { 
        node: '.dialog' 
    });
    
    dialog.createDialog( TooltipDialog, 'tooltip',  { 
        html: '<div class="tooltip-dialog">{{content}}<a href="#" class="dialog-close" rel="dialog:tooltip-close"><i class="fa fa-times"></i></a></div>',
        node: '.tooltip-dialog' 
    });
    
    dialog.createDialog( AjaxDialog, 'ajax', { 
        html: '<div class="ajax-dialog">{{content}}<a href="#" class="dialog-close" rel="dialog:ajax-close"><i class="fa fa-times"></i></a></div>', 
        node: '.ajax-dialog'
    });
    
    dialog.createDialog( AjaxInsertDialog, 'insert', { 
        html: '{{content}}',
        node: '.ajax-insert-dialog'
    });
    
    dialog.createDialog( AjaxReplaceInsertDialog, 'replace', { 
        html: '{{content}}',
        node: '.ajax-replace-insert-dialog'
    });
    
    
    
    
    
})( phi.dom );