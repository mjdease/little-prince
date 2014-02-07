var Kinetic = require("./lib/kinetic");
var audio = require("./audio");
var util = require("./util");

var navOffset = 10;
var sliderTypes = ["narration", "music", "effects"];

exports.init = function(saveData, stage, layers, images){
    var ui = {
        nav : {},
        text : {
            startY : 60,
            transitionSpeed : 800
        },
        settings : {}
    };

    ui.nav.next = new Kinetic.Image({
        image: images.next,
        x: global.gameWidth - navOffset - images.next.width,
        y: global.gameHeight - navOffset - images.next.height
    });

    ui.nav.prev = new Kinetic.Image({
        image: images.prev,
        x: navOffset,
        y: global.gameHeight - navOffset - images.prev.height
    });

    ui.nav.home = new Kinetic.Image({
        image: images.home,
        x: navOffset,
        y: navOffset
    });

    ui.nav.audio = new Kinetic.Image({
        image: images.audio,
        x: global.gameWidth - navOffset - images.audio.width,
        y: navOffset
    });

    ui.nav.loading = new Kinetic.Group({
        visible:false
    }).add(new Kinetic.Rect({
        width:global.gameWidth,
        height:global.gameHeight,
        fill:"black",
        opacity:0.8
    })).add(new Kinetic.Text({
        text:"Loading...",
        width:300,
        offsetX:150,
        x:global.gameWidth/2,
        y:global.gameHeight/2,
        fill:"#dddddd",
        stroke:"#dddddd",
        strokeWidth: 1,
        fontFamily:"lp_Body",
        fontSize:48,
        align: "center"
    }));

    ui.text.top = new Kinetic.Image({
        image: images.top,
        listening: false
    });
    ui.text.topHeight = images.top.height;

    ui.text.mid = new Kinetic.Image({
        image: images.mid,
        listening: false
    });
    ui.text.midHeight = images.mid.height;

    ui.text.bottomShow = images.bottom_show;
    ui.text.bottomHide = images.bottom_hide;
    ui.text.bottom = new Kinetic.Image({
        listening: true
    });

    ui.text.transitionIn = new Kinetic.Animation(function(frame){
        ui.text.position = "changing";
        var dispY = ui.text.transitionSpeed * frame.timeDiff / 1000;
        ui.text.group.move({x : 0, y : dispY});
        if(ui.text.group.getY() > ui.text.startY){
            ui.text.group.setY(ui.text.startY);
            ui.text.position = "down";
            ui.text.showHide.setImage(ui.text.bottomHide);
            ui.text.transitionIn.stop();
            layers.staticFront.batchDraw();
        }
    }, layers.staticFront);

    ui.text.transitionOut = new Kinetic.Animation(function(frame){
        ui.text.position = "changing";
        var dispY = -1 * ui.text.transitionSpeed * frame.timeDiff / 1000;
        ui.text.group.move({x : 0, y : dispY});
        if(ui.text.group.getY() < -ui.text.groupHeight){
            ui.text.group.setY(-ui.text.groupHeight);
            ui.text.position = "up";
            ui.text.showHide.setImage(ui.text.bottomShow);
            ui.text.transitionOut.stop();
            layers.staticFront.batchDraw();
        }
    }, layers.staticFront);

    ui.text.toggle = function(show){
        if(ui.text.transitionIn.isRunning() || ui.text.transitionOut.isRunning()){
            return;
        }
        if(typeof show === "boolean"){
            if(show && ui.text.position == "up"){
                ui.text.transitionIn.start();
            }
            else if(!show && ui.text.position == "down"){
                ui.text.transitionOut.start();
            }
        }
        else{
            if(ui.text.position === "down"){
                ui.text.transitionOut.start();
            }
            else{
                ui.text.transitionIn.start();
            }
        }
    };

    ui.settings.node = new Kinetic.Group();
    ui.settings.node.add(new Kinetic.Rect({
        width:global.gameWidth,
        height:global.gameHeight,
        fill:"black",
        opacity: 0.7
    })).add(new Kinetic.Image({
        image:images.audio_bg,
        x:global.gameWidth/2,
        y:global.gameHeight/2,
        offset: {x:246,y:165.5}
    }));

    ui.settings.close = new Kinetic.Image({
        image: images.audio_close,
        x: 860,
        y: 200
    });
    ui.settings.node.add(ui.settings.close);

    for(var i = 0; i < sliderTypes.length; i++){
        var type = sliderTypes[i];
        ui.settings[type] = new Slider(i, type);
        ui.settings.node.add(ui.settings[type].node);
    }

    function Slider(index, type){
        var that = this;
        var sliderOffsetX = 140;
        var sliderSpacing = 80;
        var sliderX = global.gameWidth / 2 - 248;
        var barWidth = images.audio_bar.width;

        this.getVolumeFromX = function(x){
            return util.map(x, sliderOffsetX, sliderOffsetX + barWidth, 0, 1);
        };

        this.getXFromVolume = function(volume){
            return util.map(volume, 0, 1, sliderOffsetX, sliderOffsetX + barWidth);
        };

        this.node = new Kinetic.Group({
            width: 476,
            x : sliderX,
            y : 300 + index * sliderSpacing
        });

        this.bar = new Kinetic.Image({
            image: images.audio_bar,
            x: sliderOffsetX
        });

        this.handle = new Kinetic.Image({
            image: images.audio_handle,
            x: this.getXFromVolume(saveData.audio[type]),
            offsetY: 6,
            offsetX: 20,
            draggable: true,
            dragBoundFunc: function(pos) {
                var scale = stage.scale().x;
                if(pos.x/scale < sliderX + sliderOffsetX){
                    pos.x = (sliderX + sliderOffsetX) * scale;
                }
                if(pos.x/scale > sliderX + sliderOffsetX + barWidth){
                    pos.x = (sliderX + sliderOffsetX + barWidth) * scale;
                }
                return {
                    x: pos.x,
                    y: this.getAbsolutePosition().y
                }
            }
        });

        this.handle.on("dragend", function(e){
            audio.setVolume(type, that.getVolumeFromX(that.handle.getX()));
        });

        this.label = new Kinetic.Text({
            text:type + " ",
            fontFamily:"lp_Body",
            fontSize:20,
            stroke:"black",
            strokeWidth:1,
            align:"right",
            fill:"black",
            y:5,
            width:sliderOffsetX
        });

        this.node.add(this.label).add(this.bar).add(this.handle);
    }

    return ui;
};

