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
        var getFakeAccelerometer = startFakeAccelerometer();
        accWatchId =setInterval(function(){accelerometer = getFakeAccelerometer()}, 100);
    }
};

exports.get = function(){
    return accelerometer;
};

exports.destroy = function(){
    if(navigator.accelerometer){
        navigator.accelerometer.clearWatch(accWatchId);
    }
    else{
        clearInterval(accWatchId);
    }
    accWatchId = null;
    accelerometer = {x:0,y:0,z:0};
};

function startFakeAccelerometer(){
    var acc = {x:0,y:0,z:0};
    document.addEventListener("keydown", function(e){
        if (e.which == 37 && acc.x < 10) { // left
            acc.y -= 0.5;
        }
        if (e.which == 38 && acc.y > -10) { // up
            acc.x -= 0.5;
        }
        if (e.which == 39 && acc.x > -10) { // right
            acc.y += 0.5;
        }
        if (e.which == 40 && acc.y < 10) { // down
            acc.x += 0.5;
        }
    });
    return function(){
        return acc;
    };
}
