global.gameWidth = 1280;
global.gameHeight = 752;
global.gameAspectRatio = global.gameWidth/global.gameHeight;

var story = require("./story");
var book = require("./book");

document.addEventListener("DOMContentLoaded", function(){
    book.init(story);
});