exports.createPageText = function(pageText, uiText){
    var maxHeight = Math.max(pageText[0].getHeight(), pageText[1].getHeight());
    var numMidSections = Math.ceil(maxHeight / uiText.midHeight);
    uiText.showHide = uiText.bottom.clone({
        image : uiText.bottomHide,
        y : uiText.topHeight + uiText.midHeight * numMidSections
    }).on("click", uiText.toggle);
    uiText.group = new Kinetic.Group({
        x : global.gameWidth/2,
        y : uiText.startY,
        offsetX : 500
    });
    uiText.group.add(uiText.top.clone());
    for(var i = 0; i < numMidSections; i++){
        uiText.group.add(uiText.mid.clone({
            y: uiText.topHeight + i * uiText.midHeight
        }));
    }
    uiText.group.add(uiText.showHide);
    uiText.groupHeight = uiText.topHeight + uiText.midHeight * numMidSections;
    uiText.position = "down";
    uiText.group.add(pageText[0]).add(pageText[1]);
    return uiText.group;
};

exports.displayChallengeText = function(stage, layers, ct, hintImg, uiText){
    var challengeText = ct.clone();
    var hint = new Kinetic.Image({
        image: hintImg,
        visible:false,
        offset : {x : hintImg.width/2, y : hintImg.height}
    });

    hint.on("click", function(e){
        e.cancelBubble = true;
        hint.setVisible(false);
        layers.staticFront.batchDraw();

        if(!currentPage.challengeStarted){
            currentPage.challengeStarted = true;
            currentPage.startChallenge(layers);
            if(narration) narration.stop();
            if(music) music.play();
            toggleText(false);
        }

        stage.off("click");
    });

    challengeText.on("click", function(e){
        e.cancelBubble = true;

        if(hint.getVisible()) return;

        var trigger = challengeText;
        hint.setPosition(trigger.getX() + trigger.getWidth()/2, trigger.getY());
        hint.setVisible(true);
        layers.staticFront.batchDraw();

        stage.on("click", function(){
            hint.setVisible(false);
            layers.staticFront.batchDraw();
            stage.off("click");
        });
    });


    uiText.group.add(hint).add(challengeText);
}
