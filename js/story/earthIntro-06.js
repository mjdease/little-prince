var Page = require("./page");
var util = require("../util");

var page = new Page("earthIntro", 6, false);

var hand;

page.setRequiredAssets([
    {name: "hand", file: "hand.png"}
]);

page.initPage = function(images, stage, layers){
    hand = util.defineSprite({
        x:0,
        y:330,
        image: images.hand,
        animation: "idle",
        frameRate: 7
    }, 1223, 607, [{idle: 3}]);

    layers.dynBack.add(hand);
};

page.startPage = function(){
    hand.start();
};

module.exports = page;
