var Kinetic = require("../lib/kinetic");
var util = require("../util");
var accelerometer = require("../accelerometer");
var Page = require("./page");

var assets = {};
var sounds = {};

var lastEndCheck = 0;
var checkThreshold = 300;

var prince = {
    speed : 20,
    x : 0,
    y : 1
};
var ratSpeed = 80;
var gridSize = 90;
var gridStartX = 0;
var gridStartY = -28;
var gridWidth = 14;
var gridHeight = 9;
var grid = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
            [1,1,1,1,1,1,0,1,1,1,1,1,1,0,],
            [0,1,0,0,0,1,0,1,0,1,0,0,1,0,],
            [0,1,1,1,0,1,1,1,0,1,0,0,1,0,],
            [0,1,0,1,0,1,0,1,0,1,1,1,1,0,],
            [0,1,1,1,1,1,1,1,0,1,0,0,1,0,],
            [0,0,0,1,0,0,0,1,0,1,0,0,1,0,],
            [0,1,1,1,1,1,1,1,1,1,0,0,1,1,],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,]];
var gridCenters = [];
var ratPath = [{x: 1, y:7, dir:"right"},
               {x: 3, y:7, dir:"up"},
               {x: 3, y:5, dir:"right"},
               {x: 7, y:5, dir:"down"},
               {x: 7, y:7, dir:"right"},
               {x: 9, y:7, dir:"up"},
               {x: 9, y:4, dir:"right"},
               {x:12, y:4, dir:"down"},
               {x:12, y:7, dir:"right"},
               {x:13, y:7}];
var ratProgress = 0;
var ratTarget;
var ratDir;

var page = new Page("asteroids.b325", 1, false);

page.setChallengeText("entrap", 863, 288);

page.setNextPage("menu", 1);

page.setRequiredAssets([
    {name: "prince", file: "prince.png"},
    {name: "rat", file: "rat.png"},
    {name: "atmos", file: "atmosphere.png"},
    {name: "shadow", file: "shadow.png"}
]);

page.initPage = function(images, stage, layers){
    makeGrid();

    layers.staticBack.add(new Kinetic.Image({
        image: images.atmos,
        listening: false
    })).add(new Kinetic.Image({
        image: images.shadow,
        listening: false
    }));

    assets.prince = util.defineSprite({
        image: images.prince,
        animation: "normal",
        frameRate: 1,
        offset:{x:40 , y:40}
    }, 80, 80, {normal: 3});

    assets.rat = util.defineSprite({
        image: images.rat,
        animation: "rightWalk",
        frameRate: 14,
        offset:{x:55, y:26}
    }, 110, 52, {rightWalk: 3, leftWalk: 3});
};

page.startPage = function(layers){

};

page.startChallenge = function(layers){
    layers.dynFront.add(assets.prince).add(assets.rat);

    var princeStart = getTileCenterFromCoordinate(prince);
    assets.prince.position({x:princeStart.x, y:princeStart.y});

    var ratStart = getTileCenterFromCoordinate(ratPath[ratProgress]);
    assets.rat.position({x:ratStart.x, y:ratStart.y});
    setNextRatTarget();


    assets.rat.start();

    accelerometer.init();

    page.setState(page.States.PLAYING);
};

page.update = function(frame, stage, layers){
    if(page.getState() != page.States.PLAYING){
        return;
    }
    movePrince(accelerometer.get(), frame.timeDiff);
    moveRat(frame.timeDiff);
    if(frame.time - lastEndCheck > checkThreshold){
        lastEndCheck = frame.time;
        checkEnd(layers.staticFront);
    }
};

page.destroyPage = function(){
    resetChallenge();

    //destroy accelerometer when leaving the page
    accelerometer.destroy();

    for(n in assets){
        delete assets[n];
    }
    for(n in sounds){
        sounds[n].destroy();
        delete sounds[n];
    }
};

function resetChallenge(){
    ratProgress = 0;
}

function restartChallenge(){
    resetChallenge();

    var princeStart = getTileCenterFromCoordinate(prince);
    assets.prince.position({x:princeStart.x, y:princeStart.y});

    var ratStart = getTileCenterFromCoordinate(ratPath[ratProgress]);
    assets.rat.position({x:ratStart.x, y:ratStart.y});
    setNextRatTarget();

    assets.rat.start();

    accelerometer.reset();

    page.setState(page.States.PLAYING);
}

