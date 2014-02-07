var audio = require("./audio");

// Manages reading and writing data that must persist between sessions.
var saved = {};

exports.get = function(key){
    if(key){
        return saved[key];
    }
    else{
        return saved;
    }
};

exports.set = function(key, value){
    saved[key] = value;
    exports.saveGame();
};

exports.audio = function(type, value){
    if(value !== undefined){
        saved.audio[type] = value;
        exports.saveGame();
    }
    else{
        return saved.audio[type];
    }
};

exports.challenges = function(id, value){
    if(value !== undefined){
        saved.challenges[id] = value;
        exports.saveGame();
    }
    else{
        return saved.challenges[id];
    }
};

exports.asteroids = function(id, value){
    if(value !== undefined){
        saved.asteroids[id] = value;
        exports.saveGame();
    }
    else{
        return saved.asteroids[id];
    }
};

exports.hasSavedGame = function(){
    return saved.currentPage && saved.currentPage !== "menu0";
};

exports.discardSavedGame = function(){
    saved = {challenges:{}, asteroids:{}};
    audio.setDefaultLevels();
    exports.saveGame();
};

exports.loadGame = function(){
    var saveData = localStorage.getItem("lp_data");
    if(saveData){
        saved = JSON.parse(saveData);
    }
    else{
        exports.discardSavedGame();
    }
    return saved;
};

exports.saveGame = function(){
    localStorage.setItem("lp_data", JSON.stringify(saved));
};
