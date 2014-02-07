var Page = require("./page");
var util = require("../util");

var page = new Page("earthEnding", 7, false);

var prince;

page.setRequiredAssets([
    {name: "prince", file: "prince.png"}
]);

page.initPage = function(images, stage, layers){
    prince = util.defineSprite({
        x:670,
        y:70,
        image: images.prince,
        animation: "idle",
        frameRate: 3
    }, 378, 609, {idle: 2});

    layers.dynBack.add(prince);
};

page.startPage = function(){
    prince.start();
};

module.exports = page;
