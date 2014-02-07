var Page = require("./page");
var util = require("../util");

var page = new Page("earthEnding", 6, false);

var prince;

page.setRequiredAssets([
    {name: "prince", file: "prince.png"}
]);

page.initPage = function(images, stage, layers){
    prince = util.defineSprite({
        x:550,
        y:300,
        image: images.prince,
        animation: "idle",
        frameRate: 3
    }, 551, 461, {idle: 2});

    layers.dynBack.add(prince);
};

page.startPage = function(){
    prince.start();
};

module.exports = page;
