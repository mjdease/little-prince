var Kinetic = require("../lib/kinetic");
var util = require("../util");
var Page = require("./page");
var Sound = require("../audio").Sound;

var assets = {};
var gameObjects = {};
var ui = {};
var sounds = {};

// gameplay constants
var depthPerRotation = 250;
var raisedDepth = 150;
var maxDepth = depthPerRotation * 3;
var waterDepth = depthPerRotation * 2;
var fillRate = 0.05;
var maxFill = 1;
var targetFill = 0.7;
var targetTolerance = 0.1;

var fill = 0;

// update rate throttles
var inputLastCheck = 0;
var inputCheckThreshold = 40;
var endLastCheck = 0;
var endCheckThreshold = 400;

var page = new Page("earthEnding", 5);

page.setChallengeText("quench", 613, 345);

page.setRequiredAssets([
    {name: "handle", file: "handle.png"},
    {name: "well", file: "well.png"},
    {name: "bucket", file: "bucket.png"},
    {name: "rope", file: "rope.png"},
    {name: "reel", file: "reel.png"},
    {name: "container", file: "container.png"},
    {name: "water", file: "water.png"}
]);

page.initPage = function(images, stage, layers){
    scale = stage.scale().x;

    ui.touch = false;

    assets.bucket = new Kinetic.Image({
        image: images.bucket
    });
    assets.rope = new Kinetic.Image({
        image: images.rope
    });
    assets.reel = new Kinetic.Image({
        image: images.reel
    });

    ui.water = new Kinetic.Image({
        x:162,
        y:712,
        image: images.water,
        scaleY: 0,
        offset:{x:66,y:368}
    });
    ui.container = new Kinetic.Image({
        image: images.container,
        x : 162,
        y : 712,
        offset : {x:133,y:426}
    });
    ui.handle = new Kinetic.Image({
        image: images.handle,
        x : 1075,
        y : 540,
        offset : {x:154,y:154}
    });

    var well = new Kinetic.Image({
        x:502,
        y:752,
        image: images.well,
        offsetY: 347
    });
    layers.staticFront.add(well).batchDraw();
    well.moveToBottom();

    sounds.tap = new Sound("audio/effect/water.mp3", false, true, "effect");
    sounds.pull = new Sound("audio/effect/pulley.mp3", false, true, "effect");

    gameObjects.bucket = new Bucket(577, 53, assets.bucket.getWidth());

    layers.dynBack.add(gameObjects.bucket.node);

    stage.on("mouseup touchend", function(){
        ui.touched = false;
        ui.angle = null;
        if(sounds.pull) sounds.pull.stop();
    });
    var handlePosition = ui.handle.getPosition();
    ui.handle.on("mousemove touchmove", function(e){
        if(!ui.touched || page.getState() != page.States.PLAYING){
            return;
        }
        if(Date.now() - inputLastCheck > inputCheckThreshold){
            inputLastCheck = Date.now();
            var pos = stage.getPointerPosition();
            var pointer = {x : pos.x/scale, y : pos.y/scale};
            var angle = Math.atan2(pointer.y - handlePosition.y, pointer.x - handlePosition.x);
            var rotationDirection = getRotationDirection(angle, ui.angle);
            var depth = gameObjects.bucket.getDepth();
            if(rotationDirection < 0 && depth === 0 ||
                rotationDirection > 0 && depth === maxDepth){
                return;
            }
            ui.handle.setRotation(angle * 180 / Math.PI);
            if(ui.angle !== null){
                gameObjects.bucket.move(rotationDirection * getDepthFromAngle(angle, ui.angle));
            }
            ui.angle = angle;
        }
    });
};

page.startPage = function(){

};

page.startChallenge = function(layers){
    layers.dynFront.add(ui.water).add(ui.handle);
    layers.staticFront.add(ui.container).batchDraw();

    ui.handle.on("mousedown touchstart", function(){
        ui.touched = true;
        ui.angle = null;
        if(sounds.pull) sounds.pull.play();
    });

    page.setState(page.States.PLAYING);
};

page.update = function(frame, stage, layers){
    if(page.getState() != page.States.PLAYING){
        return;
    }

    var fillScale = (gameObjects.bucket.getDepth() - waterDepth) / (maxDepth - waterDepth);
    if(fillScale > 0){
        fill += (fillScale * fillRate * frame.timeDiff/1000);
        ui.water.setScaleY(fill);
    }

    checkEnd(layers.staticFront);
};

page.destroyPage = function(){
    resetChallenge();
    for(n in assets){
        delete assets[n];
    }
    for(n in ui){
        delete ui[n];
    }
    for(n in gameObjects){
        delete gameObjects[n];
    }
    for(n in sounds){
        sounds[n].destroy();
        delete sounds[n];
    }
};

function resetChallenge(){
    fill = 0;
    inputLastCheck = 0;
    endLastCheck = 0;
    ui.touching = false;
}

function restartChallenge(){
    resetChallenge();
    gameObjects.bucket.setDepth(0);
    ui.water.setScaleY(0);
    page.setState(page.States.PLAYING);
}

