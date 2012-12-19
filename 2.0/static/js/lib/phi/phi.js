                                                                     
                                                                     
                                                                     
                                             
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
	 
	var phi = window.phi = window.phi || function( define ) {
		return phi.define( define );
	};
	



	/*
	 *
	 * Defines a class, interface, abstract (class) or aspect
	 *
	 * @param type {String}							Defining a class.
	 *
	 */
	 
	phi.define = function( define ) {
		return types.__class__( define );
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
	 
	types.__class__ = function( define ) {

		var __class__ = function() {};
		
		var parent = null,
			prototype = {},
			constructor = function() {};

		var member;
		for ( var m in define) {

			member = define[ m ];

			switch ( m ) {
				
				case '__init__' :
					constructor = member;
					break;

				case '__extends__' : 
					parent = member;
					break;

				case '__implements__' :
					
					break;

				default :
					prototype[ m ] = member;
					break;

			}

		}
		
		__class__ = function() {
			constructor.apply( this, arguments );
		};
		
		if ( parent ) {
			
			var p = parent.prototype;
			parent = function() {};
			parent.prototype = p;
			
			__class__.prototype = new parent();
			__class__.prototype.super = new parent();
			
		}
		
		__class__.prototype = phi.extend( __class__.prototype, prototype );
		__class__.prototype.constructor = constructor;
		
		return __class__;

	};

	
	
	
	/**
	 *
	 * Define an aspect
	 *
	 * @param define {Object}						The aspect definition
	 *
	 */
	 
	types.__aspect__ = function( define ) {

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
	
	types.__abstract__ = function( define ) {

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
	
	types.__interface__ = function( define ) {
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