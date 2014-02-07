var Kinetic = require("./lib/kinetic");
var uiAssets = require("./ui");
var data = require("./data");
var Sound = require("./audio").Sound;
var util = require("./util");

// KineticJS Containers
var stage, layers = {}, overlay;
var updateLoop;
var currentPage, targetPage;
var narration, music;
var pageIsLoading = true;
// Object containing all page instances, with the keys being the page IDs
var pages;
// Object containing all ui elements that may be displayed on any page
// main properties are nav, text, settings, and loading;
var ui;

var menuAssets = [
    {name: "home", path: "img/ui/btn-home.png"},
    {name: "audio", path: "img/ui/btn-audio.png"},
    {name: "next", path: "img/ui/btn-prev.png"},
    {name: "prev", path: "img/ui/btn-next.png"},
    {name: "top", path: "img/ui/text/top.png"},
    {name: "mid", path: "img/ui/text/content.png"},
    {name: "bottom_hide", path: "img/ui/text/bottom-hide.png"},
    {name: "bottom_show", path: "img/ui/text/bottom-show.png"},
    {name: "audio_bar", path: "img/ui/audio/bar.png"},
    {name: "audio_bg", path: "img/ui/audio/bg.png"},
    {name: "audio_handle", path: "img/ui/audio/handle.png"},
    {name: "audio_close", path: "img/ui/audio/close.png"},
];

exports.init = function(story, startPageId){
    data.loadGame();

    pages = story;

    for(var i = 0; i < pages.length; i++){
        var page = pages[i];
        if(page.hasChallenge){
            data.challenges(page.id, false);
        }
    }

    util.loadImages(menuAssets).then(function(images){
        stage = new Kinetic.Stage({
            container: "game-stage",
            width: global.gameWidth,
            height: global.gameHeight
        });

        window.addEventListener("resize", rescaleStage);

        rescaleStage();

        layers.staticBack = new Kinetic.Layer();
        layers.dynBack = new Kinetic.Layer();
        layers.dynFront = new Kinetic.Layer();
        layers.staticFront = new Kinetic.Layer();
        overlay = new Kinetic.Layer();

        stage.add(layers.staticBack);
        stage.add(layers.dynBack);
        stage.add(layers.dynFront);
        stage.add(layers.staticFront);
        stage.add(overlay);

        ui = uiAssets.init(data.get(), stage, layers, images);

        ui.nav.next.on("click", function(){
            if(pageIsLoading) return;
            changePage("next");
        });
        ui.nav.prev.on("click", function(){
            if(pageIsLoading) return;
            changePage("previous");
        });
        ui.nav.home.on("click", function(){
            if(pageIsLoading) return;
            exports.goToPage("menu0");
        });
        ui.nav.audio.on("click", function(){
            if(pageIsLoading) return;
            openSettings();
        });

        ui.settings.close.on("click", function(){
            closeSettings();
        });

        overlay.add(ui.nav.next).add(ui.nav.prev).add(ui.nav.home).add(ui.nav.audio).add(ui.nav.loading);

        document.getElementById("game-stage").style.display = "block";

        updateLoop = new Kinetic.Animation(function(frame){
            currentPage.update(frame, stage, layers);
        }, [layers.dynBack, layers.dynFront]);

        if(startPageId && pages[startPageId]){
            targetPage = pages[startPageId];
        }
        else{
            console.error("Invalid page ID.");
        }

        initPage();

    },  function(){
        // error loading images
    });
};

exports.continueSavedGame = function(){
    if(data.get("currentPage")){
        exports.goToPage(data.get("currentPage"));
    }
    else{
        changePage("next");
    }
};

exports.goToPage = function(id){
    if(id == "next"){
        changePage("next");
    }
    else{
        targetPage = pages[id];
        changePage(false);
    }
};

exports.pageComplete = function(){
    if(currentPage.hasChallenge){
        data.challenges(currentPage.id, true);
    }
    if(currentPage.asteroidId && currentPage.nextPage === "menu1"){
        console.log("!ast");
        data.asteroids(currentPage.asteroidId, true);
    }
    updateButtonVisibility();
};

