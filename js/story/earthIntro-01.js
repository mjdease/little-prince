var Kinetic = require("../lib/kinetic");
var _ = require("lodash");
var util = require("../util");
var Page = require("./page");

var assets = {};
var sounds = {};
var loops = {};
var ui = {};
var scale = {
    clouds : -0.15,
    dunes : -0.6,
    sand : -4
};

// gameplay constants
var speed = 226;
var speedChangeRate = 2;
var landingSpeed = 113;
var landingSpeedTolerance = 25;
var maxSpeed = 302;
var stallSpeed = 87;
var angle = 0;
var angleChangeRate = 180/512;
var angleLimit = 180/ 4;
var angleLandingTolerance = 180/ 16;

// asset layout
var duneStart = -200;
var duneOverlap = 360;
var sandOverlap = 5;
var duneWidth, sandWidth;

// inputs
var increaseSpeed = false;
var decreaseSpeed = false;
var increaseAngle = false;
var decreaseAngle = false;

// update rate throttles
var inputLastCheck = 0;
var inputCheckThreshold = 100;
var endLastCheck = 0;
var endCheckThreshold = 400;

var page = new Page("earthIntro", 1, false);

page.setChallengeText("manoeuvre", 683, 57);

page.setRequiredAssets([
    {name: "plane", file: "plane.png"},
    {name: "dunes", file: "dunes.png"},
    {name: "sand", file: "sands.png"},
    {name: "cloud1", file: "cloud1.png"},
    {name: "cloud2", file: "cloud2.png"},
    {name: "cloud3", file: "cloud3.png"},
    {name: "cloud4", file: "cloud4.png"},
    {name: "cloud5", file: "cloud5.png"},
    {name: "cloud6", file: "cloud6.png"},
    {name: "ameter", file: "angle-meter.jpg"},
    {name: "smeter", file: "speed-meter.jpg"},
    {name: "down", file: "arrow-down.png"},
    {name: "up", file: "arrow-up.png"}
]);

page.initPage = function(images, stage, layers){
    assets.clouds = [];
    loops.clouds = [];
    for(var i = 0; i < 6; i++){
        var cloud = new Kinetic.Image({
            x: _.random(30, 1200),
            y: _.random(0, 360),
            image: images["cloud" + i],
        });
        layers.dynBack.add(cloud);
        assets.clouds.push(cloud);
        loops.clouds.push(cloud);
    }

    assets.sand = new Kinetic.Image({
        y: global.gameHeight,
        image: images.sand,
        offsetY: 120
    });
    sandWidth = assets.sand.getWidth();
    loops.sands = [assets.sand.clone({x:0}), assets.sand.clone({x:sandWidth - sandOverlap}), assets.sand.clone({x:(sandWidth - sandOverlap)*2})];

    assets.dune = new Kinetic.Image({
        y: 374,
        image: images.dunes
    });
    duneWidth = assets.dune.getWidth();
    loops.dunes = [assets.dune.clone({x:duneStart}), assets.dune.clone({x:duneStart + duneWidth - duneOverlap})]

    util.addToStage(layers.dynBack, loops.dunes);
    util.addToStage(layers.dynBack, loops.sands);

    assets.plane = util.defineSprite({
        x: 510,
        y: 190,
        offset: {x:375, y:347},
        image: images.plane,
        animation: "flying",
        frameRate: 24
    }, 644, 446, [{flying: 7}]);
    layers.dynFront.add(assets.plane);

    assets.images = {
        up : images.up,
        down: images.down,
        smeter: images.smeter,
        ameter: images.ameter
    };

    initializeUi();

    stage.on("mouseup touchend", function(){
        increaseSpeed = false;
        decreaseSpeed = false;
        increaseAngle = false;
        decreaseAngle = false;
    });
};

page.startPage = function(layers){
    assets.plane.start();
};

page.startChallenge = function(layers){
    initializeUi();

    layers.dynFront.add(ui.angle).add(ui.throttle);

    page.setState(page.States.PLAYING);
};

page.update = function(frame, stage, layers){
    var pageState = page.getState();
    if(pageState == page.States.FAILED || speed == 0){
        return;
    }

    if(pageState == page.States.PASSED){
        speed -= 0.2*speedChangeRate;
        if(speed < 0) {
            assets.plane.stop();
            speed = 0;
        }
    }

    var dispX = speed * Math.cos(angle * Math.PI / 180) * frame.timeDiff / 1000;
    var dispY = speed * Math.sin(angle * Math.PI / 180) * frame.timeDiff / 1000;

    assets.plane.rotation(angle);
    if(pageState != page.States.PASSED){
        assets.plane.move({x:0, y:dispY});
    }

    for(var i = 0; i < loops.clouds.length; i++){
        var cloud = loops.clouds[i];
        if(cloud.getX() + cloud.getWidth() < 0){
            cloud.setX(global.gameWidth);
        }
        else{
            cloud.move({x:scale.clouds * dispX, y:0});
        }
    }

    for(i = 0; i < loops.dunes.length; i++){
        var dune = loops.dunes[i];
        if(dune.getX() + duneWidth < 0){
            dune.setX(duneWidth - duneOverlap*2);
        }
        dune.move({x:scale.dunes * dispX, y:0});
    }

    for(i = 0; i < loops.sands.length; i++){
        var sand = loops.sands[i];
        var currX = sand.getX();
        if(currX + sandWidth < 0){
            sand.setX(currX + (sandWidth - sandOverlap) * 3);
        }
        sand.move({x:scale.sand * dispX, y:0});
    }

    if(pageState != page.States.PLAYING){
        return;
    }

    updateVelocity();
    checkEnd(layers.staticFront);
};