function checkEnd(layer){
    if(Date.now() - endLastCheck > endCheckThreshold){
        endLastCheck = Date.now();
        var depth = gameObjects.bucket.getDepth();
        if(fill > targetFill + targetTolerance){
            endChallenge(false, "The bucket is too full.", layer);
            return;
        }
        if(depth < raisedDepth && fill > 0.2){
            if(fill < targetFill - targetTolerance){
                endChallenge(false, "You didn't get enough water.", layer);
                return;
            }
            endChallenge(true, "You collected the water for the little prince!", layer);
            return;
        }
    }
}

function endChallenge(isPass, message, layer){
    var msgbox = new Kinetic.Rect({
        x:global.gameWidth/2,
        y:global.gameHeight/2,
        width:900,
        height: isPass ? 72 : 104,
        offsetX:450,
        offsetY: isPass ? 36 : 52,
        fill: isPass ? "green" : "red",
        opacity: 0.8,
        stroke: "black",
        strokeWeight: 10
    });
    var msg = new Kinetic.Text({
        text:message + (isPass ? "" : "\nTap to retry."),
        fontFamily:"lp_Body",
        fontWeight:"bold",
        fontSize:32,
        padding:20,
        align:"center",
        fill:"black",
        x:global.gameWidth/2,
        y:global.gameHeight/2,
        width:900,
        height: isPass ? 72 : 104,
        offsetX:450,
        offsetY: isPass ? 36 : 52,
        listening:false
    });
    if(isPass){
        ui.water.hide();
        ui.container.hide();
        ui.handle.hide();
        page.setState(page.States.PASSED);
    }
    else{
        msgbox.on("click", function(){
            msg.destroy();
            msgbox.destroy();
            layer.batchDraw();
            restartChallenge();
        });
        page.setState(page.States.FAILED);
    }
    layer.add(msgbox).add(msg).batchDraw();
}

function getRotationDirection(newAngle, oldAngle){
    if(newAngle > Math.PI/2 && oldAngle < -Math.PI/2){
        // clockwise
        return -1;
    }
    if(newAngle < -Math.PI/2 && oldAngle > Math.PI/2){
        // counter-clockwise
        return 1;
    }
    if(newAngle > oldAngle){
        // clockwise
        return -1;
    }
    else{
        // counter-clockwise
        return 1;
    }
}

function getDepthFromAngle(newAngle, oldAngle){
    var theta;
    if(newAngle > Math.PI/2 && oldAngle < -Math.PI/2){
        theta = (Math.PI - newAngle) + (oldAngle + Math.PI);
    }
    else if(newAngle < -Math.PI/2 && oldAngle > Math.PI/2){
        theta = (newAngle + Math.PI) + (Math.PI - oldAngle);
    }
    else{
        // #shittycoding
        theta = Math.abs(Math.abs(newAngle) - Math.abs(oldAngle));
    }
    var totalRotation = maxDepth / depthPerRotation * 2 * Math.PI;
    return theta/totalRotation*maxDepth;
}

function Bucket(x, y, width){
    var depth = 0;
    var reelOverlap = 5;
    var bucketOverlap = 6;
    var rope = new Kinetic.Collection();
    var ropeSegmentHeight = assets.rope.getHeight();
    var reelHeight = assets.reel.getHeight();

    this.node = new Kinetic.Group({
        x:x,
        y:y,
        offsetX:width/2
    });

    var reel = assets.reel.clone({
        offsetX:-width/2 + assets.reel.getWidth()/2
    });
    var bucket = assets.bucket.clone({
        offsetY:-assets.reel.getHeight()
    });

    this.node.add(reel).add(bucket);

    this.setDepth = function(d){
        depth = d;
        if(depth < 0) depth = 0;
        if(depth > maxDepth) depth = maxDepth;
        var requiredSegments = Math.ceil((depth + reelOverlap + bucketOverlap)/ropeSegmentHeight);
        var offsetY = depth - requiredSegments * ropeSegmentHeight;
        if(requiredSegments > rope.length){
            var cachedLength = rope.length;
            for(var i = 0; i < requiredSegments - cachedLength; i++){
                var newSegment = assets.rope.clone({
                    offsetY:-reelHeight + reelOverlap,
                    offsetX:-width/2 + assets.rope.getWidth()/2
                });
                rope.splice(0,0,newSegment);
                this.node.add(newSegment);
                newSegment.moveToBottom();
            }
        }
        if(requiredSegments < rope.length && rope.length){
            var removedSegment = rope.splice(0,1);
        }
        rope.each(function(segment, i){
            segment.setY(offsetY + i * ropeSegmentHeight);
        });
        bucket.setY(depth - bucketOverlap);
        if(depth > waterDepth){
            if(!sounds.tap.isPlaying) sounds.tap.play();
        }
        else{
            if(sounds.tap.isPlaying) sounds.tap.stop();
        }
    };

    this.getDepth = function(){
        return depth;
    };

    // - is up + is down
    this.move = function(d){
        this.setDepth(depth + d);
    };

    this.setDepth(0);
}

module.exports = page;
