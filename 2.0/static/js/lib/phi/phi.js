                                                                     
                                                                     
                                                                     
                                             
/*
 *
 *
 * __class API
 *
 * __extends: (__class__ || __abstract__)
 * __implements: (__interface__ || [__interface__])
 * __applies: (__aspect__ || [__aspect__])
 * __init: Function
 * static: {}
 * final: {}
 * {}
 *
 * 
 *
 *
 */

(function() {

	/**
	 *
	 *
	 *
	 */
	 
	var phi = window.phi = window.phi || function(  ) {

		if ( arguments.length == 3 ) {
			return phi.define( arguments[0], arguments[1], arguments[2] );
		}
		
		if ( arguments.length == 4 ) {
			return phi.package( arguments[0], arguments[1], arguments[2], arguments[3] );
		}
		
	};
	



	/*
	 *
	 * Defines a class, interface, abstract (class) or aspect
	 *
	 * @param type {String}							Defining a class.
	 *
	 */
	 
	phi.define = function( type, name, define ) {
		return window[ name ] = types [ '__type__'.replace( /type/, type ) ] ( name, define );
	};

	/*
	 *
	 * Defines a class, interface, abstract (class) or aspect in a package
	 *
	 * @param type {String}							Defining a class.
	 *
	 */
	
	phi.package = function( package, type, name, define ) {

		var path = window;
		if ( typeof package === 'string') {
			var p = package.split('.'), step;
			for (var i = 0; i < p.length; i++) {
				s = p[i];
				path[ s ] = path[ s ] || {};
				path = path[ s ];
			};	
		}

		if ( typeof package === 'object' ) {
			path = package;
		}

		return path [ name ] = phi.define( type, name, define );

	};

	/*
	 *
	 * Extends objects with other any number of objects ( i.e. merging two objects into a new one ).
	 *
	 * @param target {Object}						The object to extend.
	 * @param [with...] {Object}					Argument [1...n] extends the target	
	 *
	 */

	phi.extend = function( target ) {
		
		var result = target;

		var object;
		for (var i = 1; i < arguments.length; i++) {
			object = arguments[i];
			for (var n in object) {
				if ( !(result[n] && result[n].final) ) {
					result[n] = object[n];
				}
			};
		};

		return result;

	};
	
	
	
	
	var types = phi.types = {};
	
	/**
	 *
	 * Define a class
	 * 
	 * @param define {Object}						The class definition
	 *
	 */ 
	 
	types.__class__ = function( name, define ) {

		var __class__ = function() {};
		
		var parent = null,
			final = {},
			prototype = {},
			constructor = function() {};

		var def;
		for ( var m in define) {

			d = define[ m ];

			switch( m ) {

				case '__extends__' : 
					parent = d;
					break;

				case '__implements__' :
					
					break;

				case name :
					constructor = d;
					break;

				case '__final__' : 

					for ( var name in d ) {
						prototype[ name ] = d;
						prototype[ name ].final = true;
					};


					break; 

				default :
					prototype[ m ] = d;
					break;

			}

		}

		var p = ( parent ) ? parent.prototype || {} : {};
		__class__.prototype = phi.extend( {}, p, prototype );

		return __class__;

	};

	
	
	
	/**
	 *
	 * Define an aspect
	 *
	 * @param define {Object}						The aspect definition
	 *
	 */
	 
	types.__aspect__ = function( name, define ) {

		var __aspect__;

		return __aspect__;

	};
	
	
	
	/**
	 *
	 * Define an abstract
	 *
	 * @param define {Object}						The abstract definition
	 *
	 */
	
	types.__abstract__ = function( name, define ) {

		var __abstract__;

		return __abstract__;
		
	};
	
	
	
	/**
	 *
	 * Define an interface
	 *
	 * @param define {Object}						The interface definition
	 *
	 */
	
	types.__interface__ = function( name, define ) {
		return define;
	};
	
	
	
	
	



	/**
	 *
	 * binds a Function to execute in the scope of any object. 
	 *
	 * The 'this' keyword inside the Function references the preferred object.
	 * It is used in callback methods to prevent their scope defaulting to a global namespace such as 'window'.
	 *
	 * @param object {Object} the object to which the Function is bound
	 *
	 */

	Function.prototype.bind = function(object) {
		var b = this;
		return function() {
			return b.apply(object, arguments);
		};
	};





	/**
	 * Creates a callback for any function where some of its arguements may be prefilled. The 
	 * prefilled arguments always take precedence.
	 * 
	 */

	Function.prototype.partial = function() {
		var method = this;
		var defined = arguments;
		return function() {
			var l = Math.max(defined.length, arguments.length);
			var parameters = [];
			for (var i = 0; i < l; i++) {
				parameters[i] = defined[i] || arguments[i];
			}
			return method.apply(this, parameters);
		};
	};

	
})();