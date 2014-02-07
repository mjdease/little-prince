var Kinetic = require("../lib/kinetic");
var Page = require("./page");
var storybook = require("../book");
var data = require("../data");

var assets = {};
var canContinue;

var page = new Page("menu", 0, true);

page.setPreviousPage(false);

page.setNextPage("earthIntro", 0);

page.setRequiredAssets([
    {name: "continueGame", file:"btn-continue.png"},
    {name: "newGame", file:"btn-new.png"},
    {name: "credits", file:"btn-credits.png"},
    {name: "glossary", file:"btn-glossary.png"},
    {name: "title", file:"title.png"},
    {name: "home", path: "img/ui/btn-home.png"},
    {name: "audio", path: "img/ui/btn-audio.png"},
    {name: "head", file: "header.png"},
    {name: "glossaryTxt", file: "glossary.png"},
    {name: "creditsTxt", file: "credits.png"}
]);

page.initPage = function(images, stage, layers){
    var glossaryHeight = images.glossaryTxt.height;
    var scale = storybook.getScale();

    canContinue = data.hasSavedGame();

    assets.head = new Kinetic.Image({
        image: images.head,
        visible:false
    });
    assets.glossary = new Kinetic.Image({
        image:images.glossaryTxt,
        visible:false,
        draggable: true,
        dragBoundFunc: function(pos) {
            if(pos.y/scale > 0){
                pos.y = 0 * scale;
            }
            if(pos.y/scale < global.gameHeight - 100 - glossaryHeight){
                pos.y = (global.gameHeight - 100 - glossaryHeight) * scale;
            }
            return {
                x: this.getAbsolutePosition().x,
                y: pos.y
            }
        }
    });

    assets.credits = new Kinetic.Image({
        image:images.creditsTxt,
        visible:false
    });

    assets.home = new Kinetic.Image({
        image: images.home,
        visible:false,
        x: 10,
        y: 752 - 10 - 90
    });

    assets.audio = new Kinetic.Image({
        image: images.audio,
        visible:false,
        x: 1280 - 10 - 75,
        y: 752 - 10 - 90
    });

    assets.title = new Kinetic.Image({
        x: 250,
        y: 70,
        image: images.title,
    });

    assets.continueBtn = new Kinetic.Image({
        x: 480,
        y: 300,
        image: images.continueGame,
        opacity: canContinue ? 1 : 0.6
    });

    assets.startBtn = new Kinetic.Image({
        x: 480,
        y: 400,
        image: images.newGame,
    });

    assets.creditsBtn = new Kinetic.Image({
        x: 480,
        y: 600,
        image: images.credits,
    });

    assets.glossaryBtn = new Kinetic.Image({
        x: 480,
        y: 500,
        image: images.glossary,
    });

    for(var name in assets){
        layers.staticFront.add(assets[name]);
    }
    assets.glossary.moveToBottom();
    layers.staticFront.batchDraw();
};

page.startPage = function(layers){
    assets.startBtn.on("click", function(){
        data.discardSavedGame();
        storybook.goToPage("next");
    });

    if(canContinue){
        assets.continueBtn.on("click", function(){
            storybook.continueSavedGame();
        });
    }

    assets.glossaryBtn.on("click", function(){
        menu(false);
        credits(false);
        glossary(true);
        layers.staticFront.batchDraw();
    });
    assets.creditsBtn.on("click", function(){
        menu(false);
        glossary(false);
        credits(true);
        layers.staticFront.batchDraw();
    });
    assets.home.on("click", function(){
        credits(false);
        glossary(false);
        menu(true);
        layers.staticFront.batchDraw();
    });
    assets.audio.on("click", function(){
        storybook.openSettings();
    });
};

page.update = function(frame, stage, layers){

};

function menu(visible){
    assets.title.toggle(visible);
    assets.continueBtn.toggle(visible);
    assets.startBtn.toggle(visible);
    assets.creditsBtn.toggle(visible);
    assets.glossaryBtn.toggle(visible);
}

function credits(visible){
    assets.credits.toggle(visible);
    assets.audio.toggle(visible);
    assets.home.toggle(visible);
}

function glossary(visible){
    assets.glossary.toggle(visible);
    assets.head.toggle(visible);
    assets.audio.toggle(visible);
    assets.home.toggle(visible);
}

module.exports = page;
