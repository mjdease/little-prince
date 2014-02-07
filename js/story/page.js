var Kinetic = require("../lib/kinetic");
var storybook = require("../book");
var text = require("./text");

function Page(sectionId, pageNum, isMenu){
    this.num = pageNum;
    this.id = sectionId + pageNum;
    this.text = text(sectionId, pageNum);
    this.hasChallenge = false;
    this.state = this.States.UNINITIALIZED;
    this.isMenu = isMenu;
    if(/\./.test(sectionId)){
        var parts = sectionId.split(".");
        this.section = parts[0];
        this.asteroidId = parts[1];
    }
    else{
        this.section = sectionId;
    }
    this.requiredImages = [{name:"background", path:getImagePath("background.jpg", this.section, this.num, this.asteroidId)}];
    // default navigation behavior
    if(pageNum === 0){
        this.previousPage = false;
    }
    else{
        this.previousPage = sectionId + (pageNum - 1);
    }
    this.nextPage = sectionId + (pageNum + 1);
}

Page.prototype.States = {
    UNINITIALIZED : 0,
    PLAYING : 1,
    PASSED : 2,
    FAILED : 3
};

Page.prototype.setPreviousPage = function(sectionId, pageNum){
    if(sectionId){
        this.previousPage = sectionId + pageNum;
    }
};

Page.prototype.setNextPage = function(sectionId, pageNum){
    if(sectionId){
        this.nextPage = sectionId + pageNum;
    }
};

Page.prototype.setChallengeText = function(text, x, y, color){
    this.challengeText = new Kinetic.Text({
        text : text,
        x : x,
        y : y,
        fontFamily: "lp_Body",
        fontSize: 24,
        fill: color || "red",
        lineHeight: 1.2,
        listening: true,
        stroke:color || "red",
        strokeWidth:1
    });
    this.hasChallenge = true;
};

Page.prototype.getState = function(){
    return this.state;
};

Page.prototype.setState = function(state){
    this.state = state;
    if(state == this.States.PASSED){
        storybook.pageComplete();
    }
};

Page.prototype.challengeComplete = function(){
    this.state = this.States.PASSED;
    storybook.pageComplete();
};

Page.prototype.setNarration = function(path){
    this.narrationSrc = path;
};

Page.prototype.setMusic = function(path){
    this.musicSrc = path;
};

// arguments in array of objects containing name and asset path
Page.prototype.setRequiredAssets = function(list){
    list.push({name : "background", file : "background.jpg"});
    for(var i = 0; i < list.length; i++){
        var img = list[i];
        if(img.file){
            img.path = getImagePath(img.file, this.section, this.num, this.asteroidId);
        }
        this.requiredImages.push(img);
    }
};

//override this.
//accepts assets, stage, and layers object arguments
Page.prototype.initPage = function(){};

//override this.
Page.prototype.startPage = function(){};

//override this.
Page.prototype.startChallenge = function(){};

//override this.
Page.prototype.destroyPage = function(){};

//override this.
//accepts frame, stage, and layers object arguments
Page.prototype.update = function(){};

//override this. accepts event object
Page.prototype.onStageClick = function(e){

};

function getImagePath(filename, section, page, asteroid){
    var path = "img/" + section;
    if(asteroid){
        path += "/" + asteroid;
    }
    return path + "/" + page + "/" + filename;
}

module.exports = Page;
