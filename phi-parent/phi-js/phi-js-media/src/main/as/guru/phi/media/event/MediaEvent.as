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

package guru.phi.media.event {
	
	import flash.events.Event;
	
	public class MediaEvent extends Event {
		
		public static var LOADSTART         : String = 'loadstart';
		public static var PROGRESS          : String = 'progress';
		public static var SUSPEND           : String = 'suspend';
		public static var ABORT             : String = 'abort';
		public static var ERROR             : String = 'error';
		public static var EMPTIED           : String = 'emptied';
		public static var LOADEDDATA        : String = 'loadeddata';
		public static var STALLED           : String = 'stalled';
		public static var LOADEDMETADATA    : String = 'loadedmetadata';
		public static var CANPLAY           : String = 'canplay';
		public static var CANPLAYTHROUGH    : String = 'canplaythrough';
		public static var PLAYING           : String = 'playing';
		public static var WAITING           : String = 'waiting';
		public static var SEEKING           : String = 'seeking';
		public static var SEEKED            : String = 'seeked';
		public static var ENDED             : String = 'ended';
		public static var DURATIONCHANGE    : String = 'durationchange';
		public static var TIMEUPDATE        : String = 'timeupdate';
		public static var PLAY              : String = 'play';
		public static var PAUSE             : String = 'pause';
		public static var RATECHANGE        : String = 'ratechange';
		public static var RESIZE            : String = 'resize';
		public static var VOLUMECHANGE      : String = 'volumechange';
		
		public function MediaEvent( type:String, bubbles:Boolean, cancelable:Boolean ) {
			super( type, bubbles, cancelable )
		}
		
	}
	
}