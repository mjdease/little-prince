var Kinetic = require("./lib/kinetic");
var Promise = require("promise");

exports.map = function(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
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