exports.getScale = function(){
    return stage.scale().x;
};

exports.getAsteroidProgress = function(){
    console.log(data.get("asteroids"));
    return data.get("asteroids");
};

exports.openSettings = openSettings;


function initPage(){
    // destroy old page
    if(narration){
        narration.destroy();
        narration = null;
    }
    if(music){
        music.destroy();
        music = null;
    }
    stage.off("click mousedown mouseup mousemove touchstart touchend touchmove");
    if(currentPage){
        currentPage.setState(currentPage.States.UNINITIALIZED);
        currentPage.destroyPage();
    }

    // set new page
    currentPage = targetPage;
    targetPage = null;
    if(currentPage.id != "menu0"){
        data.set("currentPage", currentPage.id);
    }

    // Show loading overlay if page doesn't load quickly
    setTimeout(function(){
        if(pageIsLoading) ui.nav.loading.show();
    }, 200);

    // initalize new page
    util.loadImages(currentPage.requiredImages).then(function(images){
        if(images["background"]){
            layers.staticBack.add(new Kinetic.Image({
                image : images.background,
                width: global.gameWidth,
                height: global.gameHeight
            }));
        }
        var target = new Kinetic.Rect({
            x:0, y:0,
            width: global.gameWidth,
            height: global.gameHeight
        });
        target.on("click", function(e){
            currentPage.onStageClick(e);
        });
        layers.staticBack.add(target);

        if(currentPage.text){
            layers.staticFront.add(uiAssets.createPageText(currentPage.text, ui.text));
        }

        if(currentPage.hasChallenge && images["hint"]){
            currentPage.challengeStarted = false;
            uiAssets.displayChallengeText(stage, layers, currentPage.challengeText, images.hint, ui.text);
        }

        if(currentPage.narrationSrc){
            narration = new Sound(currentPage.narrationSrc, false, false, "narration");
        }
        if(currentPage.musicSrc){
            music = new Sound(currentPage.musicSrc, false, true, "music");
        }

        layers.staticFront.batchDraw();
        layers.staticBack.batchDraw();

        currentPage.initPage(images, stage, layers);
        updateLoop.start();

        pageIsLoading = false;

        if(narration){
            narration.play();
        }
        currentPage.startPage(layers);

        if(!currentPage.hasChallenge){
            exports.pageComplete();
        }
        else{
            updateButtonVisibility();
        }

        ui.nav.loading.hide();
    },
    function(){
        // image loading failed
    });
}

function changePage (page){
    pageIsLoading = true;
    if(page){
        var isNext = (page == "next");
        targetPage = pages[currentPage[(isNext ? "nextPage" : "previousPage")]];
    }
    updateLoop.stop();
    if(narration) narration.stop();
    if(music) music.stop();
    clearStage();
    initPage();
}

function clearStage(){
    for(var layer in layers){
        layers[layer].destroyChildren();
    }
};

function openSettings(){
    overlay.add(ui.settings.node);
    overlay.batchDraw();
}

function closeSettings(){
    ui.settings.node.remove();
    overlay.batchDraw();
}

function updateButtonVisibility(){
    var challengeDone = true;
    if(currentPage.hasChallenge){
        challengeDone = data.challenges(currentPage.id);
    }

    ui.nav.home.toggle(currentPage.id != "menu0");
    ui.nav.audio.toggle(currentPage.id != "menu0");
    ui.nav.prev.toggle(!currentPage.isMenu && !!currentPage.previousPage);
    ui.nav.next.toggle(!currentPage.isMenu && !!currentPage.nextPage && challengeDone);

    overlay.batchDraw();
}

function rescaleStage(){
    var ratio = window.innerWidth/window.innerHeight;
    var scale;
    if(ratio > global.gameAspectRatio){
        scale = window.innerHeight / global.gameHeight;
    }
    else{
        scale = window.innerWidth / global.gameWidth;
    }
    if(scale > 1){
        scale = 1;
    }
    var el = document.getElementById("game-stage");
    el.style.width = global.gameWidth * scale + "px";
    el.style.height = global.gameHeight * scale + "px";
    stage.scale({x: scale, y: scale}).draw();
}
