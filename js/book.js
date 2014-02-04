var Kinetic = require("./lib/kinetic");
var util = require("./util");

var stage, layers = {}, overlay;
var story;

var menuAssets = [
    {name: "home", path: "img/ui/btn-home.png"},
    {name: "audio", path: "img/ui/btn-audio.png"},
    {name: "next", path: "img/ui/btn-prev.png"},
    {name: "prev", path: "img/ui/btn-next.png"},
    {name: "top", path: "img/ui/text/top.png"},
    {name: "mid", path: "img/ui/text/content.png"},
    {name: "bottom-hide", path: "img/ui/text/bottom-hide.png"},
    {name: "bottom-show", path: "img/ui/text/bottom-show.png"},
    {name: "audio-bar", path: "img/ui/audio/bar.png"},
    {name: "audio-bg", path: "img/ui/audio/bg.png"},
    {name: "audio-handle", path: "img/ui/audio/handle.png"},
    {name: "audio-close", path: "img/ui/audio/close.png"},
];

exports.init = function(story){
    story = this.story;

    util.loadImages(menuAssets).then(function(images){
        stage = new Kinetic.Stage({
            container: "game-stage",
            width: gameWidth,
            height: gameHeight
        });

        window.addEventListener("resize", rescaleStage);

        rescaleStage();

        layers.staticBack = new Kinetic.Layer();
        layers.dynBack = new Kinetic.Layer();
        layers.dynFront = new Kinetic.Layer();
        layers.staticFront = new Kinetic.Layer();
        overlay = new Kinetic.Layer();

        stage.add(layers.staticBack);
        stage.add(layers.dynBack);
        stage.add(layers.dynFront);
        stage.add(layers.staticFront);
        stage.add(overlay);

        document.getElementById("game-stage").style.display = "block";

        updateLoop = new Kinetic.Animation(function(frame){
            // currentPage.update(frame, stage, layers);
        }, [layers.dynBack, layers.dynFront]);
    },  function(){
        // error loading images
    });
};

function rescaleStage(){
    var ratio = window.innerWidth/window.innerHeight;
    var scale;
    if(ratio > global.gameAspectRatio){
        scale = window.innerHeight / global.gameHeight;
    }
    else{
        scale = window.innerWidth / global.gameWidth;
    }
    var el = document.getElementById("game-stage");
    el.style.width = global.gameWidth * scale + "px";
    el.style.height = global.gameHeight * scale + "px";
    stage.scale(scale);
}
