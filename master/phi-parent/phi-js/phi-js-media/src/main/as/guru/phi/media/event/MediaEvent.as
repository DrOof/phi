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