function makeGrid(){
    var halfTile = gridSize / 2;
    for(var y = 0; y < gridHeight; y++){
        var row = [];
        var rowY = y * gridSize + halfTile + gridStartY;
        for(var x = 0; x < gridWidth; x++){
            row.push({x : x * gridSize + halfTile + gridStartX, y: rowY})
        }
        gridCenters.push(row);
    }
}

function getTile(pos){
    pos.x -= gridStartX;
    pos.y -= gridStartY;
    return {x: Math.floor(pos.x/gridSize), y: Math.floor(pos.y/gridSize)};
}

function getTileCenterFromPosition(pos){
    var tile = getTile(pos);
    return gridCenters[tile.y][tile.x];
}

function getTileCenterFromCoordinate(pos){
    return gridCenters[pos.y][pos.x];
}

function movePrince(acc, timeDiff){
    var xVel = acc.y;
    var yVel = acc.x;
    var currentPos = assets.prince.position();
    var curX = currentPos.x;
    var curY = currentPos.y;
    var i = getTile(currentPos);
    var tileCenter = gridCenters[i.y][i.x];
    var xDiff = xVel * prince.speed * timeDiff / 1000;
    var yDiff = yVel * prince.speed * timeDiff / 1000;
    if(xDiff > 0){//right
        if(!grid[i.y][i.x + 1]){ // can't enter the right tile
            xDiff = Math.min(xDiff, tileCenter.x - curX);
        }
        else{ // can enter the right tile

        }
    }
    else if(xDiff < 0){//left
        if(!grid[i.y][i.x - 1] || currentPos.x - gridStartX < gridSize){ // can't enter the left tile
            xDiff = Math.max(xDiff, tileCenter.x - curX);
        }
        else{ // can enter the left tile

        }
    }
    if(yDiff > 0){//down
        if(!grid[i.y + 1][i.x]){ // can't enter the down tile
            yDiff = Math.min(yDiff, tileCenter.y - curY);
        }
        else{ // can enter the down tile

        }
    }
    else if(yDiff < 0){//up
        if(!grid[i.y - 1][i.x]){ // can't enter the up tile
            yDiff = Math.max(yDiff, tileCenter.y - curY);
        }
        else{ // can enter the up tile

        }
    }
    assets.prince.move({x:xDiff, y:yDiff});
}

function moveRat(timeDiff){
    var xDiff = 0;
    var yDiff = 0;
    var pos = assets.rat.getPosition();
    switch(ratDir){
        case "right":
            xDiff = ratSpeed * timeDiff/1000;
            if(pos.x + xDiff > ratTarget.x){
                xDiff = ratTarget.x - pos.x;
                setNextRatTarget();
            }
            break;
        case "left":
            xDiff = -1 * ratSpeed * timeDiff/1000;
            if(pos.x + xDiff < ratTarget.x){
                xDiff = ratTarget.x - pos.x;
                setNextRatTarget();
            }
            break;
        case "up":
            yDiff = -1 * ratSpeed * timeDiff/1000;
            if(pos.y + yDiff < ratTarget.y){
                yDiff = ratTarget.y - pos.y;
                setNextRatTarget();
            }
            break;
        case "down":
            yDiff = ratSpeed * timeDiff/1000;
            if(pos.y + yDiff > ratTarget.y){
                yDiff = ratTarget.y - pos.y;
                setNextRatTarget();
            }
            break;
    }
    assets.rat.move({x:xDiff, y:yDiff});
}

function setNextRatTarget(){
    if(ratProgress == ratPath.length - 1){
        checkEnd();
        return;
    }
    ratDir = ratPath[ratProgress].dir;
    if(ratDir === "right" || ratDir === "left"){
        assets.rat.setAnimation(ratDir + "Walk");
    }
    ratProgress++;
    ratTarget = gridCenters[ratPath[ratProgress].y][ratPath[ratProgress].x];
}

function checkEnd(layer){
    var ratPos = assets.rat.getPosition();
    var ratTile = getTile(ratPos);
    if(ratTile.y == 7 && ratTile.x == 13){
        endChallenge(false, "The rat escaped.", layer);
        return;
    }

    var distance = util.dist(assets.rat, assets.prince);
    if(distance > 400){
        assets.prince.setIndex(0);
    }
    else if(distance > 150){
        assets.prince.setIndex(1);
    }
    else{
        assets.prince.setIndex(2);
    }

    if(distance < 72){
        endChallenge(true, "You caught the rat!", layer);
        return;
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
    assets.rat.stop();
    if(isPass){
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

module.exports = page;
