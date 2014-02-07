var Page = require("./page");
var util = require("../util");

var page = new Page("earthIntro", 3, false);

var narrator;

page.setRequiredAssets([
    {name: "narrator", file: "narrator.png"}
]);

page.initPage = function(images, stage, layers){
    narrator = util.defineSprite({
        x:0,
        y:200,
        image: images.narrator,
        animation: "idle",
        frameRate: 3
    }, 805, 488, [{idle: 4}]);

    layers.dynBack.add(narrator);
};

page.startPage = function(){
    narrator.on('mousedown touchstart', function(e) {
        e.targetNode.start();
    }).on('mouseup touchend', function(e) {
        e.targetNode.stop();
    });
};

module.exports = page;
