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

package phi.guru.media.element {
    
    import flash.media.Video;
    import flash.net.NetStream;
    import flash.net.NetConnection;
    import flash.events.EventDispatcher;
    import phi.guru.media.event.MediaEvent;
    
    /**
     *
     * MediaElement in Flash
     *
     */
    
    public class MediaElement extends EventDispatcher {
        
        private conection : NetConnection;
        private stream : NetStream;
        private canvas : Video;
        
        private src : String;
        
        public function MediaElement( options:Object ) {
            
        }
        
        private function createCanvas() : Video {
            
            // var canvas : Audio = new Audio();
            canvas = new Video();
            addChild( canvas );
            
            // TODO : listen to video events
            // canvas.addEventListener( '' );
            
            connection = new NetConnection();
            connection.connect( null );
            
            // TODO : listen to connection events
            // connection.addEventListener( '' );
            
            // TODO : listen to netstream events
            stream = new NetStream();
            // stream.addEventListener();
            
            
            // TODO : create canvas and listen to every video event
            //
            // 
            // canvas.addEventListener( VideoEvent.AUTO_REWOUND, this.handleCanvasEvent );
            // canvas.addEventListener( VideoEvent.BUFFERING_STATE_ENTERED, this.handleCanvasEvent );
            // canvas.addEventListener( VideoEvent.CLOSE, this.handleCanvasEvent );
            // canvas.addEventListener( VideoEvent.COMPLETE, this.handleCanvasEvent );
            // canvas.addEventListener( VideoEvent.FAST_FOWARD, this.handleCanvasEvent );
            // canvas.addEventListener( VideoEvent.PAUSED_STATE_ENTERED, this.handleCanvasEvent );
            // canvas.addEventListener( VideoEvent.PLAYHEAD_UPDATE, this.handleCanvasEvent );
            // canvas.addEventListener( VideoEvent.PLAYING_STATE_ENTERED, this.handleCanvasEvent );
            // canvas.addEventListener( VideoEvent.READY, this.handleCanvasEvent );
            // canvas.addEventListener( VideoEvent.REWIND, this.handleCanvasEvent );
            // canvas.addEventListener( VideoEvent.SCRUB_FINISH, this.handleCanvasEvent );
            // canvas.addEventListener( VideoEvent.SCRUB_START, this.handleCanvasEvent );
            // canvas.addEventListener( VideoEvent.SEEKED, this.handleCanvasEvent );
            // canvas.addEventListener( VideoEvent.SKIN_LOADED, this.handleCanvasEvent );
            // canvas.addEventListener( VideoEvent.STATE_CHANGE, this.handleCanvasEvent );
            // canvas.addEventListener( VideoEvent.STOPPED_STATE_ENTERED, this.handleCanvasEvent );
            //
            // canvas.addEventListener( VideoProgressEvent.PROGRESS, this.handleProgress );
            //
            // canvas.addEventListener( ErrorEvent.ERROR, this.handleErrorEvent );
            //
            // canvas.addEventListener( SoundEvent.SOUND_UPDATE, this.handleSoundUpdate );
            
             /**
              *
              *
              * AUTO_REWOUND : String = "autoRewound"
              * [static] Defines the value of the type property of an autoRewound event object.
              * VideoEvent
              *
              * BUFFERING_STATE_ENTERED : String = "bufferingStateEntered"
              * [static] Defines the value of the type property of a bufferingStateEntered event object.
              * VideoEvent
              *
              * CLOSE : String = "close"
              * [static] Defines the value of the type property of a close event object.
              * VideoEvent
              *
              * COMPLETE : String = "complete"
              * [static] Defines the value of the type property of a complete event object.
              * VideoEvent
              *
              * FAST_FORWARD : String = "fastForward"
              * [static] Defines the value of the type property of a fastForward event object.
              * VideoEvent
              *
              * PAUSED_STATE_ENTERED : String = "pausedStateEntered"
              * [static] Defines the value of the type property of a pausedStateEntered event object.
              * VideoEvent
              *
              * PLAYHEAD_UPDATE : String = "playheadUpdate"
              * [static] Defines the value of the type property of a playheadUpdate event object.
              * VideoEvent
              *
              * PLAYING_STATE_ENTERED : String = "playingStateEntered"
              * [static] Defines the value of the type property of a playingStateEntered event object.
              * VideoEvent
              *
              * READY : String = "ready"
              * [static] Defines the value of the type property of a ready event object.
              * VideoEvent
              *
              * REWIND : String = "rewind"
              * [static] Defines the value of the type property of a rewind event object.
              * VideoEvent
              *
              * SCRUB_FINISH : String = "scrubFinish"
              * [static] Defines the value of the type property of a scrubFinish event object.
              * VideoEvent
              *
              * SCRUB_START : String = "scrubStart"
              * [static] Defines the value of the type property of a scrubStart event object.
              * VideoEvent
              *
              * SEEKED : String = "seeked"
              * [static] Defines the value of the type property of a seeked event object.
              * VideoEvent
              *
              * SKIN_LOADED : String = "skinLoaded"
              * [static] Defines the value of the type property of a skinLoaded event object.
              * VideoEvent
              *
              * STATE_CHANGE : String = "stateChange"
              * [static] Defines the value of the type property of a stateChange event object.
              * VideoEvent
              *
              * STOPPED_STATE_ENTERED
              * 
              */
            
        }
        
        private function destroyCanvas() : void {
            // delete canvas;
        }
        
        private function handleVideoEvent( event : VideoEvent ) : void {
            
            /**
             *
             * Do something with a video event.
             *
             */
            
        }
        
        private function handleConnectionEvent( event : NetConnectionEvent ) : void {
            
            /**
             *
             * Do something with a connection event
             *
             */
            
        }
        
        private function handleStreamEvent( event : NetStreamEvent ) : void {
            
            /**
             *
             * Do something with a stream event
             *
             */
            
        }
        
        private function play() : void {
            
            try {
                stream.play( src );
                canvas.attachNetStream( stream );
            } catch ( e : Exception ) {
                // log an exception.
            }
            
        }
        
        private function pause() : void {
            // canvas.pause();
        }
        
        private function getSrc() : String {
            return src;
        }
        
        private function setSrc( src:String ) : void {
            
            this.src = src;
            // canvas.src = src;
            
        }
        
        private function getVolume() : Number {
            return 0.0;
        }
        
        private function setVolume( volume:Number ) : void {
            // canvas.volume = volume;
        }
        
        private function getDuration() : Number {
            return 0;
        }
        
        private function getCurrentTime() : Number {
            return 0;
        }
        
        private function setCurrentTime( currentTime:Number ) : void {
            // canvas.currentTime = currentTime;
        }
        
        
    }
    
}