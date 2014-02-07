var Page = require("./page");
var util = require("../util");

var prince, narrator;

var page = new Page("earthIntro", 0, false);

page.setRequiredAssets([
    {name: "narrator", file: "narrator.png"},
    {name: "prince", file: "prince.png"}
]);

page.initPage = function(images, stage, layers){
    // sprite animation for page
    prince = util.defineSprite({
        x:950,
        y:500,
        image: images.prince,
        animation: "idle",
        frameRate: 14
    }, 119, 236, [{idle: 3}]);

    narrator = util.defineSprite({
        x:100,
        y:40,
        image: images.narrator,
        animation: "idle",
        frameRate: 14
    }, 758, 710, [{idle: 4}]);

    layers.dynBack.add(prince).add(narrator);
};

page.startPage = function(){
    narrator.on("click", onSpriteClick);
    prince.on("click", onSpriteClick);
};

page.update = function(frame, stage, layers){
    if(page.getState() != page.States.PLAYING){
        return;
    }
};

function onSpriteClick(e){
    e.targetNode.start();
}

module.exports = page;
