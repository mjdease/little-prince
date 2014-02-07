var Kinetic = require("../lib/kinetic");
var Page = require("./page");
var storybook = require("../book");

var asteroidBtns = [];
var earth;
var asteroidsComplete = false;

var page = new Page("menu", 1, true);

page.setPreviousPage(false);

page.setNextPage("earthEnding", 0);

page.setRequiredAssets([
    {name: "b612", file: "princeN.png"},
    {name: "b325", file: "kingN.png"},
    {name: "b330", file: "geographN.png"},
    {name: "b329", file: "lampN.png"},
    {name: "b328", file: "businessN.png"},
    {name: "b327", file: "drunkardN.png"},
    {name: "b326", file: "proudN.png"},
    {name: "earth", file: "earthN.png"},
    {name: "earthS", file: "earthA.png"},
    {name: "b612p", file: "princeA.png"},
    {name: "b325p", file: "kingA.png"},
    {name: "b330p", file: "geographA.png"},
    {name: "b329p", file: "lampA.png"},
    {name: "b328p", file: "businessA.png"},
    {name: "b327p", file: "drunkardA.png"},
    {name: "b326p", file: "proudA.png"}
]);

page.initPage = function(images, stage, layers){
    var asteroids = {
        b612: {x: 40, y: 220},
        b325: {x: 185, y: 0},
        b330: {x: 120, y: 500},
        b329: {x: 700, y: 520},
        b328: {x: 980, y: 380},
        b327: {x: 1000, y: 40},
        b326: {x: 550, y: 0}
    };

    var progress = storybook.getAsteroidProgress();
    var incomplete = 0;
    for(var name in asteroids){
        if(name){
            var passed = false;
            if(progress[name]){
                passed = true;
            }
            else{
                incomplete++;
            }
            var btnText = new Kinetic.Image({
                image: images[name + (passed ? "p" : "")],
                x : asteroids[name].x,
                y : asteroids[name].y
            });
            btnText.nextPageId = "asteroids." + name + 0;
            asteroidBtns.push(btnText);
            layers.staticFront.add(btnText);
        }
    }
    asteroidsComplete = incomplete === 0;
    earth = new Kinetic.Image({
        image: asteroidsComplete ? images.earthS : images.earth,
        x : 380,
        y : 140
    });
    layers.dynBack.add(earth);
};

page.startPage = function(){
    for(var i = 0; i < asteroidBtns.length; i++){
        btn = asteroidBtns[i];
        btn.on("click", function(e){
            storybook.goToPage(e.targetNode.nextPageId);
        });
    }
    if(asteroidsComplete){
        earth.on("click", function(){
            storybook.goToPage("next");
        });
    }
};

module.exports = page;
