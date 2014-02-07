var Kinetic = require("../lib/kinetic");
var _ = require("lodash");
var Page = require("./page");

var page = new Page("earthIntro", 2, false);

var clouds = [];
var speed = -20;

page.setRequiredAssets([
    {name: "cloud1", file: "cloud1.png"},
    {name: "cloud2", file: "cloud2.png"},
    {name: "cloud3", file: "cloud3.png"},
]);

page.initPage = function(images, stage, layers){
    for(var i = 1; i < 4; i++){
        var cloud = new Kinetic.Image({
            x: _.random(30, 1200),
            y: _.random(30, 130),
            image: images["cloud" + i],
        });
        layers.dynBack.add(cloud);
        clouds.push(cloud);
    }
};

page.startPage = function(){

};

page.update = function(frame, stage, layers){
    var dispX = speed * frame.timeDiff / 1000;
    for(var i = 0; i < clouds.length; i++){
        var cloud = clouds[i];
        if(cloud.getX() + cloud.getWidth() < 0){
            cloud.setX(stage.getWidth());
        }
        else{
            cloud.move({x: dispX * (1 + i/2), y:0});
        }
    }
};

module.exports = page;
