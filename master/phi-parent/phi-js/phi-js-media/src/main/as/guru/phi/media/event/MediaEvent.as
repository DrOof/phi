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
    
    
    public static LOADSTART         = 'loadstart'
    public static PROGRESS          = 'progress'
    public static SUSPEND           = 'suspend'
    public static ABORT             = 'abort'
    public static ERROR             = 'error'
    public static EMPTIED           = 'emptied'
    public static STALLED           = 'stalled'
    public static LOADEDMETADATA    = 'loadedmetadata'
    public static LOADEDDATA        = 'loadeddata'
    public static CANPLAY           = 'canplay'
    public static CANPLAYTHROUGH    = 'canplaythrough'
    public static PLAYING           = 'playing'
    public static WAITING           = 'waiting'
    public static SEEKING           = 'seeking'
    public static SEEKED            = 'seeked'
    public static ENDED             = 'ended'
    public static DURATIONCHANGE    = 'durationchange'
    public static TIMEUPDATE        = 'timeupdate'
    public static PLAY              = 'play'
    public static PAUSE             = 'pause'
    public static RATECHANGE        = 'ratechange'
    public static RESIZE            = 'resize'
    public static VOLUMECHANGE      = 'volumechange'
    
    public class MediaEvent extends Event {
        
    }
    
}
