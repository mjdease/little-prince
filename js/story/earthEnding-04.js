var Page = require("./page");
var util = require("../util");

var page = new Page("earthEnding", 4, false);

var fox;

page.setRequiredAssets([
    {name: "fox", file: "fox.png"}
]);

page.initPage = function(images, stage, layers){
    fox = util.defineSprite({
        x:600,
        y:240,
        image: images.fox,
        animation: "idle",
        frameRate: 3
    }, 555, 431, [{idle: 2}]);

    layers.dynBack.add(fox);
};

page.startPage = function(){
    fox.start();
};

module.exports = page;
