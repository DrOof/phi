import fl.video.FLVPlayback;

package guru.phi.media.player {
    
    /**
    *
    * MediaElement in Flash
    *
    */
    
    public class Player extends EventTarget {
        
        public Player( Object options ) {
            
        }
        
        private createCanvas() : FLVPlayback {
            
            // TODO : create canvas and listen to every video event
            //
            // FLVPlayback canvas = new FLVPlayback();
            // canvas.addEventListener( VideoEvent.AUTO_REWOUND, this.handleAutoRewound );
            // canvas.addEventListener( VideoEvent.BUFFERING_STATE_ENTERED, this.handleBufferingStateEntered );
            // canvas.addEventListener( VideoEvent.CLOSE, this.handleClose );
            // canvas.addEventListener( VideoEvent.COMPLETE, this.handleComplete );
            // canvas.addEventListener( VideoEvent.FAST_FOWARD, this.handleFastFoward );
            // canvas.addEventListener( VideoEvent.PAUSED_STATE_ENTERED, this.handlePauseStateEntered );
            // canvas.addEventListener( VideoEvent.PLAYHEAD_UPDATE, this.handlePlayheadUpdate );
            // canvas.addEventListener( VideoEvent.PLAYING_STATE_ENTERED, this.handlePlayingStateEntered );
            // canvas.addEventListener( VideoEvent.READY, this.handleReady );
            // canvas.addEventListener( VideoEvent.REWIND, this.handleRewind );
            // canvas.addEventListener( VideoEvent.SCRUB_FINISH, this.handleScrubFinish );
            // canvas.addEventListener( VideoEvent.SCRUB_START, this.handleScrubStart );
            // canvas.addEventListener( VideoEvent.SEEKED, this.handleSeeked );
            // canvas.addEventListener( VideoEvent.SKIN_LOADED, this.handleSkinLoaded );
            // canvas.addEventListener( VideoEvent.STATE_CHANGE, this.handleStateChange );
            // canvas.addEventListener( VideoEvent.STOPPED_STATE_ENTERED, this.handleStopStateEntered );
            //
            // canvas.addEventListener( VideoProgressEvent.PROGRESS, this.handleProgress );
            //
            // canvas.addEventListener( ErrorEvent.PROGRESS, this.handleProgress );
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
        
        private destroyCanvas() : void {
            
            // delete canvas;
            
        }
        
        private handleComplete( event:VideoEvent ) : void {
            
        }
        
        public void play() {
            // canvas.play();
        }
        
        public void pause() {
            // canvas.pause();
        }
        
        public String getSrc() {
            return '';
        }
        
        public void setSrc( src:String ) {
            // canvas.src = src;
        }
        
        public getVolume() : Number {
            return 0.0;
        }
        
        public setVolume( volume:Number ) : void {
            // canvas.volume = volume;
        }
        
        public getDuration() : Number {
            return 0;
        }
        
        public getCurrentTime() : Number {
            return 0;
        }
        
        public void setCurrentTime( currentTime:Number ) {
            // canvas.currentTime = currentTime;
        }
        
        
    }
    
}