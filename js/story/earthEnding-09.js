var Page = require("./page");
var util = require("../util");

var page = new Page("earthEnding", 9, false);

var star;

page.setPreviousPage("earthEnding", 8);

page.setNextPage("menu", 0);

page.setRequiredAssets([
    {name: "star", file: "star.png"}
]);

page.initPage = function(images, stage, layers){
    star = util.defineSprite({
        x:360,
        y:100,
        image: images.star,
        animation: "idle",
        frameRate: 3
    }, 566, 567, {idle: 3});

    layers.dynBack.add(star);
};

page.startPage = function(){
    star.start();
};

page.setNextPage("menu", 0);

module.exports = page;
