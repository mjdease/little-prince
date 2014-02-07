var Kinetic = require("../lib/kinetic");
var _ = require("lodash");
var util = require("../util");
var Page = require("./page");

var assets = {};
var ui = {};
var sounds = {};

var scale;

var currentDay = 0;
var foxAwareness = 0;
var awarenessLimit = 15;
var resetTimeout;

var fox = {
    startX:1000,
    startY:752/2,
    speed: 80,
    targetX:1180,
    dir: 1,
    moving: true
};
var prince = {
    startX:100,
    startY:752/2,
    speed: 50,
    target: null
};
var hedgePositions = [300, 600, 900];

//input throttles
var inputLastCheck = 0;
var inputCheckThreshold = 75;
var endLastCheck = 0;
var endCheckThreshold = 200;
var dayChangeLastCheck = 0;
var dayChangeThreshold = 1000;

var page = new Page("earthEnding", 3);

page.setChallengeText("tame", 845, 57);

page.setRequiredAssets([
    {name: "prince", file: "prince.png"},
    {name: "hedge", file: "hedge.png"},
    {name: "fox", file: "fox.png"}
]);

page.initPage = function(images, stage, layers){
    scale = stage.scale().x;

    ui.touched = false;
    ui.layer = layers.staticFront;

    assets.hedge = new Kinetic.Image({
        y: global.gameHeight/2,
        image: images.hedge,
        listening: false,
        offset: {x:135,y:366}
    });

    assets.prince = new Kinetic.Image({
        x: prince.startX,
        y: prince.startY,
        image: images.prince,
        listening: false,
        offset:{x:65,y:95}
    });

    assets.fox = new Kinetic.Image({
        x: fox.startX,
        y: fox.startY,
        image: images.fox,
        listening: false,
        offset:{x:82,y:86}
    });

    layers.dynFront.add(assets.prince).add(assets.fox);

    stage.on("touchstart mousedown", function(e){
        if(page.getState() != page.States.PLAYING){
            return;
        }
        ui.touched = true;
        var pos = stage.getPointerPosition();
        prince.target = {x : pos.x/scale, y : pos.y/scale};
    });
    stage.on("touchend mouseup", function(e){
        if(page.getState() != page.States.PLAYING){
            return;
        }
        ui.touched = false;
        prince.target = null;
    });
    stage.on("mousemove touchmove", function(e){
        if(!ui.touched || page.getState() != page.States.PLAYING){
            return;
        }
        if(Date.now() - inputLastCheck > inputCheckThreshold){
            inputLastCheck = Date.now();
            var pos = stage.getPointerPosition();
            prince.target = {x : pos.x/scale, y : pos.y/scale};
        }
    });
};

page.startPage = function(){

};

page.startChallenge = function(layers){
    ui.msgbox = new Kinetic.Rect({
        x:global.gameWidth/2,
        y:100,
        opacity: 0.8,
        stroke: "black",
        strokeWeight: 10
    });
    ui.msg = new Kinetic.Text({
        fontFamily:"lp_Body",
        fontWeight:"bold",
        fontSize:32,
        padding:20,
        align:"center",
        fill:"black",
        x:global.gameWidth/2,
        y:100,
        listening:false
    });
    layers.dynBack.add(assets.hedge);
    layers.staticFront.add(ui.msgbox).add(ui.msg);
    nextDay(false);
    resetMessage();

    page.setState(page.States.PLAYING);
}

page.update = function(frame, stage, layers){
    if(page.getState() != page.States.PLAYING){
        return;
    }
    movePrince(frame.timeDiff);
    moveFox(frame.timeDiff);
    checkEnd();
};

page.destroyPage = function(){
    resetChallenge();
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

function checkEnd(){
    if(Date.now() - endLastCheck > endCheckThreshold){
        endLastCheck = Date.now();
        if(fox.dir === -1 && prince.target && prince.target.x > assets.prince.getX()){
            foxAwareness++;
            if(foxAwareness > awarenessLimit){
                endChallenge(false, "The fox saw you. Tap to try again.");
                return;
            }
            else{
                showMessage("Don't move when the fox can see you!", "orange", 1000);
                return;
            }
        }
        if(currentDay === 4){
            endChallenge(true, "You tamed the fox!");
        }
    }
}

function endChallenge(isPass, message){
    if(isPass){
        showMessage(message, "green");
        page.setState(page.States.PASSED);
    }
    else{
        ui.msgbox.on("click", function(){
            restartChallenge();
        });
        showMessage(message, "red");
        page.setState(page.States.FAILED);
    }
}

function resetChallenge(){
    currentDay = 0;
    foxAwareness = 0;
    fox.dir = 1;
    fox.moving = true;
    prince.target = null;
    ui.touched = false;
    if(resetTimeout){
        clearTimeout(resetTimeout);
        resetTimeout = null;
    }
}

function restartChallenge(){
    resetChallenge();
    assets.fox.x(fox.startX);
    assets.prince.position({x:prince.startX, y:prince.startY});
    nextDay(false);
    resetMessage();
    page.setState(page.States.PLAYING);
}

function movePrince(timeDiff){
    if(prince.target){
        var angle = Math.atan2(prince.target.y-assets.prince.getY(), prince.target.x-assets.prince.x());
        var dispX = prince.speed * Math.cos(angle) * timeDiff / 1000;
        var dispY = prince.speed * Math.sin(angle) * timeDiff / 1000;
        assets.prince.move({x:dispX, y:dispY});
        if(assets.prince.x() > assets.hedge.x()){
            nextDay(true);
        }
    }
}

function moveFox(timeDiff){
    if(fox.moving){
        var foxX = assets.fox.x();
        var target = fox.dir === -1 ? fox.startX : fox.targetX;
        var disp = fox.dir * fox.speed * timeDiff / 1000;
        assets.fox.move({x:disp, y:0});
        if((fox.dir === 1 && foxX + disp > target) ||
           (fox.dir === -1 && foxX + disp < target)){
            assets.fox.setX(foxX + disp);
            fox.moving=false;
            setTimeout(function(){
                fox.moving = true;
                fox.dir *= -1;
                assets.fox.setScaleX(fox.dir);
            }, _.random(fox.dir === -1 ? 250 : 2000, fox.dir === -1 ? 1500 : 6000));
        }
    }
}

function nextDay(message){
    if(Date.now() - dayChangeLastCheck > dayChangeThreshold){
        dayChangeLastCheck = Date.now();
        assets.hedge.setX(hedgePositions[currentDay]);
        currentDay++;
        if(message && currentDay <= 3){
            showMessage("Congratulations! You made it to Day " + currentDay, "green", 1500);
        }
    }
}

function showMessage(msg, color, resetDelay){
    ui.msg.setText(msg);
    var msgWidth = ui.msg.getWidth();
    var msgHeight = ui.msg.getHeight();
    ui.msg.setOffsetX(msgWidth/2);
    ui.msg.setOffsetY(msgHeight/2);

    ui.msgbox.setWidth(msgWidth);
    ui.msgbox.setHeight(msgHeight);
    ui.msgbox.setOffsetX(msgWidth/2);
    ui.msgbox.setOffsetY(msgHeight/2);
    ui.msgbox.setFill(color);

    if(resetTimeout){
        clearTimeout(resetTimeout);
        resetTimeout = null;
    }

    if(resetDelay){
        resetTimeout = setTimeout(resetMessage, resetDelay);
    }
    ui.layer.batchDraw();
}

function resetMessage(){
    showMessage("Day " + currentDay, "white");
}

module.exports = page;
