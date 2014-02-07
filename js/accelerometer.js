// Interfaces with the PhoneGap accelerometer api
// or emulates accelerometer values.

var accelerometer = {x:0,y:0,z:0};
var accWatchId = null;

exports.init = function(){
    if(navigator.accelerometer){
        accWatchId = navigator.accelerometer.watchAcceleration(function(acc){
            accelerometer = acc;
        }, function(){}, {frequency:100});
    }
    else{
        document.addEventListener("keydown", keyboardInput);
    }
};

exports.reset = function(){
    accelerometer = {x:0,y:0,z:0};
};

exports.get = function(){
    return accelerometer;
};

exports.destroy = function(){
    if(navigator.accelerometer){
        navigator.accelerometer.clearWatch(accWatchId);
    }
    else{
        document.removeEventListener("keydown", keyboardInput);
    }
    accWatchId = null;
    accelerometer = {x:0,y:0,z:0};
};

function keyboardInput(e){
    if (e.which == 37 && accelerometer.x < 10) { // left
        accelerometer.y -= 0.5;
    }
    if (e.which == 38 && accelerometer.y > -10) { // up
        accelerometer.x -= 0.5;
    }
    if (e.which == 39 && accelerometer.x > -10) { // right
        accelerometer.y += 0.5;
    }
    if (e.which == 40 && accelerometer.y < 10) { // down
        accelerometer.x += 0.5;
    }
}
