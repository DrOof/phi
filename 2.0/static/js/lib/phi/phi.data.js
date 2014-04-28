(function(window, document, phi, dom ) {


    phi.data = {};
    
    
    
    /*
     *
     * A basic grid representation of data.
     *
     */
    
    var Grid = phi.data.Grid = phi({
        
        __init__ : function( root, data, transform, renderConfig ) {
            
            this.transform = transform || function( data ) { return data; };
            this.renderConfig = renderConfig || {};
            this.root = dom( root );
            
            /* create a data model */
            this.model = this.createDataModel();
            
            
            
            /* load data from src */
            this.src = this.root.attr( 'data-src' );
            if ( this.src ) {
                this.requestDataFromSrc( this.src ); 
            }
            
            if ( data ) {
                this.model.set( data.map( this.transform ) );
            }
            
            /* relate actions to links */
            this.links = this.createLinkRelations( root );
            
            /* relate actions to fields */
            this.fields = this.createFieldRelations( root );
            
            /* render */
            this.render();
            
        },
        
        createDataModel: function( data ) {
            
            var model = new DataModel( data, this.renderConfig );
                model.addEventListener( 'datachange', this.handleDataChange.bind( this ) );
                
            return model;
            
        },
        
        createLinkRelations: function( root ) {
            
            var links = new phi.dom.LinkRelations( /data-grid/, root );
                links.add( 'sort', this.handleSort.bind( this ) );
                links.add( 'page', this.handlePage.bind( this ) );
                links.add( 'cols', this.handleCols.bind( this ) );
                links.add( 'remove-filter', this.handleRemoveFilter.bind( this ) );
                
            return links;
            
        },
        
        createFieldRelations: function( root ) {
            
            var fields = new phi.dom.FieldRelations( /data-grid/, root ); 
                fields.add( 'page', this.handleCurrentPage.bind( this ) );
                fields.add( 'filter', this.handleFilter.bind( this ) );
                fields.add( 'rows', this.handleRows.bind( this ) );
                
            return fields;
            
        },
        
        rows: 10,
        offset: 0,
        filters: {},
        blacklist: [],
        
        requestDataFromSrc: function( src ) {
            phi.dom.getJSON( src, function( response ) {
                this.model.set( response.map( this.transform ) );
            }.bind( this ) );
        },
        
        handleSort: function( e ) { e.preventDefault();
            
            var params = phi.dom.getParameters( dom( e.target ).closest( 'a' ).attr( 'href' ) );
            this.updateSort( params['by'], params['order'] );
            this.render( this.model.get() );
            
        },
        
        handlePage: function( e ) { e.preventDefault();
            
            // set the offset
            var params = phi.dom.getParameters( dom( e.target ).closest( 'a' ).attr( 'href' ) );
            this.updatePage( params['page'] );
            this.render( this.model.get() );
            
        },
        
        handleCurrentPage: function( e ) { 
            
            var current = dom( e.target ); 
            this.updatePage( parseInt( current.val(), 10 ) - 1 );
            this.render( this.model.get() );
            
        },
        
        handleRows: function( e ) {
            
            var rows = dom( e.target ); 
            this.updateRows( rows.val() );
            this.render( this.model.get() );
            
        },
        
        handleFilter: function( e ) {
            
            var filter = dom( e.target ); 
            this.updateFilters( filter.attr('id'), filter.val() );
            this.render( this.model.get() );
            
        },
        
        handleCols: function( e ) { e.preventDefault();
            
            // serialise cols
            var params = phi.dom.getParameters( dom( e.target ).closest( 'a' ).attr( 'href' ) );
            this.updateCols( params['cols'] );
            this.render( this.model.get() );
            
        },
        
        handleChange: function( e ) { e.preventDefault();
            
            
            
        },
        
        handleRemoveFilter: function( e ) { e.preventDefault();
            
            var params = phi.dom.getParameters( dom( e.target ).closest( 'a' ).attr( 'href' ) );
            var key = params['remove-filter-key']; 
            
            if ( key ) {
                this.updateFilters( key );
                this.render( this.model.get() );    
            }
            
        },
        
        updateFilters: function( key, value ) {
            
            this.updatePage( 0 );
            
            if ( value !== undefined && value !== '' ) {
                this.filters[ key ] = value;    
            } else {
                delete this.filters[ key ];
            }
            
            
        },
        
        updatePage: function( page ) {
            
            this.offset = page * this.rows;
            
        },
        
        updateRows: function( rows ) {
            
            this.updatePage( 0 );
            this.rows = rows;
            
        },
        
        updateCols: function( method ) {
            
            var list = [];
            
            if ( method ===  'update' ) {
                var unchecked = this.root.find( ':checkbox:not(:checked)' );
                for (var i = unchecked.length - 1; i >= 0; i--) {
                    list.push( unchecked[i].name );
                }
            }
            
            this.blacklist = list;
            
        },
        
        sort: {},
        updateSort: function( by, order ) {
            
            this.sort.by = by;
            this.sort.order = order;
            
            this.updatePage( 0 );
            this.model.sort( by, order );
            
        },
        
        handleDataChange: function( e ) { 
            
            this.render();
            
        },
        
        filter: function( data ) {
            
            var filtered = [];
            var filters = this.filters;
            
            for (var i = 0; i < data.length; i++) {
                if ( this.validate( data[ i ]) ) {
                    filtered.push( data[i] )
                }
            }
            
            return filtered;
            
        },
        
        validate: function( d ) {
            
            var valid = true;
            var filters = this.filters;
            
            for ( var key in filters ) {
                if ( !new RegExp( filters[ key ] ).test( d[ key ]) ) {
                    valid = false;
                }
            }
            
            return valid;
            
        },
        
        render: function() {
            
            // apply filter before rendering.
            
            var data = this.filter( this.model.get() );
            
            var rows = this.renderRowOptions( data ); 
            var cols = this.renderColOptions( data ); 
            var table = this.renderTable( data ); 
            var page = this.renderPages( data ); 
            
            var filters = this.renderFilters( data );
            
            this.root.empty();
            
            this.root.append( filters ); 
            this.root.append( rows ); 
            this.root.append( cols ); 
            this.root.append( table ); 
            this.root.append( page ); 
            
        },
        
        renderColOptions: function( data ) {
            
            var options = [],
                d = data[0];
            
            for ( var key in d ) {
                options.push( this.renderColOptionLink( 'cols', key ) );
            }
            
            return Grid.COLS.parse( { options : options.join('') } );
            
        },
        
        renderColOptionLink: function( option, value ) {
            
            var checked = ( this.blacklist.indexOf( value ) === -1 ) ? 'checked' : '';
            
            return Grid.COL.parse( { option: option, value: value, checked: checked } );
            
        },
        
        renderRowOptions: function() {
            
            var options = [],
                rows = [ 10, 20, 50 ];
            
            for ( var i = 0; i < rows.length; i++ ) {
                options.push( this.renderRowOption( 'rows', rows[ i ] ) ); //added option in the loop for now to seperate elements
            }
            
            return Grid.OPTIONS.parse( { options : options.join('') } );
            
        },
        
        renderRowOption: function( option, value ) {
            
            var selected = ( this[ option ] == value ) ? 'selected' : '';
            
            return Grid.OPTION.parse( { option: option, value: value, selected: selected } );
            
        },
        
        renderFilters: function( ) {
            
            var filters = [];
            
            var f = this.filters;
            for ( var key in f ) {
                filters.push( this.renderFilterLink( key, f[key] ) );
            }
            
            return Grid.FILTERS.parse( { filters: filters.join('') } ); 
            
        },
        
        renderFilterLink: function( key, value ) {
            
            return Grid.FILTER.parse( { key: key, value: value } );
               
        },
        
        renderPages: function( data ) {
            
            var pages = [],
                o = this.offset,
                l = data.length,
                r = this.rows;
                
            var last = Math.ceil( l/r ),
                n = Math.ceil( o/r );
            
            var p = [];
            
            
            
            //
            if ( n > 0 ) {
                pages.push( this.renderPageLink( 0, 'fa fa-fast-backward' ) );
            }
            
            //
            if ( n > 0 ) {
                pages.push( this.renderPageLink( n - 1, 'fa fa-step-backward' ) );
            }
            
            pages.push( this.renderPage( n, last - 1 ) );
            
            //
            if ( n < last ) {
                pages.push( this.renderPageLink( n + 1, 'fa fa-step-forward' ) );
            }
            
            //
            if ( n < last ) {
                pages.push( this.renderPageLink( last - 1, 'fa fa-fast-forward' ) );
            }
            
            return Grid.PAGES.parse( { pages : pages.join('') } );
            
        },
        
        renderPageLink: function( n, icon ) {
            return Grid.PAGE.parse( { n : n, icon : icon } );
        },
        
        renderPage: function( n, total ) {
            return Grid.CURRENT.parse( { n : n + 1, total : total + 1 } );
        },
            
        renderTable: function( data ) {
            
            return Grid.TABLE.parse( { thead: this.renderTableHead( this.model.get() ), tbody: this.renderTableBody( data ) } );
            
        },
        
        renderTableHead: function( data ) {
            
            return Grid.HEAD.parse( { rows: this.renderTableHeadRow( data ) } )
            
        },
        
        renderTableHeadRow: function( data ) {
            
            var cells = [];
            
            for ( var key in data[0] ) {
                if ( !this.blacklist.some( function( a ) { return a === key } ) ) {
                    cells.push( this.renderTableHeadCell( key ) );
                }
            }
            
            return Grid.ROW.parse( { cells : cells.join(''), n: 'Nr.' } );
            
        },
        
        renderTableHeadCell: function( value ) {
            
            var cellData = {
                key: value,
                value: value,
                filter: this.filters[ value ] || '',
                sorted : ( value === this.sort.by ) ? this.sort.order : '',
                sortable : ''
            };
            
            if (this.renderConfig && this.renderConfig[value]) {
                if (false === this.renderConfig[value].sortable) {
                    cellData.sortable = 'not-sortable';
                }
                if (this.renderConfig[value].label) {
                    cellData.value = '<span title="' + value + '">' + this.renderConfig[value].label + '</span>';
                }
            }
            
            return Grid.TH.parse( cellData );
            
        },
        
        renderTableBody: function( data ) {
            
            var rows = [], 
                o = this.offset, 
                r = this.rows, 
                l = data.length;
                
            var length = ( r < l - o ) ? r : l - o;
            
            for (var n = 0; n < length; n++) {
                rows.push( this.renderTableBodyRow( data[ n + o ], n + o ) );
            }
            
            return Grid.BODY.parse( { rows: rows.join('') } );
            
        },
        
        renderTableBodyRow: function( data, n ) {
            
            var cells = [], key, value; 
                
            for ( key in data ) {
                
                if ( !this.blacklist.some( function( a ) { return a === key } ) ) {
                    
                    value = data[ key ];
                    cells.push( this.renderTableBodyCell( key, value ) );                         
                    
                }
            }
            
            return Grid.ROW.parse( { cells: cells.join(''), n: n }  );
            
        },
        
        renderTableBodyCell: function( key, value ) {
        
            // Value can be either
            // 1) a two-field array of (data, view)
            // 2) a single field, being both data and view.
            // The ternary expression selects the view.
        
            var cellData = {
                key : key,
                value : (typeof value == 'object' ? value[1] : value),
                dataType : 'unknown',
                columnRef : 'none'
            }
        
            if (this.renderConfig && this.renderConfig[key] && this.renderConfig[key].dataType) {
                cellData.dataType = this.renderConfig[key].dataType;
            }
            
            if (this.renderConfig && this.renderConfig[key] && this.renderConfig[key].columnRef) {
                cellData.columnRef = this.renderConfig[key].columnRef;
            }
        
            return Grid.TD.parse( cellData );
            
        }
        
    });
    
    Grid.TABLE      = new phi.dom.Template( '<div class="data-grid-content"><table class="data-grid-table">{{thead}}{{tbody}}</table></dv>' );
    Grid.ROW        = new phi.dom.Template( '<tr class="data-grid-table-row"><th class="data-grid-table-row-number">{{n}}</th>{{cells}}</tr>' );
        
    Grid.HEAD       = new phi.dom.Template( '<thead>{{rows}}</thead>' );
    Grid.TH         = new phi.dom.Template( '<th class="data-grid-table-header {{sortable}}"><div class="data-grid-table-header-position">{{value}}<ul class="data-grid-table-header-sort-list sorted-{{sorted}}"><li><a class="data-grid-table-header-sort-link asc" href="?by={{key}}&order=asc" rel="data-grid:sort"><i class="fa fa-chevron-up"></i></a></li><li><a class="data-grid-table-header-sort-link desc" href="?by={{key}}&order=desc" rel="data-grid:sort"><i class="fa fa-chevron-down"></i></a></li></ul><input class="data-grid-table-header-filter" id="{{key}}" name="{{key}}" value="{{filter}}" data-relation="data-grid:filter" /></th></div>' );
    
    Grid.BODY       = new phi.dom.Template( '<tbody>{{rows}}</tbody>' );
    Grid.TD         = new phi.dom.Template( '<td class="data-grid-table-cell datatype-{{dataType}} columnref-{{columnRef}}" data-key={{key}}>{{value}}</td>' );
    
    Grid.PAGES      = new phi.dom.Template( '<ol class="data-grid-page-list">{{pages}}</ol>' );
    Grid.PAGE       = new phi.dom.Template( '<li><a class="data-grid-page-link" href="?page={{n}}" rel="data-grid:page"><i class="{{icon}}"></i></a></li>' );
    Grid.CURRENT    = new phi.dom.Template( '<li><span class="data-grid-page-link"><input class="data-grid-pagination-current-page-input" value="{{n}}" data-relation="data-grid:page" /> of {{total}}</span></li>' );
    
    Grid.OPTIONS    = new phi.dom.Template( '<div class="data-grid-row-option">Show <select class="data-grid-row-option-dropdown" data-relation="data-grid:rows">{{options}}</select> rows</div>' );
    Grid.OPTION     = new phi.dom.Template( '<option value="{{value}}" {{selected}}>{{value}}</option>' );
    
    Grid.COLS       = new phi.dom.Template( '<ul class="data-grid-col-option-list"><li><strong class="data-grid-col-option-link active"><i class="fa fa-cogs"></i></strong></li>{{options}}<li><a href="?cols=reset" class="data-grid-col-option-button button reduce grey" rel="data-grid:cols"> Reset </a><a href="?cols=update" class="data-grid-col-option-button button reduce green" rel="data-grid:cols"> Apply </a></li></ul>' );
    Grid.COL        = new phi.dom.Template( '<li><label class="data-grid-col-option-link"><input type="checkbox" name="{{value}}" id="{{value}}" {{checked}} /> {{value}}</label></li>' );
    
    Grid.FILTERS    = new phi.dom.Template( '<ul class="data-grid-filter-list">{{filters}}</ul>' );
    Grid.FILTER     = new phi.dom.Template( '<li><a href="?remove-filter-key={{key}}" rel="data-grid:remove-filter">{{key}}={{value}}<i class="fa fa-remove"></i></a></li>' );
    
    /*
     *
     * Sorting functions. Only implement Ascending sorts.
     *
     */    
    
    var Sort = phi.data.Sort = {};
    
    Sort._debug = function (sortFunction) {
        return function (a, b) {
            var result = sortFunction (a, b);
            console.log("Comparing(" + a + ", " + b + ") = " + result);
            return result;
        };
    };
       
    Sort.Text = function(a, b) {
        return (a == b) ? 0 : (a > b ? 1 : -1);
    };
    
    Sort.Number =  function(a, b) {
        var fA = parseFloat(a), fB = parseFloat(b);
        return (fA == fB) ? 0 : (fA > fB ? 1 : -1);
    };
    
    
    
    /*
     *
     * A data model for graphs and data visualisations
     *
     */
    
    var DataModel = phi.data.DataModel = phi({
        
        __extends__ : phi.mvc.EventTarget, 
        
        __init__ : function( data, renderConfig) {
            
            this.set( data || [] );
            
            this.renderConfig = renderConfig || {};
            
        },
        
        data: [],
        
        /*
         * Set the data
         *
         * @param data {Array}                  A flat array of data points
         *
         */
        
        set: function( data ) {
            
            this.data = data;
            this.dispatchEvent( { type : 'datachange', target : this } );
            
        },
        
        get: function() {
            
            return this.data;
            
        },
        
        /*
         * Add data
         *
         * @param data {Array}                  A flat array of data points
         *
         */
        
        add: function( data ) {
            
            this.data = this.data.concat( data );
            
            this.dispatchEvent( { type : 'datachange', target : this } );
            
        },
        
        remove: function( key ) {
            
            this.dispatchEvent( { type : 'datachange', target : this } );
            
        },
        
        /*
         * Sort the data
         *
         * @param data {Array}                  A flat array of data points
         *
         */
        
        sort: function( by, order ) {
        
            var sortFunction = Sort.Text;
            
            // Processing numbers
            if (this.renderConfig && this.renderConfig[by] && this.renderConfig[by].dataType == 'number') {
                sortFunction = Sort.Number;
            }
            
            // Asc / Desc
            if (order == 'asc') {
                this.data.sort(function(a, b) {
                    var aValue = typeof a[by] == "object" ? a[by][0] : a[by];
                    var bValue = typeof b[by] == "object" ? b[by][0] : b[by];
                
                    return sortFunction(aValue, bValue);
                });
            } else {
                // Descending is basically reversing the
                // arguments to the Ascending sort function..
                this.data.sort(function(a, b) {
                
                    var aValue = typeof a[by] == "object" ? a[by][0] : a[by];
                    var bValue = typeof b[by] == "object" ? b[by][0] : b[by];
                
                    return sortFunction(bValue, aValue);
                });
            }
            
            this.dispatchEvent( { type : 'datachange', target : this } );
            
        }
        
    });
    
    
}(window, document, phi, jQuery ));