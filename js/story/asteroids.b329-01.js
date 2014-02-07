var Kinetic = require("../lib/kinetic");
var _ = require("lodash");
var util = require("../util");
var Page = require("./page");

var assets = {};
var gameObjects = {};
var sounds = {};

var numLamps = 8;
var lampExtraOffset = 230;
var rotationSpeed = 180 / 16;

var lampsLit = 0;

var page = new Page("asteroids.b329", 1, false);

page.setNextPage("menu", 1);

page.setChallengeText("coordinated", 785, 403);

page.setRequiredAssets([
    {name: "planet", file: "planet.png"},
    {name: "lamp", file: "lamp.png"}
]);

page.initPage = function(images, stage, layers){
    gameObjects.lamps = [];

    assets.lamp = util.defineSprite({
        x:global.gameWidth/2,
        y:global.gameHeight,
        image: images.lamp,
        animation: "lampAnim",
        frameRate: 1,
        offset: {x:189, y:391 + lampExtraOffset}
    }, 378, 391, [{lampAnim: 2}]);

    assets.planet = new Kinetic.Image({
        x:global.gameWidth/2,
        y:global.gameHeight,
        image: images.planet,
        offset: {x: 368, y:360}
    });

    layers.dynBack.add(assets.planet);

    var rotationIcrement = 360 / numLamps;
    for(var i = 0; i < numLamps; i++){
        var lamp = assets.lamp.clone({
            rotation : i * rotationIcrement
        });
        lamp.on("click", onLampClick);
        gameObjects.lamps.push(lamp);
        layers.dynFront.add(lamp);
    }
};

page.startPage = function(){
    var msPerFrame = 1 / assets.lamp.getFrameRate() * 1000;
    for(var i = 0; i < numLamps; i++){
        var lamp = gameObjects.lamps[i];
        (function(l){
            setTimeout(function(){
                l.start();
            }, i * msPerFrame / numLamps * 2);
        })(lamp);
    }
};


page.startChallenge = function(){
    for(var i = 0; i < numLamps; i++){
        var lamp = gameObjects.lamps[i];
        lamp.stop();
        lamp.setIndex(0);
    }

    page.setState(page.States.PLAYING);
}

page.update = function(frame, stage, layers){
    var rotationDiff = rotationSpeed * frame.timeDiff / 1000;
    assets.planet.rotate(rotationDiff);
    for(var i = 0; i < numLamps; i++){
        var lamp = gameObjects.lamps[i];
        lamp.rotate(rotationDiff);
    }
    if(page.getState() === page.States.PLAYING){
        checkEnd(layers.staticFront);
    }
};

page.destroyPage = function(){
    resetChallenge();

    for(var n in assets){
        delete assets[n];
    }
    for(n in gameObjects){
        delete gameObjects[n];
    }
    for(n in sounds){
        sounds[n].destroy();
        delete sounds[n];
    }
};

function checkEnd(layer){
    if(lampsLit == numLamps){
        endChallenge("You lit all the lamps!", layer);
    }
}

function endChallenge(message, layer){
    var msgbox = new Kinetic.Rect({
        x:global.gameWidth/2,
        y:global.gameHeight/2,
        width:900,
        height: 72,
        offsetX:450,
        offsetY: 36,
        fill: "green",
        opacity: 0.8,
        stroke: "black",
        strokeWeight: 10
    });
    var msg = new Kinetic.Text({
        text:message,
        fontFamily:"lp_Body",
        fontWeight:"bold",
        fontSize:32,
        padding:20,
        align:"center",
        fill:"black",
        x:global.gameWidth/2,
        y:global.gameHeight/2,
        width:900,
        height: 72,
        offsetX:450,
        offsetY: 36,
        listening:false
    });

    page.challengeComplete();

    layer.add(msgbox).add(msg).batchDraw();
}

function resetChallenge(){
    lampsLit = 0;
}

function onLampClick(e){
    var lamp = e.targetNode;
    if(lamp.getIndex() > 0 || page.getState() != page.States.PLAYING){
        return;
    }
    lamp.setIndex(1);
    lampsLit++;
}

module.exports = page;
