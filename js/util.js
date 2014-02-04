var Promise = require("promise");

// imageList - array of objects containing name and path
//          eg: [{name: "test", path: "assets/images/testimg.png"},
//               {name: "test2", path: "assets/images/test2img.png"}]
exports.loadImages = function(imageList){
    return new Promise(function(resolve, reject) {
        var numImages = imageList.length,
            images = {},
            numComplete = 0;

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
}
