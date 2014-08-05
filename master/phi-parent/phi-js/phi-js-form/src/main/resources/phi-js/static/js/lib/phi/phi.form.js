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

(function( phi, dom ) {
    
    phi.form = {};



    
    /*
     *
     * This Form class enhances forms with validation and dynamic form actions.
     *
     */
    
    var Form = phi.form.Form = phi({
        
        __extends__: phi.EventTarget,
        
        __init__: function( node ) {
            
            this.node = dom( node );
            
            /* disable native form validation */
            this.node.find( 'form' ).attr( 'novalidate', 'novalidate' );
            this.createEventListeners( node );
            
        },
        
        createEventListeners: function( node ) {
            
            node = dom( node );
            
            /* handle events */
            node.bind( 'change', this.handleChange.bind( this ) );
            node.bind( 'blur', this.handleBlur.bind( this ) );
            node.bind( 'submit', this.handleSubmit.bind( this ) );
            
        },
        
        handleChange: function( e ) {
            
            // console.log('FORM handleChange=', e.target);
            this.validate( e.target, true );
        },
        
        handleBlur: function( e ) {
            this.validate( e.target, true );
        },
        
        handleSubmit: function( e ) { 
            
                // if ( ! this.validateAll( true ) ) {
                    // // your form isn't valid... trigger the user to act
                // } else {
                    // // submit the form as normal
                // }
            
            // console.log('FORM handleSubmit calls VALIDATE_ALL');
            
            if ( !this.validateAll( true ) ) {
                
                // your form isn't valid... trigger the user to act
                console.log('phi.FORM::handleSubmit form not valid');
                e.preventDefault();
                
            } else {
                
                // submit the form as normal
                console.log('phi.FORM::handleSubmit form valid');
            }
        },
         
        validateAll: function( dispatch ) {  
            
            var nodes = dom( this.node ).find( ':text, select, :checkbox, textarea, :file' );
            
            var nodesToValidate = [];
            var valid = [], node;
            for (var i = nodes.length - 1; i >= 0; i--) {
                
                node = nodes[i];
                
                // Only push in node if it has a max, min, required or pattern attribute
                var dNode = dom(node);
                
                var isValidated = false;
                
                var min = dNode.attr('min');
                if (typeof min !== 'undefined' && min !== false) {
                   isValidated = true;
                }
                
                var max = dNode.attr('max');
                if (typeof max !== 'undefined' && max !== false) {
                   isValidated = true;
                }
                
                var required = dNode.attr('required');
                if (typeof required !== 'undefined' && required !== false) {
                   isValidated = true;
                }
                
                var pattern = dNode.attr('pattern');
                if (typeof pattern !== 'undefined' && pattern !== false) {
                   isValidated = true;
                }
                
                // console.log('NODE node=',node);
                
                if ( !node.disabled && isValidated) {
                    
                    // console.log('NODE 2B validated=',node);
                    
                    nodesToValidate.push(node)
                    
                    // valid.push( this.validate( node, dispatch ) );    
                }
            };
            
            if(this.checkforFilledFields(nodesToValidate) === false){
                
                console.log('FORM::validateAll NO FIELDS FILLED');
                return;
            }else{
                
                console.log('FORM::validateAll SOME FIELDS FILLED');
            }
            
            
            var len = nodesToValidate.length;
            
            for(var i=0,j=nodesToValidate.length; i<j; i++){
                
                valid.push( this.validate( nodesToValidate[i], dispatch ) ); 
            };
            
            
            return valid.every( function( a ) { return a; } );
            
        },
        
        validate: function( node, dispatch ) {
            
            var node = node,
                value = ( node.type === 'checkbox' ) ? node.checked : node.value,
                valid = false;
            
            /*
            if ( node.type === 'select-one' ) {
                console.log( node, node.value );
            }
            */
            
            if ( node.type === 'file' ) {
                value = node.getAttribute( 'data-file' );
            }
            
            var min = node.getAttribute('min'),
                max = node.getAttribute('max'),
                exp = node.getAttribute('pattern'),
                req = node.getAttribute('required');
        
            var exists = function( a ) { return a !== null };
            
            if ( exists( req ) || exists( min ) || exists( max ) || exists( exp ) ) {
                
                if (!( exists( req ) && !value) && 
                    !( exists( min ) && min > parseInt( value ) ) &&
                    !( exists( max ) && max < parseInt( value ) ) &&
                    !( exists( exp ) && !( new RegExp( exp ).exec( value ) ) ) ) {
                    valid = true;   
                }
    
                if ( dispatch ) {
                    if ( valid ) {
                        // console.log('FORM validate VALID node=',node);
                        this.dispatchEvent( { type: 'valid', target: node } );
                    } else {
                        // console.log('FORM validate INVALID node=',node);
                        this.dispatchEvent( { type: 'invalid', target: node } );
                    }    
                }
        
            }
            
            /*
            if ( node.type === 'file' ) {
                value = node.getAttribute( 'data-file' );
            }
            */
            
            return valid;
            
            
            
        },
        
        // RE. fny of validating fields on arrival at a section only if one of the fields has already been filled
        // i.e. a visual reminder (red border) of all the still-to-be-completed fields
        checkforFilledFields: function(nodesToValidate){
            
            var len = nodesToValidate.length;
            
            for(var i=0,j=nodesToValidate.length; i<j; i++){
                
                var node = dom(nodesToValidate[i]);
                
                // console.log('node=',node);
                
                if(node.val() !== ''){
                    
                    // console.log('FILLED =',node.val());
                    return true;
                }
            }
            
            return false;
        },
        
        /**
         *
         * Represents the form as JSON with every input and textarea as a name / value pair.
         * e.g. <input name="name" value="value" /> serialises as { name: value }.
         *
         * @param [scope] {Selector}            [Optional] Select only part of the form to serialise. ( not yet implemented ).
         *
         * @returns data {JSON}                 The contents of the form as JSON.
         *
         */
        
        toJSON: function( scope ) {
            
            var fields = dom( this.node ).find( 'input, textarea, select' );
            
            var data = {}
            
            for (var i = fields.length - 1; i >= 0; i--){
                data[ fields[i].name ] = fields[i].value;
            };
            
            return data;
        },
        
        /**
         *
         * Represents the form as a request string with every input and textarea as a name-value pairs joined with ampersands.
         * e.g. <input name="name" value="value" /> serialises as "name=value".
         *
         * @param [scope] {Selector}            [Optional] Select only part of the form to serialise. 
         *
         * @returns data {String}               The contents of the form as a String.
         *
         */
        
        toString: function( scope ) {
            
            var json = this.toJSON( scope );
            
            var data = [];
            for ( name in json ) {
                data.push( name + '=' + json[ name ] );
            }
            
            return data.join('&');
            
        }
        
    } );
    
    
    
    
    
    
    /*
     *
     * TODO: write a template and parse checkboxes
     * 
     */
    
    var FieldSwitch = phi.form.FieldSwitch = phi({
        
        __init__ : function( node ) {
            
            this.node = dom( node );
            
            /* get the checkbox */
            this.field = this.node.find( ':checkbox' );
            this.field.bind( 'change', this.handleChange.bind( this ) ); 
            
            /* create a draggable toggle */
            this.dragger = new phi.dom.RelativeDragger( this.node.find( '.switch-bezel' ), this.node.find( '.switch-bezel-handle' ), { allowY : false } );
            this.dragger.addEventListener( 'dragend', this.handleDragEnd.bind( this ) ); 
            
            this.toggle( !!this.field.prop( 'checked' ) );
            
        },
        
        handleDragEnd: function( e ) { 
            
            var x = e.target.valueX();
            
            this.toggle( x > 50 );
            this.field.trigger( 'change' );
            
        }, 
        
        handleChange: function( e ) {
            this.toggle( e.target.checked );
        },
        
        toggle: function( toggle ) {
            
            this.dragger.valueX( toggle ? 100 : 0 );
            this.node.toggleClass( 'on', toggle );
            this.field.prop( 'checked', toggle );
            
        }
        
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    /* 
     * Form upload components allow users to drag and drop files in an area or upload files by browsing through a native file manager.
     *
     * @constructor FieldUpload
     * 
     * @param node {DOMNode}                    The area to drag and drop files into.
     *
     *
     */
    
    var FieldUpload = phi.form.FieldUpload = phi({
        
        __extends__ : phi.EventTarget,
        
        __init__: function( node ) {
            
            this.node = dom( node );
            
            this.node.bind( 'change', this.handleChange.bind( this ) );
            this.node.bind( 'click', this.handleClick.bind( this ) );
            
            // console.log('FieldUpload node=',this.node);
            
            this.node[0].addEventListener( 'drop', this.handleDrop.bind( this ), false );
            this.node[0].addEventListener( 'dragover', this.handleDragOver.bind( this ), false );
            this.node[0].addEventListener( 'dragenter', this.handleDragEnter.bind( this ), false );
            
            this.links = new phi.dom.LinkRelations( /upload/ );
            this.links.add( 'remove-file', this.handleRemoveFile.bind( this ) );
            
        },
        
        handleClick: function( e ) {
            
            var base64 = this.node.find( '[type="hidden"]' );
            base64.remove();
        },
        
        renderUpload: function( files ) {
            
            /* variables */
            var rows = [], uuid, file;
                
            for (var i = files.length - 1; i >= 0; i--) {
            
                uuid = 'file-upload-' + phi.getUUID();
                file = files[i];
            
                rows.push( FieldUpload.ROW.parse( { file : file, uuid : uuid } ) );
                // FieldUpload.ROW = new phi.dom.Template( '<tr><td><span id="{{uuid}}"></span><span class="field-upload-progress progress"><em class="progress-bezel"></em></span></td></tr>' );
                this.renderFile( file, uuid );
            
            };
                
            
            this.node.find( '.field-upload-file-table' ).html( rows.join('') ); 
            
        },
        
        /*
         * Handles a change on the file input
         *
         * @param e {Event}                     The change event that fires when a user selects a file through a native file manager.
         *
         */
        
        handleChange: function( e ) { e.stopPropagation(); 
            this.renderUpload( e.target.files );
        },
        
        /*
         * Handles a drag over on the upload area
         *
         * @param e {Event}                     The dragover event that fires when a user moves over the area while dragging a file.
         *
         */
        
        handleDragOver: function( e ) { e.preventDefault();

            var dt = e.dataTransfer;
            dt.effectAllowed = dt.dropEffect = 'copy';

        },
        
        /*
         * Handles a drag enter on the upload area
         *
         * @param e {Event}                     The dragenter event that fires when a user enters the area while dragging a file.
         *
         */
         
        handleDragEnter: function( e ) { e.preventDefault();
            
            var dt = e.dataTransfer;
            dt.effectAllowed = dt.dropEffect = 'copy';
            
        },
        
        /*
         * Handles a drop on the upload area
         *
         * @param e {Event}                     The drop event that fires when a user releases a file while over the area.
         *
         */
        
        handleDrop: function( e ) { e.preventDefault();
            
            var dt = e.dataTransfer;
            dt.effectAllowed = dt.dropEffect = 'copy';
            
            var accept = this.node.find(':file').attr('accept');
            var mimes = accept.split(',');
            
            console.log("handleDrop mimes=", mimes );
            
            var files = [], file;

            if ( mimes.length ) {
            
                for (var i = dt.files.length -1; i >= 0; i--) {
                    
                    file = dt.files[i];
                    if ( mimes.indexOf( file.type ) !== -1 ) {
                        files.push( file );
                    }
                }
                
            } else {
                files = dt.files;
            }
            
            if ( files.length ) {
                this.renderUpload( files );
                this.node.find(':file').trigger('valid');
            } else {
                this.node.find(':file').trigger('invalid');
            }
            
        },
        
        handleRemoveFile: function( e ) { e.preventDefault();
            
            dom( e.target ).closest( 'tr' ).remove();
            
        },
        
        /*
         * Handle a load from a FileReader
         *
         * @param e {Event}                     The load event from the FileReader.
         *
         */
        
        handleLoad: function( e, uuid, file ) {
            
            var name = this.node.find( '[type="file"]' ).attr('name');
            var id = this.node.find( '[type="file"]' ).attr('id');
            
            document.getElementById( uuid ).innerHTML = FieldUpload.FILE.parse( { result: e.target.result, name: name, id: id, 'file-name' : file.name } );
            
            // for image previewing
            // var id = this.node.find( '[type="file"]' ).attr('id');
            // this.node.find( '.field-upload-file-preview' ).html( ImageFieldUpload.PREVIEW.parse( { src: e.target.result, id: id } ) );
            
            /* this.node.trigger( 'upload' ); */
               // console.log('handleLoad file.name=',file.name);
            this.upload(); 
        },
        
        /*
         *
         * Upload the image
         *
         */
        
        upload: function(pFileName) {
            
            var form = this.node.closest( 'form' );
            
            // console.log('FIELD UPLOAD upload pFileName=',pFileName);
            
            // Serialize
            dom.ajax({
                
                type: 'put',
                
                url: form.attr( 'action' ),
                
                dataType: 'json',
                
                headers: {
                     Accept : 'application/json; charset=utf-8'
                 },
                
                data: form.serialize(),
                
                xhr: function( request ) {
                    
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener( 'progress', function( e ) { this.handleUploadProgress( e, form ); }.bind( this ) );
                    return xhr;
                    
                }.bind( this ),
                
            }).done( function( response, state, promise ) {
                
                response.fileName = pFileName || response.fileName || 'view';
                
                this.dispatchEvent( { type : 'uploadcomplete', target : this, originalResponse : response } );
                
            }.bind( this ) );
            
        },
        
        handleUploadProgress: function( e ) {
            
            var form = this.node.closest('form');
            
            this.node.find( '.field-upload-progress .progress-bezel' ).css( { width : ( ( e.loaded / e.total ) * 100 ) + '%' } );
            this.dispatchEvent( { type : 'uploadprogress', target : this, originalEvent: e } );
            
        },
        
        /*
         * Handle a load from a FileReader
         *
         * @param e {Event}                     The load event from the FileReader.
         *
         */
        
        renderFile: function( file, uuid ) {
            
            var reader = new FileReader();
            
            reader.addEventListener( 'load', function( e ) { this.handleLoad( e, uuid, file ) }.bind( this ) );
            reader.readAsDataURL( file );
            
        }
        
    });
    
    /* templates */
    FieldUpload.FILE            = new phi.dom.Template( '<input type="hidden" value="{{result}}" name="{{name}}" id="{{id}}" /><input type="hidden" name="{{name}}-name" value="{{file-name}}" />' );
    FieldUpload.ROW             = new phi.dom.Template( '<tr><td><span id="{{uuid}}"></span><span class="field-upload-progress progress"><em class="progress-bezel"></em></span></td></tr>' );
    FieldUpload.TABLE           = new phi.dom.Template( '<table class="field-upload-file-table"><tbody>{{rows}}</tbody></table>' );
                                
    

    
    
    
    
    
    /**
     *
     * ImageFieldUpload - uploads image as it is selected (thru' browse dialog). Previews image
     *
     */
    
    var ImageFieldUpload = phi.form.ImageFieldUpload = phi({
        
        __extends__ : FieldUpload, 
        
        // FIXME fires twice - once on label containing input[type="file"] & once on input[type="file"] itself...
        //... BUT once image-file has been selected i.e. A PREVIEW HAS BEEN SHOWN, then it only fires on label NOT on input[type="file"] ...
        // ...therefore file browser window never opens a second time
        // So... hack a fix that catches & prevents the click on the label but forces the the input it contains to fire a 'click' event
        handleClick: function( e ) {
            
            if(!dom(e.target).hasClass('field-upload-file-browse')){
                return;
            }else{
                e.preventDefault();
                var input = dom(e.target).find('[type="file"]');
                if(input){
                    input.trigger('click');
                }
            }
            
            // console.log('handleClicker e.target=',e.target);
            
            // var base64 = this.node.find( '[type="hidden"]' );
            // console.log('base64=',base64);
            // base64.remove();
            
        },
        
        handleLoad: function( e, uuid, file  ) {
            
               var name = this.node.find( '[type="file"]' ).attr('name');
            var id = this.node.find( '[type="file"]' ).attr('id');
            
            // console.log('upload file name=',file.name);
            
            document.getElementById( uuid ).innerHTML = FieldUpload.FILE.parse( { result: e.target.result, name: name, id: id, 'file-name' : file.name } );
            
            // for image previewing
            var id = this.node.find( '[type="file"]' ).attr('id');
            this.node.find( '.field-upload-file-preview' ).html( ImageFieldUpload.PREVIEW.parse( { src: e.target.result, id: id } ) );
            
            this.upload(file.name); 
        }
        
    });
    
    
    /**
     *
     * ImageFieldUpload - previews image as it is selected - but upload is delayed until the form the 
     * image-field-upload element is in is submitted
     *
     */
    var ImageFieldUpload_Delay = phi.form.ImageFieldUpload_Delay = phi({
        
        __extends__ : ImageFieldUpload, 
        
        handleLoad: function( e, uuid, file  ) {
            
            // for image previewing
            var id = this.node.find( '[type="file"]' ).attr('id');
            this.node.find( '.field-upload-file-preview' ).html( ImageFieldUpload.PREVIEW.parse( { src: e.target.result, id: id } ) );
            
        },
        
        renderUpload: function( files ) {
            
            /* variables */
            var rows = [], uuid, file;
                
            for (var i = files.length - 1; i >= 0; i--) {
            
                uuid = 'file-upload-' + phi.getUUID();
                file = files[i];
            
                rows.push( ImageFieldUpload.ROW.parse( { file : file, uuid : uuid } ) );
                this.renderFile( file, uuid );
            
            };
                
            
            this.node.find( '.field-upload-file-table' ).html( rows.join('') ); 
        }
    });
    
    ImageFieldUpload.PREVIEW    = new phi.dom.Template( '<img src="{{src}}" id="{{id}}" />' );
    ImageFieldUpload.ROW        = new phi.dom.Template( '<tr><td><span id="{{uuid}}"></span></td></tr>' );
    


    
    /**
     *
     * FieldComplete
     *
     * Allows for generating an autocomplete list while typing. 
     *
     */
    
    var FieldComplete = phi.form.FieldComplete = phi({
        
        __extends__ : phi.EventTarget,
        
        __init__ : function( node, options ) {
            
            this.node = dom( node );
            this.node.bind( 'keyup', this.handleKeyUp.bind( this ) );
            this.node.bind( 'keydown', this.handleKeyDown.bind( this ) );
            this.node.find( 'input' ).prop( 'autocomplete', 'off' ).bind( 'focus', this.handleFocus.bind( this ) );
            dom('.dashboard-product-entry').bind('click', this.handleClick.bind(this));
            
            this.links = this.createLinkRelations();
            
            options = options || FieldComplete.DEFAULT;
            
            var autoComplete = (node.getAttribute('data-options') === 'noautocomplete')? false : true;
            
            this.autoComplete = autoComplete;
            
            if ( options.suggestions || node.getAttribute( 'data-json' ) ) {
                
                this.suggestions = options.suggestions || JSON.parse( node.getAttribute('data-json') );

            
            // use data-json attribute to parse JSON in a clean way, rather than interpret HTML as JSON and then render it as HTML again 
            } else if (node.getAttribute('data-suggestions-ref')) {
                
                var completeList = this.node.find( node.getAttribute('data-suggestions-ref') );
                
                var optionNodes = completeList.find( "li a" );
                
                this.suggestions = [];
                var that = this;
                
                optionNodes.each(function() {
                    that.suggestions.push( { value : this.getAttribute('data-suggestion'), description : this.innerHTML } );
                });
                
                this.close();
                
            }
            
            
            if ( options.src || node.getAttribute( 'data-src' ) ) {
                this.requestSuggestions( options.src || node.getAttribute( 'data-src' ) );    
            }
            
        },
        
        createLinkRelations: function() {
            
            var links = new phi.dom.LinkRelations( /complete/, this.node[0] );
                links.add( 'select', this.handleSelect.bind( this ) );
                
            return links;
            
        },
        
        handleClick: function (e ) {
            // console.log('handleClick e.target=',e.target);
            
            var targ = dom(e.target);
            
            // if click on field-complete inputs - do nothing, else close field-complete
            if(targ.attr('name') == 'product-taxrate' || targ.hasClass('field-complete-link') || targ.hasClass('field-complete-result') || targ.hasClass('fa fa-remove')){
                // console.log('INPUT ',targ.closest('.field-complete-result'));
                
                // if clicking on clear results icon in field-complete inputs (& not on close icon in error dialog)
                if( targ.hasClass('fa fa-remove') && targ.closest('.field-complete-result').length){
                    this.node.find( 'input' ).val('');
                    
                    this.suggest( '' );
                }
                
            }else{
                this.close();
            }
            
        },
        
        handleEscape: function( e ) { e.preventDefault();
            this.close();
        },
        
        handleUp: function( e ) { e.preventDefault();
            this.up();
        },
        
        handleDown: function( e ) { e.preventDefault();
            this.down();
        },
        
        handleEnter: function( e ) { 
            
            var suggestion = this.node.find( '.field-complete-link.select' );
            if ( suggestion.length ) { e.preventDefault(); 
                this.select( suggestion.attr( 'href' ).replace( '#', '' ) );    
            }
            
        },
        
        handleKeyDown: function( e ) {  
            
            switch ( e.keyCode ) {
                
                case 13 : this.handleEnter( e );
                    break;
                    
            }
            
        },
        
        handleKeyUp: function( e ) {  
            
            switch ( e.keyCode ) {
                
                case 13 : 
                    break;
                
                case 27 : this.handleEscape( e );
                    break;                
                    
                case 38 : this.handleUp( e );
                    break;
                    
                case 40 : this.handleDown( e );
                    break;
                    
                default: 
                    this.suggest( e.target.value );
                    break;
                                        
            }
        
        },
        
        handleFocus: function( e ) {
            
            var suggestVal = (this.autoComplete)? e.target.value : '';
            this.suggest( suggestVal );
            
        },
        
        close: function( e ) {
            
            this.node.find( '.field-complete-list' ).remove(); 
            
        },
        
        up: function( e ) {
            
            var links = this.node.find( '.field-complete-link' );
            var select = 0;
            for ( var i = 0; i < links.length; i++ ) {
                if ( links.eq(i).is('.select') ) {
                    select = i - 1;
                }
            }
            
            links.removeClass( 'select' );
            links.eq( select ).addClass( 'select' );
            
        },
        
        down: function( e ) {
            
            var links = this.node.find( '.field-complete-link' );
            
            var select = 0;
            for ( var i = 0; i < links.length; i++ ) {
                if ( links.eq(i).is('.select') ) {
                    select = i + 1;
                }
            }
            
            links.removeClass( 'select' );
            links.eq( select ).addClass( 'select' );
            
        },
        
        select: function( value ) {
            
            this.node.find( '.field-complete-list' ).remove();
            this.node.find('input').val( value );
            
        },
        
        suggest: function( val ) {
            
            var suggestions = this.filterSuggestions( val );
            
            this.node.find( '.field-complete-list' ).remove();
            var list = this.renderSuggestionList( suggestions, val );
            
            this.node.append( list ); 
            
        },
        
        filterSuggestions: function( val ) {
            
            val = new RegExp( val, 'g' );
            
            return this.suggestions.filter( function( suggestion ) {
                return val.exec( suggestion.description ) || val.exec( suggestion.value );
            } );
            
        },
        
        requestSuggestions: function( src ) {
            dom.getJSON( src, this.handleRequestComplete.bind( this ) );
        },
        
        handleSelect: function( e ) { e.preventDefault();
            
            this.select( e.target.getAttribute( 'href' ).replace( '#', '' ) );
            
        },
        
        handleRequestComplete: function( suggestions ) {
            this.suggestions = suggestions;
        },
        
        renderResult: function( result, val ) {
            return FieldComplete.RESULT.parse( { result : result, val : val } );
        },
        
        renderSuggestion: function( suggestion, val ) {
            
            var value = suggestion.value;
            var description = suggestion.description.replace( val, FieldComplete.EMPHASIS.parse( { val: val } ) );
            
            return FieldComplete.SUGGEST.parse( { value : value, description : description } );
            
        },
        
        renderSuggestionList: function( suggestions, val ) {
            
            var html = [];
            var l = /* ( suggestions.length > 5 ) ? 5 : */ suggestions.length;
            
            if ( val ) {
                html.push( this.renderResult( suggestions.length, val ) );    
            }
            
            for ( var i = 0; i < l; i++ ) {
                html.push( this.renderSuggestion( suggestions[i], val ) );
            }
            
            return FieldComplete.SUGGESTS.parse( { suggestions : html.join('') } );
            
        }
        
    });

    FieldComplete.SUGGESTS          = new phi.dom.Template( '<ul class="field-complete-list">{{suggestions}}</ul>' );
    FieldComplete.SUGGEST           = new phi.dom.Template( '<li><a href="#{{value}}" class="field-complete-link" rel="complete:select">{{description}}</a><li>' );
    FieldComplete.RESULT            = new phi.dom.Template( '<li><span class="field-complete-result"> {{result}} results <i class="fa fa-remove"></i></span><li>' );
    FieldComplete.EMPHASIS          = new phi.dom.Template( '<em>{{val}}</em>' );
    
    FieldComplete.DEFAULT           = {};
    
    
    
    
    
    
    /*
     *
     * TODO: create a comprehensive initialisation routine.
     *
     * A package should not call any constructors. 
     * It should lie dormant until explicitly invoked.
     *
     */
    
    var completes = dom( '.field-complete' );
    for (var i = 0; i < completes.length; i++) {
        
        new FieldComplete( completes[i] );
    }
    
    var switches = dom( '.touch .switch' );
    for (var i = 0; i < switches.length; i++) {
        new FieldSwitch( switches[i] );
    }
    
    dom( '.radio-button input' ).bind( 'change', function ( e ) {
        
        // loop through class and reset state
        dom( '.radio-button' ).removeClass( 'on' );
        
        if ( e.target.checked ) { 
            dom( e.target ).closest( '.radio-button' ).addClass( 'on' );    
        }
        
    } );
    
    
    
})( phi, phi.dom );
