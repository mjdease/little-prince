var Kinetic = require("./lib/kinetic");
var Promise = require("promise");
var _ = require("lodash");

exports.map = function(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};

// Distance between two kinetic objects or position objects
exports.dist = function(obj1, obj2){
    var pt1, pt2;
    if(_.isNumber(obj1.x) && _.isNumber(obj1.y)){
        pt1 = obj1;
    }
    else{
        pt1 = obj1.position();
    }
    if(_.isNumber(obj2.x) && _.isNumber(obj2.y)){
        pt2 = obj2;
    }
    else{
        pt2 = obj2.position();
    }
    return Math.sqrt(Math.abs(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2)));
};

// imageList - array of objects containing name and path
//          eg: [{name: "test", path: "assets/images/testimg.png"},
//               {name: "test2", path: "assets/images/test2img.png"}]
exports.loadImages = function(imageList){
    return new Promise(function(resolve, reject) {
        var numImages = imageList.length,
            images = {},
            numComplete = 0;

        if(!imageList){
            resolve();
        }

        for(var i = 0; i < numImages; i++){
            (function(obj){
                var img = new Image();
                img.onload = function(){
                    numComplete++;
                    images[obj.name] = img;
                    if(numComplete == numImages){
                        resolve(images);
                    }
                };
                img.onerror = function(e){
                    console.log("Failed to load " + e.target.src);
                    reject();
                };
                img.src = obj.path;
            })(imageList[i]);
        }
    });
};

//optons - all sprite options except for animations
//width - frame width
//height - frame height
//animList - Array of objects where the object keys are the names of the animations
//          and the value is the number of frames.
//          eg: [{idle:1}, {run: 14}, {walk: 14}]
 exports.defineSprite = function(options, width, height, animList){
    var anim = {}, index = 0;
    if(_.isArray(animList)){
        for(var i = 0; i < animList.length; i++){
            var animation = animList[i];
            var animName = Object.getOwnPropertyNames(animation)[0];
            anim[animName] = [];
            for(var j = 0; j < animation[animName]; j++){
                anim[animName].push(j * width);
                anim[animName].push(index * height);
                anim[animName].push(width);
                anim[animName].push(height);
            }
            index++;
        }
    }
    // old buggy code, left in for compatibility
    else{
        for(var name in animList){
            anim[name] = [];
            for(var j = 0; j < animList[name]; j++){
                anim[name].push(j * width);
                anim[name].push(index * height);
                anim[name].push(width);
                anim[name].push(height);
            }
            index++;
        }
    }
    options.animations = anim;
    return new Kinetic.Sprite(options);
};

exports.playWhileTouched = function(node){
    node.on('mousedown touchstart', function(e) {
        e.targetNode.start();
    }).on('mouseup touchend', function(e) {
        e.targetNode.stop();
    });
};

exports.addToStage = function(layer, objs){
    if(_.isArray(objs)){
        for(var i = 0; i < objs.length; i++){
            layer.add(objs[i]);
        }
    }
    else{
        layer.add(objs);
    }
};

// Add jquery-style visibility toggle function to Kinetic nodes
Kinetic.Util.addMethods(Kinetic.Image, {
    toggle : function(visible){
        if(typeof visible !== "undefined"){
            this.setVisible(!!visible);        }
        else{
            this.setVisible(!this.getVisible());
        }
    }
});
