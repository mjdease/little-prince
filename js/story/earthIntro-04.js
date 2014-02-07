var Page = require("./page");
var util = require("../util");

var page = new Page("earthIntro", 4, false);

var prince;

page.setRequiredAssets([
    {name: "prince", file: "prince.png"}
]);

page.initPage = function(images, stage, layers){
    prince = util.defineSprite({
        x:500,
        y:330,
        image: images.prince,
        animation: "idle",
        frameRate: 3
    }, 204, 378, [{idle: 3}]);
    layers.dynBack.add(prince);
};

page.startPage = function(){
    util.playWhileTouched(prince);
};

module.exports = page;
