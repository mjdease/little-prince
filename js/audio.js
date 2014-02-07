var Howl = require("./lib/howler").Howl;
var data = require("./data");

var sounds = [];

exports.getVolume = function(type){
    if(data.audio(type) !== undefined){
        return data.audio(type);
    }
    return 1;
};

exports.setVolume = function(type, level){
    if(level < 0.01) level = 0;
    if(level > 0.99) level = 1;
    data.audio(type, level);
    for(var i = 0; i < sounds.length; i++){
        var sound = sounds[i];
        if(sound.type === type){
            sound.setVolume(level);
        }
    }
};

exports.setDefaultLevels = function(){
    data.set("audio", {
        narration: 0.7,
        effects: 0.6,
        music: 0.25
    });
};

// TODO re-add android media support
exports.Sound = function(path, autoplay, loop, type){
    var that = this;

    if(type === undefined){
        type = "effects";
    }

    this.loop = loop;
    this.type = type;
    this.path = path;
    this.isPlaying = autoplay;

    this.raw = new Howl({
        urls : [this.path],
        autoplay : autoplay,
        loop : loop,
    });
    this.raw.volume(data.audio(type));

    sounds.push(this);

    this.play = function(){
        this.isPlaying = true;
        this.raw.play();
    };

    this.stop = function(){
        this.isPlaying=false;
        this.raw.stop();
    };

    this.setVolume = function(volume){
        this.raw.volume(volume);
    };

    this.destroy = function(){
        console.log("before - " + sounds.length);
        sounds.splice(sounds.indexOf(this), 1);
        console.log("after - " + sounds.length);
        this.stop();
        this.raw.unload();
    };
};
