var Page = require("./page");
var util = require("../util");

var page = new Page("earthIntro", 7, false);

var prince;

page.setRequiredAssets([
    {name: "prince", file: "prince.png"}
]);

page.initPage = function(images, stage, layers){
    prince = util.defineSprite({
        x:500,
        y:90,
        image: images.prince,
        animation: "idle",
        frameRate: 3
    }, 723, 498, {idle: 4});

    layers.dynBack.add(prince);
};

page.startPage = function(){
    prince.start();
};

module.exports = page;