page.destroyPage = function(){
    resetChallenge();

    for(var n in loops){
        delete loops[n];
    }
    for(n in assets){
        delete assets[n];
    }
    for(n in ui){
        delete ui[n];
    }
    for(n in sounds){
        sounds[n].destroy();
        delete sounds[n];
    }
};

function getAngleMeterStatus(){
    return 30 + util.map(angle, -angleLimit, angleLimit, 0, 160);
}

function getSpeedMeterStatus(){
    return 30 + util.map(speed, maxSpeed, stallSpeed, 0, 160);
}

function updateVelocity(){
    if(Date.now() - inputLastCheck > inputCheckThreshold){
        inputLastCheck = Date.now();
        if(increaseAngle) angle += angleChangeRate;
        if(decreaseAngle) angle -= angleChangeRate;
        if(increaseSpeed) speed += speedChangeRate;
        if(decreaseSpeed) speed -= speedChangeRate;
        speed += speedChangeRate * 2 * util.map(angle, -angleLimit, angleLimit, -1, 1);
        if(speed > maxSpeed) speed = maxSpeed;
        if(angle < -angleLimit) angle = -angleLimit;
        if(angle > angleLimit) angle = angleLimit;
        ui.angleIndicator.setY(getAngleMeterStatus());
        ui.angleLabel.setText(Math.round(angle * -1) + "°");
        ui.throttleIndicator.setY(getSpeedMeterStatus());
        ui.throttleLabel.setText(Math.round(speed / 0.621) + "km/h");
    }
}

function checkEnd(layer){
    if(Date.now() - endLastCheck > endCheckThreshold){
        endLastCheck = Date.now();
        if(speed < stallSpeed){
            endChallenge(false, "The plane was travelling too slow and stalled.", layer);
            return;
        }
        //touchdown
        if(assets.plane.getY() > global.gameHeight - 120){
            if(angle > angleLandingTolerance || angle < -angleLandingTolerance){
                endChallenge(false, "The plane landed at too steep an angle.", layer);
                return;
            }
            if(speed > landingSpeed + landingSpeedTolerance){
                endChallenge(false, "The plane was travelling too fast.", layer);
                return;
            }
            endChallenge(true, "You landed the plane successfully!", layer);
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
        ui.throttle.hide();
        ui.angle.hide();
        page.setState(page.States.PASSED);
    }
    else{
        assets.plane.stop();
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

function resetChallenge(){
    speed = 226;
    angle = 0;
    inputLastCheck = 0;
    endLastCheck = 0;
    increaseSpeed = false;
    decreaseSpeed = false;
    increaseAngle = false;
    decreaseAngle = false;
}

function restartChallenge(){
    resetChallenge();
    assets.plane.position({x:510, y:190}).start();
    page.setState(page.States.PLAYING);
}

function initializeUi(){
    ui.angle = new Kinetic.Group({
        x:1280 - 90 - 20,
        y:global.gameHeight - 10 - 136 - 10 - 190
    });
    ui.throttle = new Kinetic.Group({
        x:20,
        y:global.gameHeight - 10 - 136 - 10 - 190
    });

    var label = new Kinetic.Text({
        fontFamily:"lp_Body",
        y:3,
        fontSize:28,
        width:90,
        align:"center",
        fill:"black"
    });
    var loc = new Kinetic.Rect({
        width:10,
        height:10,
        offset: {x:5,y:5},
        rotation : 180/4,
        fill:"black"
    });
    var btnUp = new Kinetic.Image({
        image: assets.images.up
    });
    var btnDown = new Kinetic.Image({
        image: assets.images.down
    });

    ui.angleUp = btnUp.clone({
        x:40,
        y:30
    }).on("mousedown touchstart", function(){
        decreaseAngle = true;
    });

    ui.angleDown = btnDown.clone({
        x:40,
        y:30+80
    }).on("mousedown touchstart", function(){
        increaseAngle = true;
    });
    ui.angleIndicator = loc.clone({
        x: 15,
        y: getAngleMeterStatus()
    });
    ui.angleLabel = label.clone({
        fontSize:24,
    });
    ui.angle.add(new Kinetic.Image({
        y:30,
        stroke: "black",
        strokeWidth: 6,
        image:assets.images.ameter
    })).add(label.clone({
        text:"Angle",
        y: -32,
        stroke: "black",
        strokeWidth: 1,
    })).add(ui.angleIndicator).add(ui.angleDown).add(ui.angleUp).add(ui.angleLabel);

    ui.throttleUp = btnUp.clone({
        y:30
    }).on("mousedown touchstart", function(){
        increaseSpeed = true;
    });
    ui.throttleDown = btnDown.clone({
        y:30+80
    }).on("mousedown touchstart", function(){
        decreaseSpeed = true;
    });

    ui.throttleIndicator = loc.clone({
        x: 60 + 15,
        y: getSpeedMeterStatus()
    });
    ui.throttleLabel = label.clone({
        fontSize:24,
        width:120,
        offsetX:15
    });
    ui.throttle.add(new Kinetic.Image({
        y: 30,
        x: 60,
        stroke: "black",
        strokeWidth: 6,
        image: assets.images.smeter
    })).add(label.clone({
        text:"Speed",
        y: -32,
        stroke: "black",
        strokeWidth: 1,
    })).add(ui.throttleIndicator).add(ui.throttleDown).add(ui.throttleUp).add(ui.throttleLabel);
}

module.exports = page;
